import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { query } from './db.js';

dotenv.config();

const emailConfig = {
  host: process.env.VITE_SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.VITE_SMTP_PORT || '587'),
  secure: process.env.VITE_SMTP_SECURE === 'true',
  auth: {
    user: process.env.VITE_SMTP_USERNAME,
    pass: process.env.VITE_SMTP_PASSWORD,
  },
  from: process.env.VITE_SMTP_FROM || 'noreply@southernmaldives.com',
  to: process.env.VITE_ADMIN_EMAIL || 'admin@southernmaldives.com',
};

const transporter = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  secure: emailConfig.secure,
  auth: emailConfig.auth.user && emailConfig.auth.pass ? emailConfig.auth : undefined,
});

export async function verifySmtpConnection() {
  return transporter.verify();
}

function interpolate(template, data) {
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) => {
    const value = data[key];
    return value !== undefined && value !== null ? String(value) : '';
  });
}

function validateRequiredVariables(subject, body, requiredVariables) {
  return requiredVariables.every((variable) => {
    const placeholder = `{{${variable}}}`;
    return subject.includes(placeholder) || body.includes(placeholder);
  });
}

export async function getEmailTemplates() {
  return query('SELECT * FROM app_1e21816bb9_email_templates ORDER BY name ASC');
}

export async function getEmailTemplateByKey(key) {
  const rows = await query('SELECT * FROM app_1e21816bb9_email_templates WHERE key = $1 LIMIT 1', [key]);
  return rows[0] || null;
}

export async function upsertEmailTemplate({ key, name, subject, body, required_variables }) {
  if (!key || !name || !subject || !body) {
    throw new Error('Template key, name, subject, and body are required.');
  }

  if (!Array.isArray(required_variables)) {
    throw new Error('required_variables must be an array of strings.');
  }

  if (!validateRequiredVariables(subject, body, required_variables)) {
    throw new Error('One or more required variables are missing from the email subject or body.');
  }

  const updatedAt = new Date();
  const existing = await getEmailTemplateByKey(key);

  if (existing) {
    const rows = await query(
      `UPDATE app_1e21816bb9_email_templates
       SET name = $1,
           subject = $2,
           body = $3,
           required_variables = $4,
           updated_at = $5
       WHERE key = $6
       RETURNING *`,
      [name, subject, body, JSON.stringify(required_variables), updatedAt, key]
    );
    return rows[0];
  }

  const rows = await query(
    `INSERT INTO app_1e21816bb9_email_templates
      (key, name, subject, body, required_variables, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [key, name, subject, body, JSON.stringify(required_variables), updatedAt, updatedAt]
  );
  return rows[0];
}

export async function sendEmail({ to, subject, html, replyTo }) {
  if (!emailConfig.auth.user || !emailConfig.auth.pass) {
    throw new Error('SMTP is not configured. Please set VITE_SMTP_USERNAME and VITE_SMTP_PASSWORD.');
  }

  return transporter.sendMail({
    from: emailConfig.from,
    to,
    subject,
    html,
    replyTo,
  });
}

function buildEmailHtml(template, data) {
  return interpolate(template.body, data);
}

function buildEmailSubject(template, data) {
  return interpolate(template.subject, data);
}

export async function sendEnquiryEmails(enquiry) {
  const agencyTemplate = await getEmailTemplateByKey('agency_notification');
  const customerTemplate = await getEmailTemplateByKey('customer_confirmation');

  const defaultAgencyTemplate = {
    subject: 'New Luxury Enquiry: {{destination}} ({{trip_type}})',
    body: `
      <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.5;">
        <h2 style="color: #047857;">New Luxury Enquiry Received</h2>
        <p>A new customer enquiry has been submitted through the website.</p>
        <h3>Customer Details</h3>
        <ul>
          <li><strong>Name:</strong> {{name}}</li>
          <li><strong>Email:</strong> <a href="mailto:{{email}}">{{email}}</a></li>
          <li><strong>Phone:</strong> {{phone}}</li>
          <li><strong>Destination:</strong> {{destination}}</li>
          <li><strong>Trip Type:</strong> {{trip_type}}</li>
          <li><strong>Check-in:</strong> {{check_in}}</li>
          <li><strong>Check-out:</strong> {{check_out}}</li>
          <li><strong>Guests:</strong> {{guests}} (Adults: {{adults}}, Children: {{children}})</li>
          <li><strong>Contact Preference:</strong> {{contact_preference}}</li>
          <li><strong>Special Requests:</strong> {{special_requests}}</li>
        </ul>
      </div>`,
    required_variables: ['name', 'email', 'phone', 'destination', 'trip_type', 'check_in', 'check_out', 'guests', 'adults', 'children', 'contact_preference'],
  };

  const defaultCustomerTemplate = {
    subject: 'We’ve received your enquiry for {{destination}}',
    body: `
      <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.5;">
        <h2 style="color: #047857;">Enquiry Received</h2>
        <p>Dear {{name}},</p>
        <p>Thank you for contacting Southern Maldives Travels. We have received your enquiry and will reach out shortly with a personalized itinerary.</p>
        <h3>Your enquiry details</h3>
        <ul>
          <li><strong>Destination:</strong> {{destination}}</li>
          <li><strong>Check-in:</strong> {{check_in}}</li>
          <li><strong>Check-out:</strong> {{check_out}}</li>
          <li><strong>Guests:</strong> {{guests}}</li>
          <li><strong>Special Requests:</strong> {{special_requests}}</li>
        </ul>
        <p>Someone from our concierge team will contact you within 24 hours.</p>
        <p>Best regards,<br/>Southern Maldives Travels</p>
      </div>`,
    required_variables: ['name', 'destination', 'check_in', 'check_out', 'guests'],
  };

  const agency = agencyTemplate || defaultAgencyTemplate;
  const customer = customerTemplate || defaultCustomerTemplate;
  const data = {
    ...enquiry,
    trip_type: enquiry.trip_type || 'Custom Trip',
    special_requests: enquiry.special_requests || 'None',
  };

  await sendEmail({
    to: emailConfig.to,
    subject: buildEmailSubject(agency, data),
    html: buildEmailHtml(agency, data),
    replyTo: enquiry.email,
  });

  await sendEmail({
    to: enquiry.email,
    subject: buildEmailSubject(customer, data),
    html: buildEmailHtml(customer, data),
    replyTo: emailConfig.to,
  });
}

export function getEmailPlaceholders() {
  return [
    'name',
    'email',
    'phone',
    'destination',
    'trip_type',
    'check_in',
    'check_out',
    'guests',
    'adults',
    'children',
    'room_type',
    'airport_transfer',
    'meal_plan',
    'special_requests',
    'contact_preference',
  ];
}
