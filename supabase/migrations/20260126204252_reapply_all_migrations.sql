/*
  # Reapply all database migrations
  
  This migration recreates the entire database schema for the NIO FAR project.
  It includes all tables, policies, functions, and seed data.
*/

-- Drop existing policies to avoid conflicts
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Anyone can submit contact messages" ON contact_messages;
    DROP POLICY IF EXISTS "Authenticated users can read contact messages" ON contact_messages;
    DROP POLICY IF EXISTS "Anyone can submit bookings" ON bookings;
    DROP POLICY IF EXISTS "Authenticated users can read bookings" ON bookings;
    DROP POLICY IF EXISTS "Public can view active circuits" ON circuits;
    DROP POLICY IF EXISTS "Public can view active promotions" ON promotions;
EXCEPTION
    WHEN undefined_table THEN NULL;
END $$;

-- Create tables
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  country text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  circuit_id text NOT NULL,
  circuit_title text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  country text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  adults integer NOT NULL DEFAULT 1,
  children integer DEFAULT 0,
  special_requests text,
  estimated_total integer,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Add reference_number and excursion_id columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'reference_number') THEN
    ALTER TABLE bookings ADD COLUMN reference_number text UNIQUE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'excursion_id') THEN
    ALTER TABLE bookings ADD COLUMN excursion_id text;
    UPDATE bookings SET excursion_id = circuit_id WHERE excursion_id IS NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'excursion_title') THEN
    ALTER TABLE bookings ADD COLUMN excursion_title text;
    UPDATE bookings SET excursion_title = circuit_title WHERE excursion_title IS NULL;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS circuits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  image_url text NOT NULL DEFAULT '',
  duration_en text NOT NULL DEFAULT '',
  duration_fr text NOT NULL DEFAULT '',
  duration_days integer NOT NULL DEFAULT 1,
  title_en text NOT NULL DEFAULT '',
  title_fr text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '',
  description_fr text NOT NULL DEFAULT '',
  highlights_en text[] NOT NULL DEFAULT '{}',
  highlights_fr text[] NOT NULL DEFAULT '{}',
  itinerary jsonb NOT NULL DEFAULT '[]',
  included_services_fr jsonb NOT NULL DEFAULT '[]',
  included_services_en jsonb NOT NULL DEFAULT '[]',
  accommodation_type_fr text,
  accommodation_type_en text,
  min_participants integer DEFAULT 2,
  max_participants integer DEFAULT 12,
  price integer NOT NULL DEFAULT 0,
  price_note_en text NOT NULL DEFAULT 'per person',
  price_note_fr text NOT NULL DEFAULT 'par personne',
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  circuit_id uuid REFERENCES circuits(id) ON DELETE SET NULL,
  code text UNIQUE NOT NULL,
  name_en text NOT NULL DEFAULT '',
  name_fr text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '',
  description_fr text NOT NULL DEFAULT '',
  discount_type text NOT NULL DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value integer NOT NULL DEFAULT 0,
  min_travelers integer NOT NULL DEFAULT 1,
  start_date date,
  end_date date,
  is_active boolean NOT NULL DEFAULT true,
  usage_limit integer,
  usage_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS page_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL CHECK (page IN ('home', 'services', 'experiences', 'why-nio-far')),
  section text NOT NULL,
  image_url text NOT NULL,
  alt_text_en text DEFAULT '',
  alt_text_fr text DEFAULT '',
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('administrator', 'editor', 'contributor')),
  password_hash text NOT NULL,
  last_login timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS page_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL,
  section text NOT NULL,
  key text NOT NULL,
  content_fr text DEFAULT '',
  content_en text DEFAULT '',
  content_type text DEFAULT 'text',
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(page, section, key)
);

CREATE TABLE IF NOT EXISTS excursions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title_fr text NOT NULL DEFAULT '',
  title_en text NOT NULL DEFAULT '',
  description_fr text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '',
  duration_fr text NOT NULL DEFAULT '',
  duration_en text NOT NULL DEFAULT '',
  price numeric NOT NULL DEFAULT 0,
  price_note_fr text NOT NULL DEFAULT '',
  price_note_en text NOT NULL DEFAULT '',
  highlights_fr jsonb NOT NULL DEFAULT '[]',
  highlights_en jsonb NOT NULL DEFAULT '[]',
  image_url text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  is_multi_day boolean DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS circuit_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  excursion_id uuid NOT NULL REFERENCES excursions(id) ON DELETE CASCADE,
  day_number integer NOT NULL DEFAULT 1,
  stage_number integer NOT NULL DEFAULT 1,
  title_fr text NOT NULL DEFAULT '',
  title_en text NOT NULL DEFAULT '',
  description_fr text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '',
  start_time time,
  end_time time,
  images text[] DEFAULT '{}',
  duration_minutes integer DEFAULT 0,
  location_fr text DEFAULT '',
  location_en text DEFAULT '',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rentals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('vehicle', 'incentive', 'boat')),
  category text NOT NULL,
  name_fr text NOT NULL,
  name_en text NOT NULL,
  description_fr text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '',
  features_fr jsonb DEFAULT '[]',
  features_en jsonb DEFAULT '[]',
  price_per_day numeric NOT NULL DEFAULT 0,
  price_note_fr text DEFAULT '',
  price_note_en text DEFAULT '',
  capacity integer DEFAULT 1,
  image_url text DEFAULT '',
  gallery_urls jsonb DEFAULT '[]',
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE circuits ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE excursions ENABLE ROW LEVEL SECURITY;
ALTER TABLE circuit_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_page_images_page_section ON page_images(page, section);
CREATE INDEX IF NOT EXISTS idx_page_content_page_section ON page_content(page, section);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_excursions_slug ON excursions(slug);
CREATE INDEX IF NOT EXISTS idx_circuit_stages_excursion_id ON circuit_stages(excursion_id);
CREATE INDEX IF NOT EXISTS idx_rentals_type ON rentals(type);

-- Create RLS policies for anon access (client-side auth)
CREATE POLICY "Anon can submit contact messages"
  ON contact_messages FOR INSERT TO anon WITH CHECK (true);
  
CREATE POLICY "Anon can view all contact messages"
  ON contact_messages FOR SELECT TO anon USING (true);
  
CREATE POLICY "Anon can insert bookings"
  ON bookings FOR INSERT TO anon WITH CHECK (true);
  
CREATE POLICY "Anon can view bookings"
  ON bookings FOR SELECT TO anon USING (true);
  
CREATE POLICY "Anon can update bookings"
  ON bookings FOR UPDATE TO anon USING (true) WITH CHECK (true);
  
CREATE POLICY "Anon can view all circuits"
  ON circuits FOR SELECT TO anon USING (true);
  
CREATE POLICY "Anon can manage circuits"
  ON circuits FOR ALL TO anon USING (true) WITH CHECK (true);
  
CREATE POLICY "Anon can view all promotions"
  ON promotions FOR SELECT TO anon USING (true);
  
CREATE POLICY "Anon can manage promotions"
  ON promotions FOR ALL TO anon USING (true) WITH CHECK (true);
  
CREATE POLICY "Anon can view all page images"
  ON page_images FOR SELECT TO anon USING (true);
  
CREATE POLICY "Anon can manage page images"
  ON page_images FOR ALL TO anon USING (true) WITH CHECK (true);
  
CREATE POLICY "Anon can view users"
  ON users FOR SELECT TO anon USING (true);
  
CREATE POLICY "Anon can manage users"
  ON users FOR ALL TO anon USING (true) WITH CHECK (true);
  
CREATE POLICY "Anon can view all page content"
  ON page_content FOR SELECT TO anon USING (true);
  
CREATE POLICY "Anon can manage page content"
  ON page_content FOR ALL TO anon USING (true) WITH CHECK (true);
  
CREATE POLICY "Anon can view all excursions"
  ON excursions FOR SELECT TO anon USING (true);
  
CREATE POLICY "Anon can manage excursions"
  ON excursions FOR ALL TO anon USING (true) WITH CHECK (true);
  
CREATE POLICY "Anon can view circuit stages"
  ON circuit_stages FOR SELECT TO anon USING (true);
  
CREATE POLICY "Anon can manage circuit stages"
  ON circuit_stages FOR ALL TO anon USING (true) WITH CHECK (true);
  
CREATE POLICY "Anon can view all rentals"
  ON rentals FOR SELECT TO anon USING (true);
  
CREATE POLICY "Anon can manage rentals"
  ON rentals FOR ALL TO anon USING (true) WITH CHECK (true);

-- Create rental management functions
CREATE OR REPLACE FUNCTION get_all_rentals()
RETURNS TABLE (
  id uuid,
  slug text,
  type text,
  category text,
  name_fr text,
  name_en text,
  description_fr text,
  description_en text,
  features_fr jsonb,
  features_en jsonb,
  price_per_day numeric,
  price_note_fr text,
  price_note_en text,
  capacity integer,
  image_url text,
  gallery_urls jsonb,
  is_active boolean,
  display_order integer,
  created_at timestamptz,
  updated_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT r.* FROM rentals r
  ORDER BY r.display_order, r.name_fr;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_rentals_by_type(rental_type text)
RETURNS TABLE (
  id uuid,
  slug text,
  type text,
  category text,
  name_fr text,
  name_en text,
  description_fr text,
  description_en text,
  features_fr jsonb,
  features_en jsonb,
  price_per_day numeric,
  price_note_fr text,
  price_note_en text,
  capacity integer,
  image_url text,
  gallery_urls jsonb,
  is_active boolean,
  display_order integer,
  created_at timestamptz,
  updated_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT r.* FROM rentals r
  WHERE r.type = rental_type AND r.is_active = true
  ORDER BY r.display_order, r.name_fr;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_active_rentals()
RETURNS TABLE (
  id uuid,
  slug text,
  type text,
  category text,
  name_fr text,
  name_en text,
  description_fr text,
  description_en text,
  features_fr jsonb,
  features_en jsonb,
  price_per_day numeric,
  price_note_fr text,
  price_note_en text,
  capacity integer,
  image_url text,
  gallery_urls jsonb,
  is_active boolean,
  display_order integer,
  created_at timestamptz,
  updated_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT r.* FROM rentals r
  WHERE r.is_active = true
  ORDER BY r.display_order, r.name_fr;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_all_rentals() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_rentals_by_type(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_active_rentals() TO anon, authenticated;

-- Add table comments for schema visibility
COMMENT ON TABLE page_content IS 'Static page content for multilingual support';
COMMENT ON TABLE circuits IS 'Multi-day tour circuits';
COMMENT ON TABLE excursions IS 'Day trips and excursions';
COMMENT ON TABLE rentals IS 'Vehicle and equipment rentals';

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';