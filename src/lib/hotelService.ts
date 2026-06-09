import { Hotel, HotelDetails } from '../types/hotel';

const API_BASE = import.meta.env.VITE_API_BASE || '';

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

export const hotelService = {
  async getAllHotels(): Promise<Hotel[]> {
    return api('/api/hotels');
  },

  async getHotelById(id: string): Promise<Hotel | null> {
    const data = await api(`/api/hotels/${id}`);
    return data?.hotel || data || null;
  },

  async createDetailedHotel(hotelData: Partial<Hotel>): Promise<Hotel> {
    return api('/api/hotels', {
      method: 'POST',
      body: JSON.stringify(hotelData),
    });
  },

  async updateHotel(id: string, updates: Partial<Hotel>): Promise<Hotel> {
    return api(`/api/hotels/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async updateDetailedHotel(id: string, updates: Partial<Hotel>): Promise<Hotel> {
    return api(`/api/hotels/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteHotel(id: string): Promise<void> {
    return api(`/api/hotels/${id}`, {
      method: 'DELETE',
    });
  },

  async getHotelDetails(id: string): Promise<HotelDetails | null> {
    const data = await api(`/api/hotels/${id}`);
    return data;
  },
};