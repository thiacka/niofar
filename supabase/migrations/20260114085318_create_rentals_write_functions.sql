/*
  # Create Write RPC Functions for Rentals
  
  1. Purpose
    - Create RPC functions for insert/update/delete operations
    - Bypass PostgREST schema cache issues
  
  2. Functions
    - create_rental: Insert a new rental
    - update_rental: Update an existing rental
    - delete_rental: Delete a rental
*/

-- Function to create a rental
CREATE OR REPLACE FUNCTION create_rental(
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

-- Function to update a rental
CREATE OR REPLACE FUNCTION update_rental(
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

-- Function to delete a rental
CREATE OR REPLACE FUNCTION delete_rental(p_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM rentals WHERE id = p_id;
  RETURN FOUND;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION create_rental(text, text, text, text, text, text, text, text[], text[], numeric, text, text, integer, text, text[], boolean, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION update_rental(uuid, text, text, text, text, text, text, text, text[], text[], numeric, text, text, integer, text, text[], boolean, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_rental(uuid) TO authenticated;

-- Notify schema reload
NOTIFY pgrst, 'reload schema';
