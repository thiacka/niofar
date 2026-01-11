/*
  # Create Excursions View as Cache Workaround
  
  Creates a view to access excursions data as a workaround for PostgREST cache issues.
  The view exposes all columns from the excursions table.
*/

CREATE OR REPLACE VIEW excursions_view AS
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
  highlights_fr,
  highlights_en,
  image_url,
  is_active,
  display_order,
  created_at,
  updated_at,
  is_multi_day
FROM excursions;