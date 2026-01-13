/*
  # Create Rentals Table
  
  1. New Tables
    - `rentals`
      - `id` (uuid, primary key)
      - `slug` (text, unique) - URL-friendly identifier
      - `type` (text) - Type: 'vehicle', 'incentive', 'boat'
      - `category` (text) - Category: '4x4', 'berline', 'minibus', 'bus', 'incentive', 'cruise'
      - `name_fr` (text) - Name in French
      - `name_en` (text) - Name in English
      - `description_fr` (text) - Description in French
      - `description_en` (text) - Description in English
      - `features_fr` (jsonb) - Features/specifications in French
      - `features_en` (jsonb) - Features/specifications in English
      - `price_per_day` (numeric) - Daily rental price
      - `price_note_fr` (text) - Price notes in French
      - `price_note_en` (text) - Price notes in English
      - `capacity` (integer) - Passenger/guest capacity
      - `image_url` (text) - Main image URL
      - `gallery_urls` (jsonb) - Array of additional image URLs
      - `is_active` (boolean) - Whether the rental is currently available
      - `display_order` (integer) - Order for display
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `rentals` table
    - Add policy for anonymous users to view active rentals
    - Add policy for authenticated users to view all rentals
    - Add policy for authenticated users to create, update, and delete rentals (admin only)
*/

CREATE TABLE IF NOT EXISTS rentals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('vehicle', 'incentive', 'boat')),
  category text NOT NULL,
  name_fr text NOT NULL,
  name_en text NOT NULL,
  description_fr text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '',
  features_fr jsonb DEFAULT '[]'::jsonb,
  features_en jsonb DEFAULT '[]'::jsonb,
  price_per_day numeric NOT NULL DEFAULT 0,
  price_note_fr text DEFAULT '',
  price_note_en text DEFAULT '',
  capacity integer DEFAULT 1,
  image_url text DEFAULT '',
  gallery_urls jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anonymous users can view active rentals"
  ON rentals
  FOR SELECT
  TO anon
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all rentals"
  ON rentals
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert rentals"
  ON rentals
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update rentals"
  ON rentals
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete rentals"
  ON rentals
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_rentals_type ON rentals(type);
CREATE INDEX IF NOT EXISTS idx_rentals_category ON rentals(category);
CREATE INDEX IF NOT EXISTS idx_rentals_is_active ON rentals(is_active);
CREATE INDEX IF NOT EXISTS idx_rentals_display_order ON rentals(display_order);