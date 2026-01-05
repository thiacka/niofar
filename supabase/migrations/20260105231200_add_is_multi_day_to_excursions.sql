/*
  # Add is_multi_day column to excursions table

  1. Changes
    - Add `is_multi_day` boolean column to excursions table
    - Set default value to false for daily excursions
    - Update existing multi-day excursions (Sine-Saloum, Saint-Louis, Casamance)

  2. Purpose
    - Allow filtering between daily excursions and multi-day tours
    - Daily excursions appear on "Excursions" page
    - Multi-day tours appear on "Circuits & Decouvertes" page
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'excursions' AND column_name = 'is_multi_day'
  ) THEN
    ALTER TABLE excursions ADD COLUMN is_multi_day boolean DEFAULT false;
  END IF;
END $$;

UPDATE excursions SET is_multi_day = true WHERE slug IN ('sine-saloum', 'saint-louis', 'casamance');
UPDATE excursions SET is_multi_day = false WHERE slug IN ('lac-rose', 'goree-island', 'dakar-discovery');