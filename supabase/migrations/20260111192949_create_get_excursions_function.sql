/*
  # Create RPC Function to Get Excursions
  
  Creates a stored function that returns excursions data.
  This bypasses PostgREST's table cache and allows us to access the data.
  
  1. New Functions
    - `get_active_excursions()` - Returns all active excursions ordered by display_order
    - `get_all_excursions()` - Returns all excursions (for admin)
*/

-- Function to get active excursions (for public)
CREATE OR REPLACE FUNCTION get_active_excursions()
RETURNS TABLE (
  id uuid,
  slug text,
  title_fr text,
  title_en text,
  description_fr text,
  description_en text,
  duration_fr text,
  duration_en text,
  price numeric,
  price_note_fr text,
  price_note_en text,
  highlights_fr jsonb,
  highlights_en jsonb,
  image_url text,
  is_active boolean,
  display_order integer,
  created_at timestamptz,
  updated_at timestamptz,
  is_multi_day boolean
)
LANGUAGE sql
SECURITY DEFINER
AS $$
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
  FROM excursions
  WHERE is_active = true
  ORDER BY display_order ASC;
$$;

-- Function to get all excursions (for admin)
CREATE OR REPLACE FUNCTION get_all_excursions()
RETURNS TABLE (
  id uuid,
  slug text,
  title_fr text,
  title_en text,
  description_fr text,
  description_en text,
  duration_fr text,
  duration_en text,
  price numeric,
  price_note_fr text,
  price_note_en text,
  highlights_fr jsonb,
  highlights_en jsonb,
  image_url text,
  is_active boolean,
  display_order integer,
  created_at timestamptz,
  updated_at timestamptz,
  is_multi_day boolean
)
LANGUAGE sql
SECURITY DEFINER
AS $$
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
  FROM excursions
  ORDER BY display_order ASC;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_active_excursions() TO anon;
GRANT EXECUTE ON FUNCTION get_active_excursions() TO authenticated;
GRANT EXECUTE ON FUNCTION get_all_excursions() TO authenticated;