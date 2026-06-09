-- PostgreSQL Schema for Southern Maldives Travels

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enquiries
CREATE TABLE IF NOT EXISTS app_1e21816bb9_enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    destination TEXT NOT NULL,
    trip_type VARCHAR(64),
    check_in DATE,
    check_out DATE,
    guests INTEGER DEFAULT 1,
    adults INTEGER DEFAULT 1,
    children INTEGER DEFAULT 0,
    room_type VARCHAR(64),
    airport_transfer BOOLEAN DEFAULT FALSE,
    meal_plan VARCHAR(64),
    special_requests TEXT,
    contact_preference VARCHAR(32) DEFAULT 'email',
    status VARCHAR(32) DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Email Templates
CREATE TABLE IF NOT EXISTS app_1e21816bb9_email_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    required_variables JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Hotels
CREATE TABLE IF NOT EXISTS app_1e21816bb9_hotels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    images JSONB NOT NULL DEFAULT '[]',
    location TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    star_rating INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    slug VARCHAR(255) UNIQUE,
    long_description TEXT,
    distance_from_airport INTEGER,
    nearby_attractions JSONB DEFAULT '[]',
    guest_rating DECIMAL(4,2),
    review_count INTEGER DEFAULT 0,
    cinemagraph_url TEXT,
     vision_main_text VARCHAR(255) DEFAULT 'Pristine',
     vision_italic_text VARCHAR(255) DEFAULT 'Elegance',
     hide_culinary_section BOOLEAN DEFAULT FALSE
);

-- Hotel Rooms
CREATE TABLE IF NOT EXISTS app_1e21816bb9_hotel_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hotel_id UUID NOT NULL REFERENCES app_1e21816bb9_hotels(id) ON DELETE CASCADE,
    room_name TEXT NOT NULL,
    room_type VARCHAR(128),
    description TEXT,
    max_guests INTEGER DEFAULT 2,
    bed_type VARCHAR(128),
    room_size INTEGER,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    amenities JSONB DEFAULT '[]',
    images JSONB DEFAULT '[]',
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Hotel Amenities
CREATE TABLE IF NOT EXISTS app_1e21816bb9_hotel_amenities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hotel_id UUID NOT NULL REFERENCES app_1e21816bb9_hotels(id) ON DELETE CASCADE,
    amenity_name TEXT NOT NULL,
    category VARCHAR(128),
    icon_name VARCHAR(128),
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Restaurant JSON Structure (stored in restaurants column):
-- {
--   "id": "uuid",                          -- Optional restaurant ID
--   "name": "string",                      -- Restaurant name (required)
--   "type": "Signature Dining|Casual|Bar|Café",  -- Restaurant type (required)
--   "cuisine": "string",                   -- Cuisine type (required)
--   "images": ["url1", "url2"],           -- Array of image URLs (optional)
--   "schedules": [                         -- Operating schedules (required, min 1)
--     {
--       "label": "Lunch|Dinner|Daily",     -- Schedule label
--       "start": "HH:MM",                  -- Start time
--       "end": "HH:MM"                     -- End time
--     }
--   ],
--   "menu_link": "url"                     -- Optional menu URL
-- }
-- Hotel Dining
CREATE TABLE IF NOT EXISTS app_1e21816bb9_hotel_dining (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hotel_id UUID NOT NULL REFERENCES app_1e21816bb9_hotels(id) ON DELETE CASCADE,
    main_description TEXT,
    hero_image_url TEXT,
    section_label TEXT DEFAULT 'Culinary',
    heading_main TEXT DEFAULT 'Island',
    heading_italic TEXT DEFAULT 'Flavors',
    restaurants JSONB DEFAULT '[]',
    cuisines JSONB DEFAULT '[]',
    breakfast_types JSONB DEFAULT '[]',
    bar_info JSONB DEFAULT '{}',
    bar_info_section_label TEXT DEFAULT 'Mixology & Spirits',
    room_service BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Hotel Policies
CREATE TABLE IF NOT EXISTS app_1e21816bb9_hotel_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hotel_id UUID NOT NULL REFERENCES app_1e21816bb9_hotels(id) ON DELETE CASCADE,
    check_in TIME,
    check_out TIME,
    cancellation_policy TEXT,
    child_policy TEXT,
    pet_policy TEXT,
    smoking_policy TEXT,
    age_restriction INTEGER,
    deposit_required BOOLEAN DEFAULT FALSE,
    deposit_amount DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Promotions
CREATE TABLE IF NOT EXISTS app_1e21816bb9_promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Travel Packages
CREATE TABLE IF NOT EXISTS app_1e21816bb9_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    currency VARCHAR(8) NOT NULL DEFAULT 'USD',
    duration JSONB NOT NULL DEFAULT '{"nights":0,"days":0}',
    persons INTEGER NOT NULL DEFAULT 2,
    images JSONB NOT NULL DEFAULT '[]',
    inclusions JSONB NOT NULL DEFAULT '[]',
    activities JSONB DEFAULT '[]',
    featured BOOLEAN DEFAULT FALSE,
    badge VARCHAR(64),
    highlights JSONB DEFAULT '[]',
    booking_deadline VARCHAR(128),
    travel_dates VARCHAR(128),
    contact_info JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Testimonials
CREATE TABLE IF NOT EXISTS app_1e21816bb9_testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    avatar_url TEXT,
    is_visible BOOLEAN DEFAULT TRUE,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Hotel Gallery
CREATE TABLE IF NOT EXISTS app_1e21816bb9_hotel_gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hotel_id UUID NOT NULL REFERENCES app_1e21816bb9_hotels(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    category VARCHAR(128),
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users
CREATE TABLE IF NOT EXISTS app_1e21816bb9_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(32) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
