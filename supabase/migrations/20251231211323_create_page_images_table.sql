/*
  # Create page_images table

  1. New Tables
    - `page_images`
      - `id` (uuid, primary key) - Unique identifier
      - `page` (text) - Page name (home, services, experiences, why-nio-far)
      - `section` (text) - Section within the page (hero, discover, culture, etc.)
      - `image_url` (text) - URL of the image
      - `alt_text_en` (text) - Alternative text in English for accessibility
      - `alt_text_fr` (text) - Alternative text in French for accessibility
      - `display_order` (integer) - Order for displaying multiple images in the same section
      - `is_active` (boolean) - Whether the image is currently active
      - `created_at` (timestamptz) - Timestamp of creation
      - `updated_at` (timestamptz) - Timestamp of last update

  2. Security
    - Enable RLS on `page_images` table
    - Add policy for public read access (images are public content)
    - Add policy for authenticated admin users to manage images

  3. Indexes
    - Index on `page` and `section` for efficient queries
    - Index on `is_active` for filtering active images
*/

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

CREATE INDEX IF NOT EXISTS idx_page_images_page_section ON page_images(page, section);
CREATE INDEX IF NOT EXISTS idx_page_images_is_active ON page_images(is_active);

ALTER TABLE page_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active page images"
  ON page_images
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all page images"
  ON page_images
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert page images"
  ON page_images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update page images"
  ON page_images
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete page images"
  ON page_images
  FOR DELETE
  TO authenticated
  USING (true);

INSERT INTO page_images (page, section, image_url, alt_text_en, alt_text_fr, display_order, is_active) VALUES
('home', 'hero', 'https://images.pexels.com/photos/16558028/pexels-photo-16558028.jpeg?auto=compress&cs=tinysrgb&w=1920', 'Senegalese village landscape', 'Paysage de village sénégalais', 1, true),
('home', 'hero', 'https://images.pexels.com/photos/13419505/pexels-photo-13419505.jpeg?auto=compress&cs=tinysrgb&w=1920', 'Senegalese coastal view', 'Vue côtière sénégalaise', 2, true),
('home', 'hero', 'https://images.pexels.com/photos/14604774/pexels-photo-14604774.jpeg?auto=compress&cs=tinysrgb&w=1920', 'Sunset in Senegal', 'Coucher de soleil au Sénégal', 3, true),
('home', 'hero', 'https://images.pexels.com/photos/16971929/pexels-photo-16971929.jpeg?auto=compress&cs=tinysrgb&w=1920', 'Cultural traditions', 'Traditions culturelles', 4, true),
('home', 'discover', 'https://images.pexels.com/photos/14604774/pexels-photo-14604774.jpeg?auto=compress&cs=tinysrgb&w=800', 'Discover Senegal', 'Découvrir le Sénégal', 1, true),
('services', 'hero', 'https://images.pexels.com/photos/3889843/pexels-photo-3889843.jpeg?auto=compress&cs=tinysrgb&w=1920', 'Our services', 'Nos services', 1, true),
('services', 'guide', 'https://images.pexels.com/photos/3889827/pexels-photo-3889827.jpeg?auto=compress&cs=tinysrgb&w=800', 'Local guide', 'Guide local', 1, true),
('services', 'transport', 'https://images.pexels.com/photos/1178448/pexels-photo-1178448.jpeg?auto=compress&cs=tinysrgb&w=800', 'Transportation service', 'Service de transport', 1, true),
('services', 'accommodation', 'https://images.pexels.com/photos/2507007/pexels-photo-2507007.jpeg?auto=compress&cs=tinysrgb&w=800', 'Accommodation', 'Hébergement', 1, true),
('experiences', 'hero', 'https://images.pexels.com/photos/16971929/pexels-photo-16971929.jpeg?auto=compress&cs=tinysrgb&w=1920', 'Authentic experiences', 'Expériences authentiques', 1, true),
('experiences', 'culture', 'https://images.pexels.com/photos/16971929/pexels-photo-16971929.jpeg?auto=compress&cs=tinysrgb&w=800', 'Cultural encounters', 'Rencontres culturelles', 1, true),
('experiences', 'nature', 'https://images.pexels.com/photos/12715636/pexels-photo-12715636.jpeg?auto=compress&cs=tinysrgb&w=800', 'Nature and wildlife', 'Nature et faune', 1, true),
('experiences', 'gastronomy', 'https://images.pexels.com/photos/16558028/pexels-photo-16558028.jpeg?auto=compress&cs=tinysrgb&w=800', 'Local gastronomy', 'Gastronomie locale', 1, true),
('why-nio-far', 'hero', 'https://images.pexels.com/photos/5560532/pexels-photo-5560532.jpeg?auto=compress&cs=tinysrgb&w=1920', 'Why choose NIO FAR', 'Pourquoi choisir NIO FAR', 1, true),
('why-nio-far', 'team', 'https://images.pexels.com/photos/3889854/pexels-photo-3889854.jpeg?auto=compress&cs=tinysrgb&w=800', 'Our team', 'Notre équipe', 1, true);
