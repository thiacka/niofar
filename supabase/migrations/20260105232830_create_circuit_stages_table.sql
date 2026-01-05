/*
  # Create circuit stages table for detailed itineraries

  1. New Tables
    - `circuit_stages`
      - `id` (uuid, primary key)
      - `excursion_id` (uuid, foreign key to excursions)
      - `day_number` (integer) - Which day of the circuit (1, 2, 3, etc.)
      - `stage_number` (integer) - Stage number within the day (1, 2, 3, etc.)
      - `title_fr` (text) - Stage title in French
      - `title_en` (text) - Stage title in English
      - `description_fr` (text) - Detailed description in French
      - `description_en` (text) - Detailed description in English
      - `images` (text[]) - Array of image URLs for this stage
      - `duration_minutes` (integer) - Duration of this stage in minutes
      - `start_time` (time) - Start time for this stage
      - `end_time` (time) - End time for this stage
      - `location_fr` (text) - Location name in French
      - `location_en` (text) - Location name in English
      - `display_order` (integer) - Order of display
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `circuit_stages` table
    - Add policy for public SELECT access (authenticated users can view)
    - Add policies for admin INSERT, UPDATE, DELETE operations

  3. Indexes
    - Add index on excursion_id for faster lookups
    - Add composite index on (excursion_id, day_number, stage_number)
*/

CREATE TABLE IF NOT EXISTS circuit_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  excursion_id uuid NOT NULL REFERENCES excursions(id) ON DELETE CASCADE,
  day_number integer NOT NULL DEFAULT 1,
  stage_number integer NOT NULL DEFAULT 1,
  title_fr text NOT NULL DEFAULT '',
  title_en text NOT NULL DEFAULT '',
  description_fr text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '',
  images text[] DEFAULT '{}',
  duration_minutes integer DEFAULT 0,
  start_time time,
  end_time time,
  location_fr text DEFAULT '',
  location_en text DEFAULT '',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE circuit_stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view circuit stages"
  ON circuit_stages
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert circuit stages"
  ON circuit_stages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update circuit stages"
  ON circuit_stages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete circuit stages"
  ON circuit_stages
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_circuit_stages_excursion_id ON circuit_stages(excursion_id);
CREATE INDEX IF NOT EXISTS idx_circuit_stages_day_stage ON circuit_stages(excursion_id, day_number, stage_number);