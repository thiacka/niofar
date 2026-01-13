/*
  # Optimize RLS Policies Performance
  
  1. Performance Optimization
    - Wrap auth.uid() calls in (select auth.uid()) to avoid per-row re-evaluation
    - This change affects all policies across: bookings, circuit_stages, circuits,
      contact_messages, excursions, page_content, page_images, promotions
  
  2. Security Improvements
    - Add proper restrictions to INSERT policies that were always true
    - bookings: Restrict to ensure required fields are provided
    - contact_messages: Restrict to ensure required fields are provided
  
  3. Notes
    - The idx_circuit_stages_excursion_id index is kept for future query optimization
    - Auth DB Connection Strategy must be changed manually in Supabase dashboard
*/

-- =====================
-- BOOKINGS TABLE
-- =====================
DROP POLICY IF EXISTS "Authenticated can view bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can delete bookings" ON bookings;
DROP POLICY IF EXISTS "Authenticated can insert bookings" ON bookings;

CREATE POLICY "Authenticated can view bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    (select auth.uid()) IN (SELECT id FROM users WHERE role = 'admin')
    OR reference_number IS NOT NULL
  );

CREATE POLICY "Admins can update bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) IN (SELECT id FROM users WHERE role = 'admin'))
  WITH CHECK ((select auth.uid()) IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Admins can delete bookings"
  ON bookings FOR DELETE
  TO authenticated
  USING ((select auth.uid()) IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Authenticated can insert bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (
    first_name IS NOT NULL AND
    last_name IS NOT NULL AND
    email IS NOT NULL
  );

-- =====================
-- CIRCUIT_STAGES TABLE
-- =====================
DROP POLICY IF EXISTS "Admins can insert circuit stages" ON circuit_stages;
DROP POLICY IF EXISTS "Admins can update circuit stages" ON circuit_stages;
DROP POLICY IF EXISTS "Admins can delete circuit stages" ON circuit_stages;

CREATE POLICY "Admins can insert circuit stages"
  ON circuit_stages FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Admins can update circuit stages"
  ON circuit_stages FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) IN (SELECT id FROM users WHERE role = 'admin'))
  WITH CHECK ((select auth.uid()) IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Admins can delete circuit stages"
  ON circuit_stages FOR DELETE
  TO authenticated
  USING ((select auth.uid()) IN (SELECT id FROM users WHERE role = 'admin'));

-- =====================
-- CIRCUITS TABLE
-- =====================
DROP POLICY IF EXISTS "Authenticated can view circuits" ON circuits;
DROP POLICY IF EXISTS "Admins can insert circuits" ON circuits;
DROP POLICY IF EXISTS "Admins can update circuits" ON circuits;
DROP POLICY IF EXISTS "Admins can delete circuits" ON circuits;

CREATE POLICY "Authenticated can view circuits"
  ON circuits FOR SELECT
  TO authenticated
  USING (
    is_active = true
    OR (select auth.uid()) IN (SELECT id FROM users WHERE role = 'admin')
  );

CREATE POLICY "Admins can insert circuits"
  ON circuits FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Admins can update circuits"
  ON circuits FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) IN (SELECT id FROM users WHERE role = 'admin'))
  WITH CHECK ((select auth.uid()) IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Admins can delete circuits"
  ON circuits FOR DELETE
  TO authenticated
  USING ((select auth.uid()) IN (SELECT id FROM users WHERE role = 'admin'));

-- =====================
-- CONTACT_MESSAGES TABLE
-- =====================
DROP POLICY IF EXISTS "Admins can view contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Admins can update contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Admins can delete contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Anon can submit contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated can submit contact messages" ON contact_messages;

CREATE POLICY "Admins can view contact messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Admins can update contact messages"
  ON contact_messages FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) IN (SELECT id FROM users WHERE role = 'admin'))
  WITH CHECK ((select auth.uid()) IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Admins can delete contact messages"
  ON contact_messages FOR DELETE
  TO authenticated
  USING ((select auth.uid()) IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Anon can submit contact messages"
  ON contact_messages FOR INSERT
  TO anon
  WITH CHECK (
    name IS NOT NULL AND
    email IS NOT NULL AND
    message IS NOT NULL
  );

CREATE POLICY "Authenticated can submit contact messages"
  ON contact_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    name IS NOT NULL AND
    email IS NOT NULL AND
    message IS NOT NULL
  );

-- =====================
-- EXCURSIONS TABLE
-- =====================
DROP POLICY IF EXISTS "Authenticated can view excursions" ON excursions;
DROP POLICY IF EXISTS "Admins can insert excursions" ON excursions;
DROP POLICY IF EXISTS "Admins can update excursions" ON excursions;
DROP POLICY IF EXISTS "Admins can delete excursions" ON excursions;

CREATE POLICY "Authenticated can view excursions"
  ON excursions FOR SELECT
  TO authenticated
  USING (
    is_active = true
    OR (select auth.uid()) IN (SELECT id FROM users WHERE role = 'admin')
  );

CREATE POLICY "Admins can insert excursions"
  ON excursions FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Admins can update excursions"
  ON excursions FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) IN (SELECT id FROM users WHERE role = 'admin'))
  WITH CHECK ((select auth.uid()) IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Admins can delete excursions"
  ON excursions FOR DELETE
  TO authenticated
  USING ((select auth.uid()) IN (SELECT id FROM users WHERE role = 'admin'));

-- =====================
-- PAGE_CONTENT TABLE
-- =====================
DROP POLICY IF EXISTS "Authenticated can read page content" ON page_content;
DROP POLICY IF EXISTS "Admins can insert page content" ON page_content;
DROP POLICY IF EXISTS "Admins can update page content" ON page_content;
DROP POLICY IF EXISTS "Admins can delete page content" ON page_content;

CREATE POLICY "Authenticated can read page content"
  ON page_content FOR SELECT
  TO authenticated
  USING (
    is_active = true
    OR (select auth.uid()) IN (SELECT id FROM users WHERE role = 'admin')
  );

CREATE POLICY "Admins can insert page content"
  ON page_content FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Admins can update page content"
  ON page_content FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) IN (SELECT id FROM users WHERE role = 'admin'))
  WITH CHECK ((select auth.uid()) IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Admins can delete page content"
  ON page_content FOR DELETE
  TO authenticated
  USING ((select auth.uid()) IN (SELECT id FROM users WHERE role = 'admin'));

-- =====================
-- PAGE_IMAGES TABLE
-- =====================
DROP POLICY IF EXISTS "Authenticated can view page images" ON page_images;
DROP POLICY IF EXISTS "Admins can insert page images" ON page_images;
DROP POLICY IF EXISTS "Admins can update page images" ON page_images;
DROP POLICY IF EXISTS "Admins can delete page images" ON page_images;

CREATE POLICY "Authenticated can view page images"
  ON page_images FOR SELECT
  TO authenticated
  USING (
    is_active = true
    OR (select auth.uid()) IN (SELECT id FROM users WHERE role = 'admin')
  );

CREATE POLICY "Admins can insert page images"
  ON page_images FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Admins can update page images"
  ON page_images FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) IN (SELECT id FROM users WHERE role = 'admin'))
  WITH CHECK ((select auth.uid()) IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Admins can delete page images"
  ON page_images FOR DELETE
  TO authenticated
  USING ((select auth.uid()) IN (SELECT id FROM users WHERE role = 'admin'));

-- =====================
-- PROMOTIONS TABLE
-- =====================
DROP POLICY IF EXISTS "Authenticated can view promotions" ON promotions;
DROP POLICY IF EXISTS "Admins can insert promotions" ON promotions;
DROP POLICY IF EXISTS "Admins can update promotions" ON promotions;
DROP POLICY IF EXISTS "Admins can delete promotions" ON promotions;

CREATE POLICY "Authenticated can view promotions"
  ON promotions FOR SELECT
  TO authenticated
  USING (
    is_active = true
    OR (select auth.uid()) IN (SELECT id FROM users WHERE role = 'admin')
  );

CREATE POLICY "Admins can insert promotions"
  ON promotions FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Admins can update promotions"
  ON promotions FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) IN (SELECT id FROM users WHERE role = 'admin'))
  WITH CHECK ((select auth.uid()) IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Admins can delete promotions"
  ON promotions FOR DELETE
  TO authenticated
  USING ((select auth.uid()) IN (SELECT id FROM users WHERE role = 'admin'));

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
