/*
  # Fix Security and Performance Issues

  1. Performance Fixes
    - Add index on `promotions.circuit_id` foreign key to improve join performance
    - Drop unused `idx_page_images_is_active` index

  2. RLS Policy Consolidation - circuits table
    - Drop overly permissive "Allow all operations for service role on circuits" policy
    - Keep "Public can view active circuits" for public read access
    - Add specific INSERT, UPDATE, DELETE policies for authenticated users

  3. RLS Policy Consolidation - page_images table
    - Drop redundant "Anyone can view all images" policy (conflicts with active-only policy)
    - Drop redundant "Service role can *" policies (duplicate with admin policies)
    - Keep admin-specific policies for authenticated users
    - Keep "Anyone can view active page images" for public read

  4. RLS Policy Consolidation - promotions table
    - Drop overly permissive "Allow all operations for service role on promotions" policy
    - Keep "Public can view active promotions" for public read access
    - Add specific INSERT, UPDATE, DELETE policies for authenticated users

  5. Function Security Fix
    - Recreate `generate_booking_reference` function with immutable search_path

  6. Notes
    - Auth DB Connection Strategy must be changed in Supabase Dashboard settings
*/

-- 1. Add index on promotions.circuit_id foreign key
CREATE INDEX IF NOT EXISTS idx_promotions_circuit_id ON promotions(circuit_id);

-- 2. Drop unused index on page_images.is_active
DROP INDEX IF EXISTS idx_page_images_is_active;

-- 3. Fix circuits table policies
DROP POLICY IF EXISTS "Allow all operations for service role on circuits" ON circuits;

CREATE POLICY "Authenticated users can insert circuits"
  ON circuits
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update circuits"
  ON circuits
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete circuits"
  ON circuits
  FOR DELETE
  TO authenticated
  USING (true);

-- 4. Fix page_images table policies - remove redundant policies
DROP POLICY IF EXISTS "Anyone can view all images" ON page_images;
DROP POLICY IF EXISTS "Service role can delete images" ON page_images;
DROP POLICY IF EXISTS "Service role can insert images" ON page_images;
DROP POLICY IF EXISTS "Service role can update images" ON page_images;

-- 5. Fix promotions table policies
DROP POLICY IF EXISTS "Allow all operations for service role on promotions" ON promotions;

CREATE POLICY "Authenticated users can insert promotions"
  ON promotions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update promotions"
  ON promotions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete promotions"
  ON promotions
  FOR DELETE
  TO authenticated
  USING (true);

-- 6. Fix generate_booking_reference function with secure search_path
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  date_part text;
  random_part text;
  new_ref text;
BEGIN
  date_part := to_char(now(), 'YYYYMMDD');
  random_part := upper(substr(md5(random()::text), 1, 4));
  new_ref := 'NF-' || date_part || '-' || random_part;
  
  WHILE EXISTS (SELECT 1 FROM bookings WHERE reference_number = new_ref) LOOP
    random_part := upper(substr(md5(random()::text), 1, 4));
    new_ref := 'NF-' || date_part || '-' || random_part;
  END LOOP;
  
  NEW.reference_number := new_ref;
  RETURN NEW;
END;
$$;