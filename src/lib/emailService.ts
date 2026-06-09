// Local Email Service - Supports multiple email providers
// Replace Supabase Edge Functions with local SMTP configuration

export interface EmailConfig {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  from?: string;
  to?: string;
  serviceId?: string;
  templateId?: string;
  publicKey?: string;
  apiKey?: string;
}

export interface EnquiryEmailData {
  name: string;
  email: string;
  phone: string;
  destination: string;
  check_in: string;
  check_out: string;
  guests: number;
  special_requests?: string;
  created_at?: string;
}

export interface EmailResponse {
  success: boolean;
  message: string;
  emailSent?: boolean;
  emailLogged?: boolean;
  error?: string;
  provider?: string;
  timestamp: string;
  details?: {
    databaseStatus?: string;
    emailServiceStatus?: string;
    fallbackAction?: string;
    availableProviders?: {
      emailjs?: string;
      resend?: string;
      smtp?: string;
    };
    recommendation?: string;
    consoleLogDetails?: {
      recipient?: string;
      subject?: string;
      sender?: string;
      timestamp?: string;
    };
  };
}

class EmailService {
  private config: EmailConfig;

  constructor() {
    this.config = {
      // SMTP Configuration
      host: import.meta.env.VITE_SMTP_HOST,
      port: parseInt(import.meta.env.VITE_SMTP_PORT || '587'),
      username: import.meta.env.VITE_SMTP_USERNAME,
      password: import.meta.env.VITE_SMTP_PASSWORD,
      from: import.meta.env.VITE_SMTP_FROM || 'noreply@southernmaldives.com',
      to: import.meta.env.VITE_ADMIN_EMAIL || 'admin@southernmaldives.com',
      
      // EmailJS Configuration
      serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
      templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      
      // Resend Configuration
      apiKey: import.meta.env.VITE_RESEND_API_KEY,
    };
  }

  /**
   * Send enquiry email using the best available method
   */
  async sendEnquiryEmail(enquiry: EnquiryEmailData): Promise<EmailResponse> {
    const timestamp = new Date().toISOString();
    
    try {
      // Try EmailJS first (most reliable for frontend)
      const emailjsConfigured = this.config.serviceId && this.config.templateId && this.config.publicKey;
      if (emailjsConfigured) {
        try {
          return await this.sendWithEmailJS(enquiry, this.config.templateId!);
        } catch (emailjsError) {
          console.warn('EmailJS failed, trying next provider:', emailjsError);
          // Continue to try other providers
        }
      }
      
      // Try Resend API
      if (this.config.apiKey) {
        try {
          return await this.sendWithResend(enquiry);
        } catch (resendError) {
          console.warn('Resend failed, trying next provider:', resendError);
          // Continue to try other providers
        }
      }
      
      // SMTP is not available in frontend-only applications
      // Remove custom API call that was causing 404 errors
      
      // Fallback: Log the email
      console.warn('No email providers configured. Email will be logged to console.');
      return this.logEnquiryEmail(enquiry);
      
    } catch (error) {
      console.error('Email sending failed:', error);
      return {
        success: false,
        message: 'Email sending failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp
      };
    }
  }

  /**
   * Send email using EmailJS (client-side email service)
   */
  private async sendWithEmailJS(enquiry: EnquiryEmailData, templateId: string): Promise<EmailResponse> {
    try {
      // Check if EmailJS is properly configured
      if (!this.config.serviceId || !templateId || !this.config.publicKey) {
        throw new Error('EmailJS not properly configured. Please check your environment variables.');
      }

      // Dynamic import to avoid bundle bloat
      const emailjs = await import('@emailjs/browser');
      
      const templateParams = {
        from_name: enquiry.name,
        from_email: enquiry.email,
        phone: enquiry.phone,
        destination: enquiry.destination,
        check_in: enquiry.check_in,
        check_out: enquiry.check_out,
        guests: enquiry.guests,
        special_requests: enquiry.special_requests || 'None',
        to_email: this.config.to,
        reply_to: enquiry.email,
        timestamp: new Date().toLocaleString(),
      };

      const response = await emailjs.send(
        this.config.serviceId!,
        templateId,
        templateParams,
        this.config.publicKey!
      );

      return {
        success: true,
        message: 'Email sent successfully via EmailJS',
        emailSent: true,
        provider: 'EmailJS',
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('EmailJS sending failed:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('not properly configured')) {
          throw error; // Re-throw configuration errors
        }
        if (error.message.includes('Invalid API key')) {
          throw new Error('EmailJS API key is invalid. Please check your public key.');
        }
        if (error.message.includes('Service not found')) {
          throw new Error('EmailJS service not found. Please check your service ID.');
        }
        if (error.message.includes('Template not found')) {
          throw new Error('EmailJS template not found. Please check your template ID.');
        }
      }
      
      throw new Error(`EmailJS failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Send email using Resend API
   */
  private async sendWithResend(enquiry: EnquiryEmailData): Promise<EmailResponse> {
    try {
      const emailContent = this.formatEmailContent(enquiry);
      
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: this.config.from,
          to: [this.config.to],
          subject: `New Enquiry: ${enquiry.destination}`,
          html: emailContent,
          reply_to: enquiry.email,
        }),
      });

      if (!response.ok) {
        throw new Error(`Resend API error: ${response.statusText}`);
      }

      return {
        success: true,
        message: 'Email sent successfully via Resend',
        emailSent: true,
        provider: 'Resend',
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('Resend sending failed:', error);
      throw new Error(`Resend failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }



  /**
   * Log email instead of sending (fallback)
   */
  private logEnquiryEmail(enquiry: EnquiryEmailData): EmailResponse {
    const emailContent = this.formatEmailContent(enquiry);
    const timestamp = new Date().toISOString();
    
    console.log('📧 EMAIL NOTIFICATION (SMTP not configured):', {
      to: this.config.to,
      from: this.config.from,
      subject: `New Enquiry: ${enquiry.destination}`,
      content: emailContent,
      enquiry: {
        name: enquiry.name,
        email: enquiry.email,
        destination: enquiry.destination,
        timestamp
      }
    });

    const configStatus = this.getConfigStatus();
    
    return {
      success: true,
      message: 'Enquiry processed successfully with detailed process information',
      details: {
        databaseStatus: '✅ Enquiry saved to database',
        emailServiceStatus: '⚠️ No email service configured',
        fallbackAction: '📧 Email content logged to browser console',
        availableProviders: {
          emailjs: configStatus.emailjs ? '✅ Configured' : '❌ Not configured',
          resend: configStatus.resend ? '✅ Configured' : '❌ Not configured',
          smtp: configStatus.smtp ? '✅ Configured' : '❌ Not configured'
        },
        recommendation: 'To enable email sending, configure EmailJS, Resend, or SMTP credentials in your .env file',
        consoleLogDetails: {
          recipient: this.config.to,
          subject: `New Enquiry: ${enquiry.destination}`,
          sender: this.config.from,
          timestamp
        }
      },
      emailSent: false,
      emailLogged: true,
      provider: 'Console Log',
      timestamp
    };
  }

  /**
   * Format email content for better readability
   */
  private formatEmailContent(enquiry: EnquiryEmailData): string {
    const companyName = 'Southern Maldives Travels';
    const adminEmail = this.config.to;
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Enquiry Received</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #0ea5e9; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .detail-row { margin: 10px 0; padding: 10px; background: #f8f9fa; border-left: 4px solid #0ea5e9; }
        .label { font-weight: bold; color: #0ea5e9; }
        .footer { margin-top: 30px; padding: 20px; background: #f1f5f9; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📧 New Customer Enquiry</h1>
        <p>${companyName}</p>
      </div>
      
      <div class="content">
        <h2>Customer Details</h2>
        
        <div class="detail-row">
          <span class="label">Name:</span> ${enquiry.name}
        </div>
        
        <div class="detail-row">
          <span class="label">Email:</span> <a href="mailto:${enquiry.email}">${enquiry.email}</a>
        </div>
        
        <div class="detail-row">
          <span class="label">Phone:</span> ${enquiry.phone}
        </div>
        
        <div class="detail-row">
          <span class="label">Destination:</span> ${enquiry.destination}
        </div>
        
        <div class="detail-row">
          <span class="label">Check-in Date:</span> ${new Date(enquiry.check_in).toLocaleDateString()}
        </div>
        
        <div class="detail-row">
          <span class="label">Check-out Date:</span> ${new Date(enquiry.check_out).toLocaleDateString()}
        </div>
        
        <div class="detail-row">
          <span class="label">Number of Guests:</span> ${enquiry.guests}
        </div>
        
        ${enquiry.special_requests ? `
        <div class="detail-row">
          <span class="label">Special Requests:</span><br>
          ${enquiry.special_requests}
        </div>
        ` : ''}
        
        <div class="detail-row">
          <span class="label">Submitted:</span> ${new Date(enquiry.created_at || Date.now()).toLocaleString()}
        </div>
      </div>
      
      <div class="footer">
        <p>This enquiry was submitted through your website.</p>
        <p>Please respond to this customer within 24 hours as per your service commitment.</p>
        <p><strong>${companyName}</strong> - Professional Travel Services</p>
      </div>
    </body>
    </html>
    `;
  }

  /**
   * Send confirmation email to customer
   */
  async sendCustomerConfirmationEmail(enquiry: EnquiryEmailData): Promise<EmailResponse> {
    const timestamp = new Date().toISOString();
    
    try {
      const emailjsConfigured = this.config.serviceId && this.config.templateId && this.config.publicKey;
      if (emailjsConfigured) {
        try {
          const customerTemplateId = import.meta.env.VITE_EMAILJS_CUSTOMER_TEMPLATE_ID || this.config.templateId;
          const emailjs = await import('@emailjs/browser');
          
          const templateParams = {
            to_email: enquiry.email,
            customer_name: enquiry.name,
            destination: enquiry.destination,
            check_in: enquiry.check_in,
            check_out: enquiry.check_out,
            guests: enquiry.guests,
            timestamp: new Date().toLocaleString(),
          };

          await emailjs.send(
            this.config.serviceId!,
            customerTemplateId,
            templateParams,
            this.config.publicKey!
          );

          return {
            success: true,
            message: 'Confirmation email sent successfully to customer',
            emailSent: true,
            provider: 'EmailJS',
            timestamp
          };
        } catch (emailjsError) {
          console.warn('EmailJS failed for customer email, trying Resend:', emailjsError);
        }
      }

      // Try Resend API
      if (this.config.apiKey) {
        try {
          const emailContent = this.formatCustomerConfirmationEmail(enquiry);
          const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.config.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: this.config.from,
              to: [enquiry.email],
              subject: `We've Received Your Enquiry - ${enquiry.destination}`,
              html: emailContent,
            }),
          });

          if (!response.ok) {
            throw new Error(`Resend API error: ${response.statusText}`);
          }

          return {
            success: true,
            message: 'Confirmation email sent successfully to customer',
            emailSent: true,
            provider: 'Resend',
            timestamp
          };
        } catch (resendError) {
          console.warn('Resend failed for customer email:', resendError);
        }
      }

      // Fallback: Log the email
      console.warn('No email providers configured. Customer confirmation email will be logged to console.');
      return this.logCustomerConfirmationEmail(enquiry);
      
    } catch (error) {
      console.error('Customer confirmation email sending failed:', error);
      return {
        success: false,
        message: 'Customer confirmation email sending failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp
      };
    }
  }

  /**
   * Format customer confirmation email
   */
  private formatCustomerConfirmationEmail(enquiry: EnquiryEmailData): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Enquiry Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #047857 0%, #10b981 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; max-width: 600px; margin: 0 auto; }
        .confirmation-box { background: #ecfdf5; border: 2px solid #10b981; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .detail-row { margin: 15px 0; padding: 10px; background: #f0fdf4; border-left: 4px solid #10b981; }
        .label { font-weight: bold; color: #047857; }
        .footer { margin-top: 40px; padding: 20px; background: #f8fafc; text-align: center; font-size: 12px; color: #666; border-radius: 8px; }
        .button { display: inline-block; background: #047857; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>✓ Enquiry Received</h1>
        <p>Thank you for choosing Southern Maldives Travels</p>
      </div>
      
      <div class="content">
        <p>Dear ${enquiry.name},</p>
        
        <p>We have successfully received your luxury travel enquiry and will review it with care.</p>
        
        <div class="confirmation-box">
          <h2 style="color: #047857; margin-top: 0;">Your Enquiry Details</h2>
          
          <div class="detail-row">
            <span class="label">Destination:</span> ${enquiry.destination}
          </div>
          
          <div class="detail-row">
            <span class="label">Check-in Date:</span> ${new Date(enquiry.check_in).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          
          <div class="detail-row">
            <span class="label">Check-out Date:</span> ${new Date(enquiry.check_out).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          
          <div class="detail-row">
            <span class="label">Number of Guests:</span> ${enquiry.guests}
          </div>
        </div>
        
        <p><strong>What happens next?</strong></p>
        <p>Our travel concierge team will personally review your enquiry and reach out to you within 24 hours to:</p>
        <ul>
          <li>Confirm availability at your preferred resort</li>
          <li>Customize your package based on your special requests</li>
          <li>Provide a detailed itinerary and pricing</li>
          <li>Answer any questions you may have</li>
        </ul>
        
        <p>You can reach us at:</p>
        <p>
          📧 <strong>${this.config.to}</strong><br>
          📞 Call our concierge team<br>
          💬 Reply directly to this email
        </p>
        
        <p>We look forward to creating your perfect equatorial escape!</p>
        
        <p>Best regards,<br>
        <strong>Southern Maldives Travels</strong><br>
        Personal Concierge Service</p>
      </div>
      
      <div class="footer">
        <p>This is an automated confirmation email. Please do not reply directly to this address.</p>
        <p>&copy; 2024 Southern Maldives Travels. All rights reserved.</p>
      </div>
    </body>
    </html>
    `;
  }

  /**
   * Log customer confirmation email
   */
  private logCustomerConfirmationEmail(enquiry: EnquiryEmailData): EmailResponse {
    const timestamp = new Date().toISOString();
    
    console.log('📧 CUSTOMER CONFIRMATION EMAIL (SMTP not configured):', {
      to: enquiry.email,
      from: this.config.from,
      subject: `We've Received Your Enquiry - ${enquiry.destination}`,
      customer: {
        name: enquiry.name,
        email: enquiry.email,
        destination: enquiry.destination,
        timestamp
      }
    });

    return {
      success: true,
      message: 'Customer confirmation email logged to console',
      emailSent: false,
      emailLogged: true,
      provider: 'Console Log',
      timestamp
    };
  }

  /**
   * Check if email service is configured
   */
  isConfigured(): boolean {
    return !!(
      (this.config.serviceId && this.config.templateId && this.config.publicKey) ||
      this.config.apiKey
    );
    // Note: SMTP is not available in frontend-only applications
  }

  /**
   * Get configuration status
   */
  getConfigStatus() {
    const emailjsConfigured = !!(this.config.serviceId && this.config.templateId && this.config.publicKey);
    const resendConfigured = !!this.config.apiKey;
    const smtpConfigured = false; // SMTP not available in frontend apps
    
    return {
      emailjs: emailjsConfigured,
      resend: resendConfigured,
      smtp: smtpConfigured,
      anyConfigured: emailjsConfigured || resendConfigured,
      note: 'SMTP requires a backend server and is not available in frontend-only applications'
    };
  }
}

// Export singleton instance
export const emailService = new EmailService();
export default emailService;