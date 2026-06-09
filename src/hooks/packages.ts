import type { TravelPackage } from '@/types/package';

const API_BASE = import.meta.env.VITE_API_BASE || '';

export const demoPackages: TravelPackage[] = [
  {
    id: 'south-maldives-combo',
    title: 'South Maldives Combo',
    subtitle: 'Manta Beach Retreat & Canareef Resort Maldives',
    description:
      'Dive into a world of unparalleled beauty & luxury with our exclusive Maldives travel package! Picture-perfect beaches, crystal-clear turquoise waters, & luxurious accommodations await you in this tropical paradise.',
    price: 1850,
    currency: 'USD',
    duration: {
      nights: 6,
      days: 7,
    },
    persons: 2,
    images: [
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
      'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80',
      'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=800&q=80',
      'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?w=800&q=80',
    ],
    inclusions: [
      { label: 'Accommodation for 6 Nights (Double sharing)', included: true },
      { label: 'All meals & beverages during Canareef stay', included: true },
      { label: 'Daily Breakfast, lunch & dinner at Manta Beach Retreat', included: true },
      { label: 'Return transfer between Gan-Meedhoo-Canareef', included: true },
      { label: 'Free wifi at both properties', included: true },
      { label: 'All taxes & Service Charges', included: true },
    ],
    activities: [
      { name: 'Snorkelling Excursions', icon: 'waves' },
      { name: 'Sunset Fishing', icon: 'fish' },
      { name: 'Beach Dinner', icon: 'utensils' },
    ],
    featured: true,
    badge: 'Best Seller',
    contactInfo: {
      whatsapp: '+960 9495654',
      email: 'travel@southernmaldives.com',
    },
  },
  {
    id: 'addu-meedhoo',
    title: 'Travel to Addu Meedhoo',
    subtitle: 'Southern Maldives Getaway',
    description:
      'Swim, smile, and soak in the magic of the southern Maldives! Enjoy a snorkeling trip, a sunset dolphin cruise, and a romantic beach dinner. The perfect tropical getaway.',
    price: 999,
    currency: 'USD',
    duration: {
      nights: 4,
      days: 5,
    },
    persons: 2,
    images: [
      'https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?w=800&q=80',
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    ],
    inclusions: [
      { label: '4 Nights accommodation', included: true },
      { label: 'Breakfast & dinner + 1 special beach dinner', included: true },
      { label: 'Dolphin cruise & snorkeling trip', included: true },
    ],
    highlights: [
      'Sunset dolphin cruise',
      'Snorkeling adventure',
      'Romantic beach dinner',
    ],
    bookingDeadline: '20th Dec 2025',
    travelDates: 'Nov 2025 - June 2026',
    badge: 'Limited Offer',
    contactInfo: {
      whatsapp: '+960 9495654',
      website: 'www.southernmaldivetravels.com',
      address: 'Sun view/S.Meedhoo, Alih Villaamaguu, Addu city, Maldives',
    },
  },
  {
    id: 'southern-maldives-diving',
    title: 'Southern Maldives Travels',
    subtitle: 'Diving Adventure Package',
    description:
      'Dive into the Southern Wonders of the Maldives! Discover Addu Atoll\'s pristine reefs, vibrant marine life, and historical dive sites — the perfect getaway for certified open water divers seeking both adventure and relaxation.',
    price: 1399,
    currency: 'USD',
    duration: {
      nights: 4,
      days: 5,
    },
    persons: 2,
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
      'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=800&q=80',
      'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&q=80',
      'https://images.unsplash.com/photo-1560266559-f472c5365164?w=800&q=80',
    ],
    inclusions: [
      { label: '4 nights accommodation in Beach Front Hotel', included: true },
      { label: 'Breakfast & dinner', included: true },
      { label: '12 dives + dive gear', included: true },
      { label: 'Return transfer from Gan Intl. Airport to Meedhoo', included: true },
    ],
    highlights: [
      'Pristine reef diving',
      'Vibrant marine life',
      'Historical dive sites',
      'Certified diver experience',
    ],
    badge: 'Popular',
    contactInfo: {
      email: 'travel@southernmaldives.com',
    },
  },
];

export async function getPackages(): Promise<TravelPackage[]> {
  const response = await fetch(`${API_BASE}/api/packages`, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || response.statusText);
  }

  return response.json();
}

export async function getPackageById(id: string): Promise<TravelPackage | undefined> {
  const response = await fetch(`${API_BASE}/api/packages/${id}`, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    if (response.status === 404) return undefined;
    const text = await response.text();
    throw new Error(text || response.statusText);
  }

  return response.json();
}
