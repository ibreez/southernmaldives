// Simple Express.js API Server for SMTP Email Sending
// Run this alongside your React app to handle SMTP emails
// Usage: node backend/server.js (or npm run server)

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { pool, query } from './db.js';
import * as emailService from './emailService.js';

dotenv.config();

async function ensureEnquirySchema() {
  const statements = [
    "ALTER TABLE app_1e21816bb9_enquiries ADD COLUMN IF NOT EXISTS trip_type VARCHAR(64)",
    "ALTER TABLE app_1e21816bb9_enquiries ADD COLUMN IF NOT EXISTS adults INTEGER DEFAULT 1",
    "ALTER TABLE app_1e21816bb9_enquiries ADD COLUMN IF NOT EXISTS children INTEGER DEFAULT 0",
    "ALTER TABLE app_1e21816bb9_enquiries ADD COLUMN IF NOT EXISTS room_type VARCHAR(64)",
    "ALTER TABLE app_1e21816bb9_enquiries ADD COLUMN IF NOT EXISTS airport_transfer BOOLEAN DEFAULT FALSE",
    "ALTER TABLE app_1e21816bb9_enquiries ADD COLUMN IF NOT EXISTS meal_plan VARCHAR(64)",
    "ALTER TABLE app_1e21816bb9_enquiries ADD COLUMN IF NOT EXISTS special_requests TEXT",
    "ALTER TABLE app_1e21816bb9_enquiries ADD COLUMN IF NOT EXISTS contact_preference VARCHAR(32) DEFAULT 'email'",
    "ALTER TABLE app_1e21816bb9_enquiries ADD COLUMN IF NOT EXISTS status VARCHAR(32) DEFAULT 'new'",
    `CREATE TABLE IF NOT EXISTS app_1e21816bb9_testimonials (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      author_name TEXT NOT NULL,
      content TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      avatar_url TEXT,
      is_visible BOOLEAN DEFAULT TRUE,
      "order" INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )`
  ];

  for (const stmt of statements) {
    await query(stmt);
  }
}

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://travel.southernmaldives.com',
  'southernmaldives-nkfg0i5vj-ibreezs-projects.vercel.app',
  'https://southernmaldives.com'
];

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // allow server-to-server / mobile apps (no origin)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Blocked by CORS: ' + origin), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());


function normalizeAmenityEntries(items) {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      if (typeof item === 'string') {
        return { amenity_name: item.trim(), category: null, icon_name: null, is_featured: false };
      }
      if (!item || typeof item !== 'object') {
        return null;
      }
      return {
        amenity_name: (item.amenity_name || item.name || '').toString().trim(),
        category: item.category || item.type || null,
        icon_name: item.icon_name || item.icon || null,
        is_featured: !!item.is_featured,
      };
    })
    .filter(Boolean)
    .filter((item) => item.amenity_name && item.amenity_name.length > 0);
}

// Helper: sign JWT
const JWT_SECRET = process.env.VITE_JWT_SECRET || process.env.JWT_SECRET || 'change-me';
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const result = await query('SELECT NOW()');
    res.json({ 
      status: 'ok', 
      server: 'running',
      database: 'connected',
      timestamp: result[0]?.now 
    });
  } catch (err) {
    console.error('Health check failed:', err);
    res.status(500).json({ 
      status: 'error', 
      server: 'running',
      database: 'disconnected',
      error: err.message 
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });

    // Find user in `users` table
    const users = await query('SELECT * FROM app_1e21816bb9_users WHERE email = $1', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });
    return res.json({ token, user: { email: user.email, role: user.role } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Promotions endpoints
app.get('/api/promotions', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM app_1e21816bb9_promotions ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch promotions' });
  }
});

app.get('/api/promotions/active', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM app_1e21816bb9_promotions WHERE is_active = true ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch active promotions' });
  }
});

app.post('/api/promotions', async (req, res) => {
  try {
    const { title, description, image_url, start_date, end_date, is_active } = req.body;
    const id = uuidv4();
    const created_at = new Date();
    await query(
      `INSERT INTO app_1e21816bb9_promotions (id, title, description, image_url, start_date, end_date, is_active, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [id, title, description, image_url, start_date || null, end_date || null, is_active ? true : false, created_at]
    );
    const inserted = await query('SELECT * FROM app_1e21816bb9_promotions WHERE id = $1', [id]);
    res.json(inserted[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create promotion' });
  }
});

app.put('/api/promotions/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description, image_url, start_date, end_date, is_active } = req.body;
    await query(
      `UPDATE app_1e21816bb9_promotions SET title = $1, description = $2, image_url = $3, start_date = $4, end_date = $5, is_active = $6 WHERE id = $7`,
      [title, description, image_url, start_date || null, end_date || null, is_active ? true : false, id]
    );
    const updated = await query('SELECT * FROM app_1e21816bb9_promotions WHERE id = $1', [id]);
    if (updated.length === 0) {
      return res.status(404).json({ error: 'Promotion not found' });
    }
    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update promotion' });
  }
});

app.delete('/api/promotions/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await query('DELETE FROM app_1e21816bb9_promotions WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Promotion not found' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete promotion' });
  }
});

// Package endpoints
app.get('/api/packages', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM app_1e21816bb9_packages ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
});

app.get('/api/packages/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const rows = await query('SELECT * FROM app_1e21816bb9_packages WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Package not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch package' });
  }
});

app.post('/api/packages', authenticateToken, async (req, res) => {
  try {
    console.log('POST /api/packages body:', JSON.stringify(req.body).slice(0, 1000));
    const {
      title,
      subtitle,
      description,
      price,
      currency,
      duration,
      persons,
      images,
      inclusions,
      activities,
      featured,
      badge,
      highlights,
      booking_deadline,
      travel_dates,
      contact_info,
      bookingDeadline,
      travelDates,
      contactInfo,
    } = req.body;
    const packageBookingDeadline = booking_deadline ?? bookingDeadline;
    const packageTravelDates = travel_dates ?? travelDates;
    const packageContactInfo = contact_info ?? contactInfo;

    const id = uuidv4();
    const created_at = new Date();

    await query(
      `INSERT INTO app_1e21816bb9_packages (id, title, subtitle, description, price, currency, duration, persons, images, inclusions, activities, featured, badge, highlights, booking_deadline, travel_dates, contact_info, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
      [
        id,
        title,
        subtitle || null,
        description,
        price || 0,
        currency || 'USD',
        JSON.stringify(duration || { nights: 0, days: 0 }),
        persons || 1,
        JSON.stringify(images || []),
        JSON.stringify(inclusions || []),
        JSON.stringify(activities || []),
        featured ? true : false,
        badge || null,
        JSON.stringify(highlights || []),
        packageBookingDeadline || null,
        packageTravelDates || null,
        JSON.stringify(packageContactInfo || {}),
        created_at,
      ]
    );

    const inserted = await query('SELECT * FROM app_1e21816bb9_packages WHERE id = $1', [id]);
    res.json(inserted[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create package' });
  }
});

app.put('/api/packages/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    console.log('PUT /api/packages id=', id, ' body=', JSON.stringify(req.body).slice(0,1000));
    const {
      title,
      subtitle,
      description,
      price,
      currency,
      duration,
      persons,
      images,
      inclusions,
      activities,
      featured,
      badge,
      highlights,
      booking_deadline,
      travel_dates,
      contact_info,
      bookingDeadline,
      travelDates,
      contactInfo,
    } = req.body;
    const packageBookingDeadline = booking_deadline ?? bookingDeadline;
    const packageTravelDates = travel_dates ?? travelDates;
    const packageContactInfo = contact_info ?? contactInfo;

    // Check existence first for clearer error handling
    const exists = await query('SELECT id FROM app_1e21816bb9_packages WHERE id = $1', [id]);
    if (!exists || exists.length === 0) {
      console.warn('Package not found for update, id=', id);
      return res.status(404).json({ error: 'Package not found' });
    }

    await query(
      `UPDATE app_1e21816bb9_packages SET title = $1, subtitle = $2, description = $3, price = $4, currency = $5, duration = $6, persons = $7, images = $8, inclusions = $9, activities = $10, featured = $11, badge = $12, highlights = $13, booking_deadline = $14, travel_dates = $15, contact_info = $16 WHERE id = $17`,
      [
        title,
        subtitle || null,
        description,
        price || 0,
        currency || 'USD',
        JSON.stringify(duration || { nights: 0, days: 0 }),
        persons || 1,
        JSON.stringify(images || []),
        JSON.stringify(inclusions || []),
        JSON.stringify(activities || []),
        featured ? true : false,
        badge || null,
        JSON.stringify(highlights || []),
        packageBookingDeadline || null,
        packageTravelDates || null,
        JSON.stringify(packageContactInfo || {}),
        id,
      ]
    );

    const updated = await query('SELECT * FROM app_1e21816bb9_packages WHERE id = $1', [id]);
    if (updated.length === 0) {
      return res.status(404).json({ error: 'Package not found' });
    }
    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update package' });
  }
});

app.delete('/api/packages/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const result = await query('DELETE FROM app_1e21816bb9_packages WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Package not found' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete package' });
  }
});

// Instagram Feeds endpoints
app.get('/api/instagram-feeds', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM app_1e21816bb9_instagram_feeds ORDER BY display_order ASC, created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch Instagram feeds' });
  }
});

app.get('/api/instagram-feeds/active', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM app_1e21816bb9_instagram_feeds WHERE is_active = true ORDER BY display_order ASC, created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch active Instagram feeds' });
  }
});

app.post('/api/instagram-feeds', async (req, res) => {
  try {
    const { image_url, post_link, caption, display_order, is_active } = req.body;
    const id = uuidv4();
    const created_at = new Date();
    await query(
      `INSERT INTO app_1e21816bb9_instagram_feeds (id, image_url, post_link, caption, display_order, is_active, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id, image_url, post_link, caption || null, display_order || 0, is_active ? true : false, created_at]
    );
    const inserted = await query('SELECT * FROM app_1e21816bb9_instagram_feeds WHERE id = $1', [id]);
    res.json(inserted[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create Instagram feed' });
  }
});

app.put('/api/instagram-feeds/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { image_url, post_link, caption, display_order, is_active } = req.body;
    await query(
      `UPDATE app_1e21816bb9_instagram_feeds SET image_url = $1, post_link = $2, caption = $3, display_order = $4, is_active = $5 WHERE id = $6`,
      [image_url, post_link, caption || null, display_order || 0, is_active ? true : false, id]
    );
    const updated = await query('SELECT * FROM app_1e21816bb9_instagram_feeds WHERE id = $1', [id]);
    if (updated.length === 0) {
      return res.status(404).json({ error: 'Instagram feed not found' });
    }
    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update Instagram feed' });
  }
});

app.delete('/api/instagram-feeds/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await query('DELETE FROM app_1e21816bb9_instagram_feeds WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Instagram feed not found' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete Instagram feed' });
  }
});

app.post('/api/instagram-feeds/reorder', async (req, res) => {
  try {
    const updates = req.body; // Array of { id, display_order }
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const update of updates) {
        await client.query(
          'UPDATE app_1e21816bb9_instagram_feeds SET display_order = $1 WHERE id = $2',
          [update.display_order, update.id]
        );
      }
      await client.query('COMMIT');
      res.json({ success: true });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to reorder Instagram feeds' });
  }
});

app.get('/api/testimonials', async (req, res) => {
  try {
    const isAdmin = req.query.admin === 'true';
    if (isAdmin) {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      try {
        jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
      } catch {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const rows = await query('SELECT * FROM app_1e21816bb9_testimonials ORDER BY "order" ASC, created_at DESC');
      return res.json(rows);
    }

    const rows = await query('SELECT * FROM app_1e21816bb9_testimonials WHERE is_visible = true ORDER BY "order" ASC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

app.post('/api/testimonials', authenticateToken, async (req, res) => {
  try {
    const { author_name, content, rating, avatar_url, is_visible, order } = req.body;
    const id = uuidv4();
    const created_at = new Date();
    await query(
      `INSERT INTO app_1e21816bb9_testimonials (id, author_name, content, rating, avatar_url, is_visible, "order", created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [id, author_name, content, rating || 5, avatar_url || null, is_visible === false ? false : true, order || 0, created_at]
    );
    const inserted = await query('SELECT * FROM app_1e21816bb9_testimonials WHERE id = $1', [id]);
    res.json(inserted[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
});

app.put('/api/testimonials/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const { author_name, content, rating, avatar_url, is_visible, order } = req.body;
    await query(
      `UPDATE app_1e21816bb9_testimonials SET author_name = $1, content = $2, rating = $3, avatar_url = $4, is_visible = $5, "order" = $6 WHERE id = $7`,
      [author_name, content, rating || 5, avatar_url || null, is_visible === false ? false : true, order || 0, id]
    );
    const updated = await query('SELECT * FROM app_1e21816bb9_testimonials WHERE id = $1', [id]);
    if (updated.length === 0) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
});

app.delete('/api/testimonials/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const result = await query('DELETE FROM app_1e21816bb9_testimonials WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

app.get('/api/email-templates', async (req, res) => {
  try {
    const rows = await emailService.getEmailTemplates();
    res.json(rows);
  } catch (err) {
    console.error('Failed to fetch email templates:', err);
    res.status(500).json({ error: 'Failed to fetch email templates' });
  }
});

app.get('/api/email-templates/:key', async (req, res) => {
  try {
    const key = req.params.key;
    const template = await emailService.getEmailTemplateByKey(key);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json(template);
  } catch (err) {
    console.error('Failed to fetch email template:', err);
    res.status(500).json({ error: 'Failed to fetch email template' });
  }
});

app.put('/api/email-templates/:key', async (req, res) => {
  try {
    const key = req.params.key;
    const { name, subject, body, required_variables } = req.body;
    const template = await emailService.upsertEmailTemplate({
      key,
      name,
      subject,
      body,
      required_variables: Array.isArray(required_variables) ? required_variables : [],
    });
    res.json(template);
  } catch (err) {
    console.error('Failed to save email template:', err);
    res.status(400).json({ error: err instanceof Error ? err.message : 'Failed to save email template' });
  }
});

app.post('/api/email/smtp-test', async (req, res) => {
  try {
    await emailService.verifySmtpConnection();
    res.json({ success: true, message: 'SMTP connection verified' });
  } catch (err) {
    console.error('SMTP connection test failed:', err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'SMTP verification failed' });
  }
});

// Enquiries
app.get('/api/enquiries', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM app_1e21816bb9_enquiries ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
});

app.patch('/api/enquiries/:id/status', async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    if (!status || !['new', 'replied', 'closed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    const result = await query(
      'UPDATE app_1e21816bb9_enquiries SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.length === 0) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }
    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update enquiry status' });
  }
});

app.delete('/api/enquiries/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await query('DELETE FROM app_1e21816bb9_enquiries WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete enquiry' });
  }
});

app.post('/api/enquiries', async (req, res) => {
  try {
    const {
      name, email, phone, destination, trip_type,
      check_in, check_out, guests, adults, children,
      room_type, airport_transfer, meal_plan,
      special_requests, contact_preference
    } = req.body;
    if (!name || !email || !phone || !destination) return res.status(400).json({ error: 'Missing required fields' });

    const id = uuidv4();
    const created_at = new Date();
    const status = 'new';

    await query(
      `INSERT INTO app_1e21816bb9_enquiries (
        id, name, email, phone, destination, trip_type,
        check_in, check_out, guests, adults, children,
        room_type, airport_transfer, meal_plan,
        special_requests, contact_preference, status, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11,
        $12, $13, $14,
        $15, $16, $17, $18
      )`,
      [
        id, name, email, phone, destination, trip_type || null,
        check_in || null, check_out || null,
        guests || 1, adults || guests || 1, children || 0,
        room_type || null, airport_transfer || false, meal_plan || null,
        special_requests || null, contact_preference || 'email', status, created_at
      ]
    );

    const inserted = await query('SELECT * FROM app_1e21816bb9_enquiries WHERE id = $1', [id]);
    const enquiry = inserted[0];

    // Send emails in background (fire-and-forget) to return response immediately
    setImmediate(() => {
      emailService.sendEnquiryEmails(enquiry).catch((err) => {
        console.warn('Failed to send enquiry emails via SMTP:', err.message);
      });
    });

    res.json(enquiry);
  } catch (err) {
    console.error('Enquiry creation error:', err.message);
    console.error('Error details:', err);
    res.status(500).json({ error: 'Failed to create enquiry', details: err.message });
  }
});

// Hotels endpoints (basic list and details)
app.get('/api/hotels', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM app_1e21816bb9_hotels ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch hotels' });
  }
});

// Helper function to ensure all JSON fields are properly parsed
function parseDiningData(dining) {
  if (!dining) return null;
  
  return {
    ...dining,
    restaurants: typeof dining.restaurants === 'string' ? JSON.parse(dining.restaurants) : (dining.restaurants || []),
    cuisines: typeof dining.cuisines === 'string' ? JSON.parse(dining.cuisines) : (dining.cuisines || []),
    breakfast_types: typeof dining.breakfast_types === 'string' ? JSON.parse(dining.breakfast_types) : (dining.breakfast_types || []),
    bar_info: typeof dining.bar_info === 'string' ? JSON.parse(dining.bar_info) : (dining.bar_info || {}),
  };
}

app.get('/api/hotels/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const hotels = await query('SELECT * FROM app_1e21816bb9_hotels WHERE id = $1', [id]);
    if (!hotels || hotels.length === 0) return res.status(404).json({ error: 'Hotel not found' });
    const hotel = hotels[0];

    const rooms = await query('SELECT * FROM app_1e21816bb9_hotel_rooms WHERE hotel_id = $1 ORDER BY created_at ASC', [id]);
    const amenities = await query('SELECT * FROM app_1e21816bb9_hotel_amenities WHERE hotel_id = $1 ORDER BY amenity_name ASC', [id]);
    const diningRows = await query('SELECT * FROM app_1e21816bb9_hotel_dining WHERE hotel_id = $1 LIMIT 1', [id]);
    const policiesRows = await query('SELECT * FROM app_1e21816bb9_hotel_policies WHERE hotel_id = $1 LIMIT 1', [id]);
    const gallery = await query('SELECT * FROM app_1e21816bb9_hotel_gallery WHERE hotel_id = $1 ORDER BY created_at ASC', [id]);

    const parsedDining = parseDiningData(diningRows[0]);
    console.log('🍽️ Dining data retrieved for hotel', id, JSON.stringify(parsedDining, null, 2));

    res.json({ 
      hotel, 
      rooms, 
      amenities, 
      dining: parsedDining, 
      policies: policiesRows[0] || null, 
      gallery 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch hotel details' });
  }
});

// Ensure database schema is up to date before starting
await ensureEnquirySchema();

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT}`);
  console.log(`📧 SMTP configured: ${!!(process.env.VITE_SMTP_USERNAME && process.env.VITE_SMTP_PASSWORD)}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📬 Enquiry endpoint: http://localhost:${PORT}/api/enquiries`);
});
 
// Create hotel with related data
app.post('/api/hotels', async (req, res) => {
  const payload = req.body;
  const client = await pool.connect();
  try {
    const id = uuidv4();
    await client.query('BEGIN');
    await client.query(
      `INSERT INTO app_1e21816bb9_hotels (id, name, category, description, images, location, price, star_rating, created_at, slug, long_description, distance_from_airport, nearby_attractions, guest_rating, review_count, cinemagraph_url, hide_culinary_section, vision_main_text, vision_italic_text) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
      [
        id,
        payload.name || '',
        payload.category || '',
        payload.long_description || payload.description || '',
        JSON.stringify(payload.images || []),
        payload.location || '',
        isNaN(Number(payload.price)) ? 0 : Number(payload.price),
        isNaN(Number(payload.star_rating)) ? 5 : Math.round(Number(payload.star_rating)),
        new Date(),
        payload.slug || null,
        payload.long_description || null,
        isNaN(Number(payload.distance_from_airport)) ? null : Math.round(Number(payload.distance_from_airport)),
        JSON.stringify(payload.nearby_attractions || []),
        isNaN(Number(payload.guest_rating)) ? null : Number(payload.guest_rating),
        isNaN(Number(payload.review_count)) ? 0 : Math.round(Number(payload.review_count)),
        payload.cinemagraph_url || null,
        !!payload.hide_culinary_section,
        payload.vision_main_text || 'Pristine',
        payload.vision_italic_text || 'Elegance',
      ]
    );

    // Insert related arrays if provided
    if (Array.isArray(payload.rooms) && payload.rooms.length > 0) {
      for (const r of payload.rooms) {
        await client.query(
          `INSERT INTO app_1e21816bb9_hotel_rooms (id, hotel_id, room_name, room_type, description, max_guests, bed_type, room_size, price, amenities, images, is_available, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
          [uuidv4(), id, r.room_name, r.room_type, r.description || null, isNaN(Number(r.max_guests)) ? 1 : Math.round(Number(r.max_guests)), r.bed_type || null, isNaN(Number(r.room_size)) ? null : Math.round(Number(r.room_size)), isNaN(Number(r.price)) ? 0 : Number(r.price), JSON.stringify(r.amenities || []), JSON.stringify(r.images || []), r.is_available !== false, new Date()]
        );
      }
    }

    const hotelAmenities = normalizeAmenityEntries(payload.amenities);
    if (hotelAmenities.length > 0) {
      for (const a of hotelAmenities) {
        await client.query(
          `INSERT INTO app_1e21816bb9_hotel_amenities (id, hotel_id, amenity_name, category, icon_name, is_featured, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [uuidv4(), id, a.amenity_name, a.category, a.icon_name, a.is_featured, new Date()]
        );
      }
    }

    if (payload.dining) {
      await client.query(
        `INSERT INTO app_1e21816bb9_hotel_dining (id, hotel_id, main_description, hero_image_url, section_label, heading_main, heading_italic, restaurants, cuisines, breakfast_types, bar_info, room_service, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          uuidv4(),
          id,
          payload.dining.main_description || payload.dining.description || null,
          payload.dining.hero_image_url || null,
          payload.dining.section_label || 'Culinary',
          payload.dining.heading_main || 'Island',
          payload.dining.heading_italic || 'Flavors',
          JSON.stringify(payload.dining.restaurants || []),
          JSON.stringify(payload.dining.cuisines || []),
          JSON.stringify(payload.dining.breakfast_types || []),
          JSON.stringify(payload.dining.bar_info || {}),
          !!payload.dining.room_service,
          new Date()
        ]
      );
    }

    if (payload.policies) {
      await client.query(
        `INSERT INTO app_1e21816bb9_hotel_policies (id, hotel_id, check_in, check_out, cancellation_policy, child_policy, pet_policy, smoking_policy, age_restriction, deposit_required, deposit_amount, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [uuidv4(), id, payload.policies.check_in || null, payload.policies.check_out || null, payload.policies.cancellation_policy || null, payload.policies.child_policy || null, payload.policies.pet_policy || null, payload.policies.smoking_policy || null, payload.policies.age_restriction || null, !!payload.policies.deposit_required, payload.policies.deposit_amount || null, new Date()]
      );
    }

    await client.query('COMMIT');
    const { rows } = await client.query('SELECT * FROM app_1e21816bb9_hotels WHERE id = $1', [id]);
    res.json(rows[0]);
  } catch (err) {
    if (client) await client.query('ROLLBACK');
    console.error('Failed to create hotel:', err);
    res.status(500).json({ 
      error: 'Failed to create hotel',
      details: err instanceof Error ? err.message : String(err)
    });
  } finally {
    client.release();
  }
});

// Update hotel and replace related data
app.put('/api/hotels/:id', async (req, res) => {
  const id = req.params.id;
  const payload = req.body;
  console.log('Update Payload for hotel:', id, JSON.stringify(payload, null, 2));
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      `UPDATE app_1e21816bb9_hotels SET name = $1, category = $2, description = $3, images = $4, location = $5, price = $6, star_rating = $7, slug = $8, long_description = $9, distance_from_airport = $10, nearby_attractions = $11, guest_rating = $12, review_count = $13, cinemagraph_url = $14, hide_culinary_section = $15, vision_main_text = $16, vision_italic_text = $17 WHERE id = $18`,
      [
        payload.name || '', 
        payload.category || '', 
        payload.long_description || payload.description || '', 
        JSON.stringify(payload.images || []), 
        payload.location || '', 
        isNaN(Number(payload.price)) ? 0 : Number(payload.price), 
        isNaN(Number(payload.star_rating)) ? 5 : Math.round(Number(payload.star_rating)), 
        payload.slug || null, 
        payload.long_description || null, 
        isNaN(Number(payload.distance_from_airport)) ? null : Math.round(Number(payload.distance_from_airport)), 
        JSON.stringify(payload.nearby_attractions || []), 
        isNaN(Number(payload.guest_rating)) ? null : Number(payload.guest_rating), 
        isNaN(Number(payload.review_count)) ? 0 : Math.round(Number(payload.review_count)), 
        payload.cinemagraph_url || null,
        !!payload.hide_culinary_section,
        payload.vision_main_text || 'Pristine',
        payload.vision_italic_text || 'Elegance',
        id,
      ]
    );

    // Clear related
    await client.query('DELETE FROM app_1e21816bb9_hotel_rooms WHERE hotel_id = $1', [id]);
    await client.query('DELETE FROM app_1e21816bb9_hotel_amenities WHERE hotel_id = $1', [id]);
    await client.query('DELETE FROM app_1e21816bb9_hotel_dining WHERE hotel_id = $1', [id]);
    await client.query('DELETE FROM app_1e21816bb9_hotel_policies WHERE hotel_id = $1', [id]);
    await client.query('DELETE FROM app_1e21816bb9_hotel_gallery WHERE hotel_id = $1', [id]);

    // Insert new related
    if (Array.isArray(payload.rooms) && payload.rooms.length > 0) {
      for (const r of payload.rooms) {
        await client.query(
          `INSERT INTO app_1e21816bb9_hotel_rooms (id, hotel_id, room_name, room_type, description, max_guests, bed_type, room_size, price, amenities, images, is_available, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
          [uuidv4(), id, r.room_name, r.room_type, r.description || null, isNaN(Number(r.max_guests)) ? 1 : Math.round(Number(r.max_guests)), r.bed_type || null, isNaN(Number(r.room_size)) ? null : Math.round(Number(r.room_size)), isNaN(Number(r.price)) ? 0 : Number(r.price), JSON.stringify(r.amenities || []), JSON.stringify(r.images || []), r.is_available !== false, new Date()]
        );
      }
    }

    const hotelAmenities = normalizeAmenityEntries(payload.amenities);
    if (hotelAmenities.length > 0) {
      for (const a of hotelAmenities) {
        await client.query(
          `INSERT INTO app_1e21816bb9_hotel_amenities (id, hotel_id, amenity_name, category, icon_name, is_featured, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [uuidv4(), id, a.amenity_name, a.category, a.icon_name, a.is_featured, new Date()]
        );
      }
    }

    if (payload.dining) {
      await client.query(
        `INSERT INTO app_1e21816bb9_hotel_dining (id, hotel_id, main_description, hero_image_url, section_label, heading_main, heading_italic, restaurants, cuisines, breakfast_types, bar_info, bar_info_section_label, room_service, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [
          uuidv4(),
          id,
          payload.dining.main_description || payload.dining.description || null,
          payload.dining.hero_image_url || null,
          payload.dining.section_label || 'Culinary',
          payload.dining.heading_main || 'Island',
          payload.dining.heading_italic || 'Flavors',
          JSON.stringify(payload.dining.restaurants || []),
          JSON.stringify(payload.dining.cuisines || []),
          JSON.stringify(payload.dining.breakfast_types || []),
          JSON.stringify(payload.dining.bar_info || {}),
          payload.dining.bar_info?.section_label || 'Mixology & Spirits',
          !!payload.dining.room_service,
          new Date()
        ]
      );
    }

    if (payload.policies) {
      await client.query(
        `INSERT INTO app_1e21816bb9_hotel_policies (id, hotel_id, check_in, check_out, cancellation_policy, child_policy, pet_policy, smoking_policy, age_restriction, deposit_required, deposit_amount, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [uuidv4(), id, payload.policies.check_in || null, payload.policies.check_out || null, payload.policies.cancellation_policy || null, payload.policies.child_policy || null, payload.policies.pet_policy || null, payload.policies.smoking_policy || null, payload.policies.age_restriction || null, !!payload.policies.deposit_required, payload.policies.deposit_amount || null, new Date()]
      );
    }

    await client.query('COMMIT');
    const { rows } = await client.query('SELECT * FROM app_1e21816bb9_hotels WHERE id = $1', [id]);
    res.json(rows[0]);
  } catch (err) {
    if (client) await client.query('ROLLBACK');
    console.error('Failed to update hotel:', err);
    res.status(500).json({ 
      error: 'Failed to update hotel',
      details: err instanceof Error ? err.message : String(err)
    });
  } finally {
    client.release();
  }
});

// Delete hotel
app.delete('/api/hotels/:id', async (req, res) => {
  const id = req.params.id;
  const client = await pool.connect();
  try {
    // Fetch hotel to get cinemagraph_url and images for cleanup
    const hotelResult = await client.query('SELECT cinemagraph_url, images FROM app_1e21816bb9_hotels WHERE id = $1', [id]);
    const hotel = hotelResult.rows[0];

    await client.query('BEGIN');
    await client.query('DELETE FROM app_1e21816bb9_hotel_rooms WHERE hotel_id = $1', [id]);
    await client.query('DELETE FROM app_1e21816bb9_hotel_amenities WHERE hotel_id = $1', [id]);
    await client.query('DELETE FROM app_1e21816bb9_hotel_dining WHERE hotel_id = $1', [id]);
    await client.query('DELETE FROM app_1e21816bb9_hotel_policies WHERE hotel_id = $1', [id]);
    await client.query('DELETE FROM app_1e21816bb9_hotel_gallery WHERE hotel_id = $1', [id]);
    await client.query('DELETE FROM app_1e21816bb9_hotels WHERE id = $1', [id]);
    await client.query('COMMIT');

    // Trigger File Cleanup
    if (hotel) {
      if (hotel.cinemagraph_url && hotel.cinemagraph_url.includes('cloudinary')) {
         console.log(`[File Cleanup] Triggered deletion for Cloudinary video asset: ${hotel.cinemagraph_url}`);
         // TODO: Implement actual Cloudinary v2.uploader.destroy(public_id, { resource_type: 'video' })
      }
      
      const images = typeof hotel.images === 'string' ? JSON.parse(hotel.images) : hotel.images;
      if (Array.isArray(images)) {
         images.forEach(img => {
            if (img && img.includes('cloudinary')) {
               console.log(`[File Cleanup] Triggered deletion for Cloudinary image asset: ${img}`);
               // TODO: Implement actual Cloudinary v2.uploader.destroy(public_id)
            }
         });
      }
    }

    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Failed to delete hotel:', err);
    res.status(500).json({ error: 'Failed to delete hotel' });
  } finally {
    client.release();
  }
});

// Update hotel dining information
app.put('/api/hotels/:id/dining', async (req, res) => {
  const id = req.params.id;
  const payload = req.body;
  console.log('Update Dining Payload for hotel:', id, JSON.stringify(payload, null, 2));
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // First, delete existing dining record for this hotel
    await client.query('DELETE FROM app_1e21816bb9_hotel_dining WHERE hotel_id = $1', [id]);

    // Derive cuisines from restaurants if not provided
    const cuisines = payload.cuisines || (Array.isArray(payload.restaurants)
      ? payload.restaurants.map((r) => r.cuisine).filter(Boolean)
      : []);

    // Derive room_service from bar_info if not provided
    const room_service = payload.room_service !== undefined
      ? payload.room_service
      : payload.bar_info?.room_service_available || false;

    // Insert new dining record
    await client.query(
      `INSERT INTO app_1e21816bb9_hotel_dining (id, hotel_id, main_description, hero_image_url, section_label, heading_main, heading_italic, restaurants, cuisines, breakfast_types, bar_info, bar_info_section_label, room_service, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      [
        uuidv4(),
        id,
        payload.main_description || null,
        payload.hero_image_url || null,
        payload.section_label || 'Culinary',
        payload.heading_main || 'Island',
        payload.heading_italic || 'Flavors',
        JSON.stringify(payload.restaurants || []),
        JSON.stringify(cuisines),
        JSON.stringify(payload.breakfast_types || []),
        JSON.stringify(payload.bar_info || {}),
        payload.bar_info?.section_label || 'Mixology & Spirits',
        room_service,
        new Date()
      ]
    );

    await client.query('COMMIT');
    
    // Return the updated dining data
    const { rows } = await client.query(
      'SELECT * FROM app_1e21816bb9_hotel_dining WHERE hotel_id = $1',
      [id]
    );
    
    res.json(parseDiningData(rows[0]) || { success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Failed to update hotel dining:', err);
    res.status(500).json({ 
      error: 'Failed to update hotel dining',
      details: err instanceof Error ? err.message : String(err)
    });
  } finally {
    client.release();
  }
});
