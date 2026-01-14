/*
  # Fix Security Issues v3
  
  1. Changes
    - Drop unused index on circuit_stages table
    - Consolidate duplicate RLS policies on rentals table
    - Set immutable search_path on all functions to prevent search path attacks
  
  2. Security Improvements
    - Fixed mutable search_path vulnerability on 9 functions
    - Removed redundant permissive policies
*/

-- 1. Drop unused index
DROP INDEX IF EXISTS idx_circuit_stages_excursion_id;

-- 2. Consolidate duplicate RLS policies on rentals
DROP POLICY IF EXISTS "Anon can view active rentals" ON rentals;
DROP POLICY IF EXISTS "Anonymous users can view active rentals" ON rentals;

CREATE POLICY "Anon can view active rentals"
  ON rentals
  FOR SELECT
  TO anon
  USING (is_active = true);

-- 3. Drop and recreate functions with secure search_path

-- Drop existing functions
DROP FUNCTION IF EXISTS get_all_rentals();
DROP FUNCTION IF EXISTS get_active_rentals();
DROP FUNCTION IF EXISTS get_rentals_by_type(text);
DROP FUNCTION IF EXISTS get_active_excursions();
DROP FUNCTION IF EXISTS get_day_excursions();
DROP FUNCTION IF EXISTS get_multi_day_tours();
DROP FUNCTION IF EXISTS delete_rental(uuid);
DROP FUNCTION IF EXISTS create_rental(text, text, text, text, text, text, text, text[], text[], numeric, text, text, integer, text, text[], boolean, integer);
DROP FUNCTION IF EXISTS update_rental(uuid, text, text, text, text, text, text, text, text[], text[], numeric, text, text, integer, text, text[], boolean, integer);

-- Recreate get_all_rentals
CREATE FUNCTION get_all_rentals()
RETURNS SETOF rentals
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT * FROM rentals 
  ORDER BY type ASC, display_order ASC, name_fr ASC;
$$;

-- Recreate get_active_rentals
CREATE FUNCTION get_active_rentals()
RETURNS SETOF rentals
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT * FROM rentals 
  WHERE is_active = true 
  ORDER BY type ASC, display_order ASC, name_fr ASC;
$$;

-- Recreate get_rentals_by_type
CREATE FUNCTION get_rentals_by_type(rental_type text)
RETURNS SETOF rentals
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT * FROM rentals 
  WHERE type = rental_type AND is_active = true 
  ORDER BY display_order ASC, name_fr ASC;
$$;

-- Recreate get_active_excursions
CREATE FUNCTION get_active_excursions()
RETURNS SETOF excursions
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT * FROM excursions 
  WHERE is_active = true 
  ORDER BY display_order ASC, title_fr ASC;
$$;

-- Recreate get_day_excursions
CREATE FUNCTION get_day_excursions()
RETURNS SETOF excursions
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT * FROM excursions 
  WHERE is_active = true AND is_multi_day = false
  ORDER BY display_order ASC, title_fr ASC;
$$;

-- Recreate get_multi_day_tours
CREATE FUNCTION get_multi_day_tours()
RETURNS SETOF excursions
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT * FROM excursions 
  WHERE is_active = true AND is_multi_day = true
  ORDER BY display_order ASC, title_fr ASC;
$$;

-- Recreate delete_rental
CREATE FUNCTION delete_rental(p_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM rentals WHERE id = p_id;
  RETURN FOUND;
END;
$$;

-- Recreate create_rental
CREATE FUNCTION create_rental(
  p_slug text,
  p_type text,
  p_category text,
  p_name_fr text,
  p_name_en text,
  p_description_fr text,
  p_description_en text,
  p_features_fr text[],
  p_features_en text[],
  p_price_per_day numeric,
  p_price_note_fr text,
  p_price_note_en text,
  p_capacity integer,
  p_image_url text,
  p_gallery_urls text[],
  p_is_active boolean,
  p_display_order integer
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id uuid;
BEGIN
  INSERT INTO rentals (
    slug, type, category, name_fr, name_en, description_fr, description_en,
    features_fr, features_en, price_per_day, price_note_fr, price_note_en,
    capacity, image_url, gallery_urls, is_active, display_order,
    created_at, updated_at
  ) VALUES (
    p_slug, p_type, p_category, p_name_fr, p_name_en, p_description_fr, p_description_en,
    p_features_fr, p_features_en, p_price_per_day, p_price_note_fr, p_price_note_en,
    p_capacity, p_image_url, p_gallery_urls, p_is_active, p_display_order,
    now(), now()
  )
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;

-- Recreate update_rental
CREATE FUNCTION update_rental(
  p_id uuid,
  p_slug text DEFAULT NULL,
  p_type text DEFAULT NULL,
  p_category text DEFAULT NULL,
  p_name_fr text DEFAULT NULL,
  p_name_en text DEFAULT NULL,
  p_description_fr text DEFAULT NULL,
  p_description_en text DEFAULT NULL,
  p_features_fr text[] DEFAULT NULL,
  p_features_en text[] DEFAULT NULL,
  p_price_per_day numeric DEFAULT NULL,
  p_price_note_fr text DEFAULT NULL,
  p_price_note_en text DEFAULT NULL,
  p_capacity integer DEFAULT NULL,
  p_image_url text DEFAULT NULL,
  p_gallery_urls text[] DEFAULT NULL,
  p_is_active boolean DEFAULT NULL,
  p_display_order integer DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE rentals SET
    slug = COALESCE(p_slug, slug),
    type = COALESCE(p_type, type),
    category = COALESCE(p_category, category),
    name_fr = COALESCE(p_name_fr, name_fr),
    name_en = COALESCE(p_name_en, name_en),
    description_fr = COALESCE(p_description_fr, description_fr),
    description_en = COALESCE(p_description_en, description_en),
    features_fr = COALESCE(p_features_fr, features_fr),
    features_en = COALESCE(p_features_en, features_en),
    price_per_day = COALESCE(p_price_per_day, price_per_day),
    price_note_fr = COALESCE(p_price_note_fr, price_note_fr),
    price_note_en = COALESCE(p_price_note_en, price_note_en),
    capacity = COALESCE(p_capacity, capacity),
    image_url = COALESCE(p_image_url, image_url),
    gallery_urls = COALESCE(p_gallery_urls, gallery_urls),
    is_active = COALESCE(p_is_active, is_active),
    display_order = COALESCE(p_display_order, display_order),
    updated_at = now()
  WHERE id = p_id;
  
  RETURN FOUND;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_all_rentals() TO authenticated;
GRANT EXECUTE ON FUNCTION get_active_rentals() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_rentals_by_type(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_active_excursions() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_day_excursions() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_multi_day_tours() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION delete_rental(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION create_rental(text, text, text, text, text, text, text, text[], text[], numeric, text, text, integer, text, text[], boolean, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION update_rental(uuid, text, text, text, text, text, text, text, text[], text[], numeric, text, text, integer, text, text[], boolean, integer) TO authenticated;

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
