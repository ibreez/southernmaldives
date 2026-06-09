import type { Hotel } from '@/types/hotel';
import type { InstagramFeed } from '@/types/instagramFeed';
import type { TravelPackage } from '@/types/package';

/**
 * API BASE (Railway backend)
 * MUST be set in Vercel env:
 * VITE_API_URL=https://southernmaldives-production.up.railway.app
 */
const API_BASE = import.meta.env.VITE_API_URL;

if (!API_BASE) {
  throw new Error('VITE_API_URL is not defined');
}

/**
 * Generic API wrapper
 */
async function api(path: string, opts: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string, string> || {}),
  };

  try {
    const authToken = localStorage.getItem('auth_token');
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }
  } catch {
    // ignore SSR / non-browser environments
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }

  return res.json();
}

/* -----------------------------
   TABLES (for reference only)
------------------------------ */
export const TABLES = {
  HOTELS: 'app_1e21816bb9_hotels',
  HOTEL_ROOMS: 'app_1e21816bb9_hotel_rooms',
  HOTEL_AMENITIES: 'app_1e21816bb9_hotel_amenities',
  HOTEL_DINING: 'app_1e21816bb9_hotel_dining',
  HOTEL_POLICIES: 'app_1e21816bb9_hotel_policies',
  HOTEL_GALLERY: 'app_1e21816bb9_hotel_gallery',
  PROMOTIONS: 'app_1e21816bb9_promotions',
  ENQUIRIES: 'app_1e21816bb9_enquiries',
};

/* -----------------------------
   TYPES
------------------------------ */

export interface Promotion {
  id: string;
  title: string;
  description: string;
  image_url: string;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  destination: string;
  trip_type: string | null;
  check_in: string | null;
  check_out: string | null;
  guests: number;
  adults: number;
  children: number;
  room_type: string | null;
  airport_transfer: boolean;
  meal_plan: string | null;
  special_requests: string | null;
  contact_preference: string;
  status: 'new' | 'replied';
  created_at: string;
}

export interface EmailTemplate {
  id: string;
  key: string;
  name: string;
  subject: string;
  body: string;
  required_variables: string[];
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  author_name: string;
  content: string;
  rating: number;
  avatar_url?: string | null;
  is_visible: boolean;
  order: number;
  created_at: string;
}

/* -----------------------------
   SERVICES
------------------------------ */

export const promotionService = {
  getAll(): Promise<Promotion[]> {
    return api('/api/promotions');
  },

  getActive(): Promise<Promotion[]> {
    return api('/api/promotions/active');
  },

  create(promotion: Omit<Promotion, 'id' | 'created_at'>): Promise<Promotion> {
    return api('/api/promotions', {
      method: 'POST',
      body: JSON.stringify(promotion),
    });
  },

  update(id: string, promotion: Partial<Promotion>): Promise<Promotion> {
    return api(`/api/promotions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(promotion),
    });
  },

  delete(id: string): Promise<void> {
    return api(`/api/promotions/${id}`, {
      method: 'DELETE',
    });
  },
};

export const enquiryService = {
  getAll(): Promise<Enquiry[]> {
    return api('/api/enquiries');
  },

  create(enquiry: Omit<Enquiry, 'id' | 'created_at' | 'status'>): Promise<Enquiry> {
    return api('/api/enquiries', {
      method: 'POST',
      body: JSON.stringify(enquiry),
    });
  },

  updateStatus(id: string, status: 'new' | 'replied') {
    return api(`/api/enquiries/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  delete(id: string): Promise<void> {
    return api(`/api/enquiries/${id}`, {
      method: 'DELETE',
    });
  },
};

export const emailTemplateService = {
  getAll(): Promise<EmailTemplate[]> {
    return api('/api/email-templates');
  },

  get(key: string): Promise<EmailTemplate> {
    return api(`/api/email-templates/${key}`);
  },

  update(key: string, template: Partial<EmailTemplate>): Promise<EmailTemplate> {
    return api(`/api/email-templates/${key}`, {
      method: 'PUT',
      body: JSON.stringify(template),
    });
  },

  testSmtp(recipient?: string) {
    return api('/api/email/smtp-test', {
      method: 'POST',
      body: JSON.stringify({ recipient }),
    });
  },
};

/* -----------------------------
   AUTH SERVICE
------------------------------ */

export const authService = {
  async signIn(email: string, password: string) {
    return api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async signOut() {
    localStorage.removeItem('auth_token');
  },

  async getSession() {
    return null;
  },

  onAuthStateChange(_callback: (session: unknown) => void) {
    return {
      unsubscribe() {},
    };
  },
};

/* -----------------------------
   TESTIMONIALS
------------------------------ */

export const testimonialService = {
  getAll(admin = false): Promise<Testimonial[]> {
    return api(`/api/testimonials${admin ? '?admin=true' : ''}`);
  },

  create(testimonial: Omit<Testimonial, 'id' | 'created_at'>): Promise<Testimonial> {
    return api('/api/testimonials', {
      method: 'POST',
      body: JSON.stringify(testimonial),
    });
  },

  update(id: string, testimonial: Partial<Testimonial>): Promise<Testimonial> {
    return api(`/api/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(testimonial),
    });
  },

  delete(id: string): Promise<void> {
    return api(`/api/testimonials/${id}`, {
      method: 'DELETE',
    });
  },
};

/* -----------------------------
   INSTAGRAM FEED
------------------------------ */

export const instagramFeedService = {
  getAll(): Promise<InstagramFeed[]> {
    return api('/api/instagram-feeds');
  },

  getActive(): Promise<InstagramFeed[]> {
    return api('/api/instagram-feeds/active');
  },

  create(feed: Omit<InstagramFeed, 'id' | 'created_at'>): Promise<InstagramFeed> {
    return api('/api/instagram-feeds', {
      method: 'POST',
      body: JSON.stringify(feed),
    });
  },

  update(id: string, feed: Partial<InstagramFeed>): Promise<InstagramFeed> {
    return api(`/api/instagram-feeds/${id}`, {
      method: 'PUT',
      body: JSON.stringify(feed),
    });
  },

  delete(id: string): Promise<void> {
    return api(`/api/instagram-feeds/${id}`, {
      method: 'DELETE',
    });
  },

  reorder(updates: { id: string; display_order: number }[]): Promise<void> {
    return api('/api/instagram-feeds/reorder', {
      method: 'POST',
      body: JSON.stringify(updates),
    });
  },
};

/* -----------------------------
   PACKAGES
------------------------------ */

export const packageService = {
  getAll(): Promise<TravelPackage[]> {
    return api('/api/packages');
  },

  getById(id: string): Promise<TravelPackage> {
    return api(`/api/packages/${id}`);
  },

  create(pkg: Omit<TravelPackage, 'id' | 'created_at'>): Promise<TravelPackage> {
    return api('/api/packages', {
      method: 'POST',
      body: JSON.stringify(pkg),
    });
  },

  update(id: string, pkg: Partial<TravelPackage>): Promise<TravelPackage> {
    return api(`/api/packages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pkg),
    });
  },

  delete(id: string): Promise<void> {
    return api(`/api/packages/${id}`, {
      method: 'DELETE',
    });
  },
};
