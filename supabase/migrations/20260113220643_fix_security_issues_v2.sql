/*
  # Fix Security Issues - Comprehensive v2
  
  1. Index Issues
    - Add index on circuit_stages.excursion_id for foreign key performance
  
  2. Multiple Permissive Policies Consolidation
    - bookings: Consolidate anon SELECT, authenticated INSERT/SELECT
    - circuit_stages: Consolidate authenticated SELECT
    - circuits: Consolidate authenticated SELECT
    - contact_messages: Consolidate authenticated INSERT/SELECT
    - excursions: Consolidate authenticated SELECT
    - page_content: Consolidate authenticated SELECT
    - page_images: Consolidate authenticated SELECT
    - promotions: Consolidate authenticated SELECT
  
  3. Function Security
    - Fix search_path for get_active_excursions and get_all_excursions
*/

-- 1. Add missing index on foreign key
CREATE INDEX IF NOT EXISTS idx_circuit_stages_excursion_id ON circuit_stages(excursion_id);

-- 2. Fix bookings policies
DROP POLICY IF EXISTS "Anyone can view booking by reference" ON bookings;
DROP POLICY IF EXISTS "Anyone can view their booking by reference" ON bookings;
DROP POLICY IF EXISTS "Admins can manage bookings" ON bookings;
DROP POLICY IF EXISTS "Anyone can submit bookings" ON bookings;
DROP POLICY IF EXISTS "Authenticated users can read bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can delete bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON bookings;

CREATE POLICY "Anon can view booking by reference"
  ON bookings FOR SELECT
  TO anon
  USING (reference_number IS NOT NULL);

CREATE POLICY "Authenticated can view bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
    OR reference_number IS NOT NULL
  );

CREATE POLICY "Authenticated can insert bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'))
  WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Admins can delete bookings"
  ON bookings FOR DELETE
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- 3. Fix circuit_stages policies
DROP POLICY IF EXISTS "Admins can manage circuit stages" ON circuit_stages;
DROP POLICY IF EXISTS "Anyone can view circuit stages" ON circuit_stages;

CREATE POLICY "Anon can view circuit stages"
  ON circuit_stages FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated can view circuit stages"
  ON circuit_stages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert circuit stages"
  ON circuit_stages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Admins can update circuit stages"
  ON circuit_stages FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'))
  WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Admins can delete circuit stages"
  ON circuit_stages FOR DELETE
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- 4. Fix circuits policies
DROP POLICY IF EXISTS "Admins can manage circuits" ON circuits;
DROP POLICY IF EXISTS "Anyone can view active circuits" ON circuits;
DROP POLICY IF EXISTS "Admins can read circuits" ON circuits;

CREATE POLICY "Anon can view active circuits"
  ON circuits FOR SELECT
  TO anon
  USING (is_active = true);

CREATE POLICY "Authenticated can view circuits"
  ON circuits FOR SELECT
  TO authenticated
  USING (
    is_active = true
    OR auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

CREATE POLICY "Admins can insert circuits"
  ON circuits FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Admins can update circuits"
  ON circuits FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'))
  WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Admins can delete circuits"
  ON circuits FOR DELETE
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- 5. Fix contact_messages policies
DROP POLICY IF EXISTS "Admins can manage contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated users can read contact messages" ON contact_messages;

CREATE POLICY "Anon can submit contact messages"
  ON contact_messages FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated can submit contact messages"
  ON contact_messages FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view contact messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Admins can update contact messages"
  ON contact_messages FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'))
  WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Admins can delete contact messages"
  ON contact_messages FOR DELETE
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- 6. Fix excursions policies
DROP POLICY IF EXISTS "Admins can manage excursions" ON excursions;
DROP POLICY IF EXISTS "Anyone can view active excursions" ON excursions;

CREATE POLICY "Anon can view active excursions"
  ON excursions FOR SELECT
  TO anon
  USING (is_active = true);

CREATE POLICY "Authenticated can view excursions"
  ON excursions FOR SELECT
  TO authenticated
  USING (
    is_active = true
    OR auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

CREATE POLICY "Admins can insert excursions"
  ON excursions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Admins can update excursions"
  ON excursions FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'))
  WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Admins can delete excursions"
  ON excursions FOR DELETE
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- 7. Fix page_content policies
DROP POLICY IF EXISTS "Admins can manage page content" ON page_content;
DROP POLICY IF EXISTS "Anyone can read active page content" ON page_content;

CREATE POLICY "Anon can read active page content"
  ON page_content FOR SELECT
  TO anon
  USING (is_active = true);

CREATE POLICY "Authenticated can read page content"
  ON page_content FOR SELECT
  TO authenticated
  USING (
    is_active = true
    OR auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

CREATE POLICY "Admins can insert page content"
  ON page_content FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Admins can update page content"
  ON page_content FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'))
  WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Admins can delete page content"
  ON page_content FOR DELETE
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- 8. Fix page_images policies
DROP POLICY IF EXISTS "Admins can manage page images" ON page_images;
DROP POLICY IF EXISTS "Anyone can view active page images" ON page_images;

CREATE POLICY "Anon can view active page images"
  ON page_images FOR SELECT
  TO anon
  USING (is_active = true);

CREATE POLICY "Authenticated can view page images"
  ON page_images FOR SELECT
  TO authenticated
  USING (
    is_active = true
    OR auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

CREATE POLICY "Admins can insert page images"
  ON page_images FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Admins can update page images"
  ON page_images FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'))
  WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Admins can delete page images"
  ON page_images FOR DELETE
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- 9. Fix promotions policies
DROP POLICY IF EXISTS "Admins can manage promotions" ON promotions;
DROP POLICY IF EXISTS "Anyone can view active promotions" ON promotions;

CREATE POLICY "Anon can view active promotions"
  ON promotions FOR SELECT
  TO anon
  USING (is_active = true);

CREATE POLICY "Authenticated can view promotions"
  ON promotions FOR SELECT
  TO authenticated
  USING (
    is_active = true
    OR auth.uid() IN (SELECT id FROM users WHERE role = 'admin')
  );

CREATE POLICY "Admins can insert promotions"
  ON promotions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Admins can update promotions"
  ON promotions FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'))
  WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Admins can delete promotions"
  ON promotions FOR DELETE
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- 10. Fix function search paths
DROP FUNCTION IF EXISTS get_active_excursions();
CREATE FUNCTION get_active_excursions()
RETURNS SETOF excursions
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM excursions WHERE is_active = true ORDER BY display_order, title_fr;
$$;

DROP FUNCTION IF EXISTS get_all_excursions();
CREATE FUNCTION get_all_excursions()
RETURNS SETOF excursions
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM excursions ORDER BY display_order, title_fr;
$$;

GRANT EXECUTE ON FUNCTION get_active_excursions() TO anon;
GRANT EXECUTE ON FUNCTION get_active_excursions() TO authenticated;
GRANT EXECUTE ON FUNCTION get_all_excursions() TO anon;
GRANT EXECUTE ON FUNCTION get_all_excursions() TO authenticated;

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
