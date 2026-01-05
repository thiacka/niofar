/*
  # Create page content table for static content management

  1. New Tables
    - `page_content`
      - `id` (uuid, primary key) - Unique identifier
      - `page` (text) - Page name (e.g., 'home', 'services', 'contact')
      - `section` (text) - Section identifier (e.g., 'hero', 'intro', 'services')
      - `key` (text) - Content key (e.g., 'title', 'subtitle', 'description')
      - `content_fr` (text) - Content in French
      - `content_en` (text) - Content in English
      - `content_type` (text) - Type of content (text, html, url)
      - `is_active` (boolean) - Whether content is active
      - `display_order` (integer) - Display order
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `page_content` table
    - Add policy for anyone to read active content
    - Add policy for authenticated users to update content

  3. Indexes
    - Create index on page and section for faster queries
    - Create unique index on page, section, key combination
*/

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

CREATE INDEX IF NOT EXISTS idx_page_content_page_section ON page_content(page, section);

ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active page content"
  ON page_content
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can insert page content"
  ON page_content
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update page content"
  ON page_content
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete page content"
  ON page_content
  FOR DELETE
  TO authenticated
  USING (true);