/*
  # Migrate Circuits to Excursions

  1. Changes
    - Copy all circuit data to excursions table with type conversion
    - Clear circuits table after migration
  
  2. Notes
    - This migration moves existing circuit data to excursions
    - Circuits were actually day excursions, so they belong in the excursions table
    - The circuits table will be kept for potential future multi-day tours
    - Converts text[] to jsonb for highlights fields
*/

INSERT INTO excursions (
  id,
  slug,
  title_fr,
  title_en,
  description_fr,
  description_en,
  duration_fr,
  duration_en,
  price,
  price_note_fr,
  price_note_en,
  highlights_fr,
  highlights_en,
  image_url,
  is_active,
  display_order,
  created_at,
  updated_at
)
SELECT 
  id,
  slug,
  title_fr,
  title_en,
  description_fr,
  description_en,
  duration_fr,
  duration_en,
  price,
  price_note_fr,
  price_note_en,
  to_jsonb(highlights_fr) as highlights_fr,
  to_jsonb(highlights_en) as highlights_en,
  image_url,
  is_active,
  display_order,
  created_at,
  updated_at
FROM circuits
ON CONFLICT (id) DO NOTHING;

DELETE FROM circuits;
