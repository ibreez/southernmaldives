import { Hotel } from '@/types/hotel';
import { InstagramFeed, InstagramFeedFormData } from '@/types/instagramFeed';

// A lightweight API wrapper that replaces the frontend Supabase client.
// It proxies requests to the Express API (server.js) which connects to MySQL.

export const TABLES = {
  HOTELS: 'app_1e21816bb9_hotels',
  HOTEL_ROOMS: 'app_1e21816bb9_hotel_rooms',
  HOTEL_AMENITIES: 'app_1e21816bb9_hotel_amenities',
  HOTEL_DINING: 'app_1e21816bb9_hotel_dining',
  HOTEL_POLICIES: 'app_1e21816bb9_hotel_policies',
  HOTEL_GALLERY: 'app_1e21816bb9_hotel_gallery',
  PROMOTIONS: 'app_1e21816bb9_promotions',
  ENQUIRIES: 'app_1e21816bb9_enquiries',
  INSTAGRAM_FEEDS: 'app_1e21816bb9_instagram_feeds',
};

const API_BASE = import.meta.env.VITE_API_BASE || '';

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
  check_in: string;
  check_out: string;
  guests: number;
  special_requests: string;
  status: 'new' | 'replied';
  created_at: string;
}

export interface InstagramFeed {
  id: string;
  image_url: string;
  post_link: string;
  caption?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

async function api(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}

export const promotionService = {
  async getAll(): Promise<Promotion[]> {
    return api('/api/promotions');
  },
  async getActive(): Promise<Promotion[]> {
    return api('/api/promotions/active');
  },
  async create(promotion: Omit<Promotion, 'id' | 'created_at'>): Promise<Promotion> {
    return api('/api/promotions', { method: 'POST', body: JSON.stringify(promotion) });
  },
  async update(id: string, promotion: Partial<Promotion>): Promise<Promotion> {
    return api(`/api/promotions/${id}`, { method: 'PUT', body: JSON.stringify(promotion) });
  },
  async delete(id: string): Promise<void> {
    return api(`/api/promotions/${id}`, { method: 'DELETE' });
  },
};

export const enquiryService = {
  async getAll(): Promise<Enquiry[]> {
    return api('/api/enquiries');
  },
  async create(enquiry: Omit<Enquiry, 'id' | 'created_at' | 'status'>): Promise<Enquiry> {
    return api('/api/enquiries', { method: 'POST', body: JSON.stringify(enquiry) });
  },
  async updateStatus(id: string, status: 'new' | 'replied') {
    // Not implemented on server yet
    throw new Error('Update enquiry status not implemented');
  }
};

export const instagramFeedService = {
  async getAll(): Promise<InstagramFeed[]> {
    return api('/api/instagram-feeds');
  },
  async getActive(): Promise<InstagramFeed[]> {
    return api('/api/instagram-feeds/active');
  },
  async create(feed: Omit<InstagramFeed, 'id' | 'created_at'>): Promise<InstagramFeed> {
    return api('/api/instagram-feeds', { method: 'POST', body: JSON.stringify(feed) });
  },
  async update(id: string, feed: Partial<InstagramFeed>): Promise<InstagramFeed> {
    return api(`/api/instagram-feeds/${id}`, { method: 'PUT', body: JSON.stringify(feed) });
  },
  async delete(id: string): Promise<void> {
    return api(`/api/instagram-feeds/${id}`, { method: 'DELETE' });
  },
  async reorder(updates: { id: string; display_order: number }[]): Promise<void> {
    return api('/api/instagram-feeds/reorder', { method: 'POST', body: JSON.stringify(updates) });
  }
};

// Minimal auth wrapper that calls server login endpoint. The frontend auth provider
// will need small changes (it expects Supabase session objects). For now we return
// a simple token object.
export const authService = {
  async signIn(email: string, password: string) {
    return api('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  },
  async signOut() {
    // Client can just remove token locally
    return;
  },
  async getSession() {
    // Session handling should be implemented using JWT stored in localStorage/cookie
    return null;
  },
  onAuthStateChange(_callback: (session: unknown) => void) {
    return { unsubscribe() { /* noop */ } };
  }
};