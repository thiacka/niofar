/*
  # Create Excursions Table

  1. New Tables
    - `excursions`
      - `id` (uuid, primary key)
      - `slug` (text, unique) - URL-friendly identifier
      - `title_fr` (text) - French title
      - `title_en` (text) - English title
      - `description_fr` (text) - French description
      - `description_en` (text) - English description
      - `duration_fr` (text) - Duration in French (e.g., "1 jour")
      - `duration_en` (text) - Duration in English (e.g., "1 day")
      - `price` (numeric) - Base price in FCFA
      - `price_note_fr` (text) - Price details in French
      - `price_note_en` (text) - Price details in English
      - `highlights_fr` (jsonb) - Array of highlights in French
      - `highlights_en` (jsonb) - Array of highlights in English
      - `image_url` (text) - Main image URL
      - `is_active` (boolean) - Whether excursion is active/visible
      - `display_order` (integer) - Order for display
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Update timestamp

  2. Security
    - Enable RLS on `excursions` table
    - Add policy for public to view active excursions
    - Add policies for authenticated users to manage all excursions (admin)
  
  3. Notes
    - Excursions are shorter day trips compared to multi-day circuits
    - Similar structure to circuits table for consistency
*/

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
  highlights_fr jsonb NOT NULL DEFAULT '[]'::jsonb,
  highlights_en jsonb NOT NULL DEFAULT '[]'::jsonb,
  image_url text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE excursions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active excursions"
  ON excursions
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all excursions"
  ON excursions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert excursions"
  ON excursions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update excursions"
  ON excursions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete excursions"
  ON excursions
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_excursions_slug ON excursions(slug);
CREATE INDEX IF NOT EXISTS idx_excursions_is_active ON excursions(is_active);
CREATE INDEX IF NOT EXISTS idx_excursions_display_order ON excursions(display_order);
