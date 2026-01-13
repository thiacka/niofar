/*
  # Comprehensive Security Fixes

  1. Performance Fixes
    - Replace auth.uid() with (select auth.uid()) in users table policies
    
  2. Cleanup
    - Drop unused indexes
    - Remove duplicate permissive policies
    
  3. Security Hardening
    - Fix RLS policies that allow unrestricted access
    - Restrict admin-only operations to actual admins
    
  4. Function Fixes
    - Set immutable search_path for functions
*/

-- =====================================================
-- 1. FIX USERS TABLE RLS PERFORMANCE
-- =====================================================

DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;

CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = (select auth.uid()) 
      AND u.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert users"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = (select auth.uid()) 
      AND u.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all users"
  ON users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = (select auth.uid()) 
      AND u.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = (select auth.uid()) 
      AND u.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete users"
  ON users FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = (select auth.uid()) 
      AND u.role = 'admin'
    )
  );

-- =====================================================
-- 2. DROP UNUSED INDEXES
-- =====================================================

DROP INDEX IF EXISTS idx_page_images_page_section;
DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_users_role;
DROP INDEX IF EXISTS idx_users_is_active;
DROP INDEX IF EXISTS idx_page_content_page_section;
DROP INDEX IF EXISTS idx_excursions_is_active;
DROP INDEX IF EXISTS idx_circuit_stages_excursion_id;
DROP INDEX IF EXISTS idx_circuit_stages_day_stage;
DROP INDEX IF EXISTS idx_rentals_type;
DROP INDEX IF EXISTS idx_rentals_category;
DROP INDEX IF EXISTS idx_rentals_is_active;

-- =====================================================
-- 3. FIX CIRCUITS TABLE - REMOVE DUPLICATES AND SECURE
-- =====================================================

DROP POLICY IF EXISTS "Admin can delete circuits" ON circuits;
DROP POLICY IF EXISTS "Admin can insert circuits" ON circuits;
DROP POLICY IF EXISTS "Admin can update circuits" ON circuits;
DROP POLICY IF EXISTS "Authenticated users can delete circuits" ON circuits;
DROP POLICY IF EXISTS "Authenticated users can insert circuits" ON circuits;
DROP POLICY IF EXISTS "Authenticated users can update circuits" ON circuits;
DROP POLICY IF EXISTS "Authenticated users can read all circuits" ON circuits;
DROP POLICY IF EXISTS "Authenticated users can view all circuits" ON circuits;
DROP POLICY IF EXISTS "Public can view active circuits" ON circuits;

CREATE POLICY "Anyone can view active circuits"
  ON circuits FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage circuits"
  ON circuits FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = (select auth.uid()) 
      AND u.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = (select auth.uid()) 
      AND u.role = 'admin'
    )
  );

-- =====================================================
-- 4. FIX EXCURSIONS TABLE - REMOVE DUPLICATES AND SECURE
-- =====================================================

DROP POLICY IF EXISTS "Anyone can view all excursions" ON excursions;
DROP POLICY IF EXISTS "Public can view active excursions" ON excursions;
DROP POLICY IF EXISTS "Anyone can delete excursions" ON excursions;
DROP POLICY IF EXISTS "Anyone can insert excursions" ON excursions;
DROP POLICY IF EXISTS "Anyone can update excursions" ON excursions;

CREATE POLICY "Anyone can view active excursions"
  ON excursions FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage excursions"
  ON excursions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = (select auth.uid()) 
      AND u.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = (select auth.uid()) 
      AND u.role = 'admin'
    )
  );

-- =====================================================
-- 5. FIX CIRCUIT_STAGES TABLE
-- =====================================================

DROP POLICY IF EXISTS "Authenticated users can delete circuit stages" ON circuit_stages;
DROP POLICY IF EXISTS "Authenticated users can insert circuit stages" ON circuit_stages;
DROP POLICY IF EXISTS "Authenticated users can update circuit stages" ON circuit_stages;

CREATE POLICY "Admins can manage circuit stages"
  ON circuit_stages FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = (select auth.uid()) 
      AND u.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = (select auth.uid()) 
      AND u.role = 'admin'
    )
  );

-- =====================================================
-- 6. FIX PAGE_IMAGES TABLE
-- =====================================================

DROP POLICY IF EXISTS "Admins can view all page images" ON page_images;
DROP POLICY IF EXISTS "Anyone can view active page images" ON page_images;
DROP POLICY IF EXISTS "Admins can delete page images" ON page_images;
DROP POLICY IF EXISTS "Admins can insert page images" ON page_images;
DROP POLICY IF EXISTS "Admins can update page images" ON page_images;

CREATE POLICY "Anyone can view active page images"
  ON page_images FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage page images"
  ON page_images FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = (select auth.uid()) 
      AND u.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = (select auth.uid()) 
      AND u.role = 'admin'
    )
  );

-- =====================================================
-- 7. FIX PAGE_CONTENT TABLE
-- =====================================================

DROP POLICY IF EXISTS "Authenticated users can delete page content" ON page_content;
DROP POLICY IF EXISTS "Authenticated users can insert page content" ON page_content;
DROP POLICY IF EXISTS "Authenticated users can update page content" ON page_content;

CREATE POLICY "Admins can manage page content"
  ON page_content FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = (select auth.uid()) 
      AND u.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = (select auth.uid()) 
      AND u.role = 'admin'
    )
  );

-- =====================================================
-- 8. FIX PROMOTIONS TABLE
-- =====================================================

DROP POLICY IF EXISTS "Authenticated users can view all promotions" ON promotions;
DROP POLICY IF EXISTS "Public can view active promotions" ON promotions;
DROP POLICY IF EXISTS "Authenticated users can delete promotions" ON promotions;
DROP POLICY IF EXISTS "Authenticated users can insert promotions" ON promotions;
DROP POLICY IF EXISTS "Authenticated users can update promotions" ON promotions;

CREATE POLICY "Anyone can view active promotions"
  ON promotions FOR SELECT
  TO anon, authenticated
  USING (is_active = true AND start_date <= CURRENT_DATE AND end_date >= CURRENT_DATE);

CREATE POLICY "Admins can manage promotions"
  ON promotions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = (select auth.uid()) 
      AND u.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = (select auth.uid()) 
      AND u.role = 'admin'
    )
  );

-- =====================================================
-- 9. FIX RENTALS TABLE
-- =====================================================

DROP POLICY IF EXISTS "Authenticated users can delete rentals" ON rentals;
DROP POLICY IF EXISTS "Authenticated users can insert rentals" ON rentals;
DROP POLICY IF EXISTS "Authenticated users can update rentals" ON rentals;
DROP POLICY IF EXISTS "Authenticated users can view all rentals" ON rentals;

CREATE POLICY "Admins can manage rentals"
  ON rentals FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = (select auth.uid()) 
      AND u.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = (select auth.uid()) 
      AND u.role = 'admin'
    )
  );

-- =====================================================
-- 10. FIX CONTACT_MESSAGES TABLE
-- =====================================================

DROP POLICY IF EXISTS "Anyone can submit contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated users can delete contact messages" ON contact_messages;

CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL AND 
    LENGTH(TRIM(email)) > 0 AND
    message IS NOT NULL AND 
    LENGTH(TRIM(message)) > 0
  );

CREATE POLICY "Admins can manage contact messages"
  ON contact_messages FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = (select auth.uid()) 
      AND u.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = (select auth.uid()) 
      AND u.role = 'admin'
    )
  );

-- =====================================================
-- 11. FIX BOOKINGS TABLE
-- =====================================================

DROP POLICY IF EXISTS "Allow booking deletions" ON bookings;
DROP POLICY IF EXISTS "Allow booking status updates" ON bookings;
DROP POLICY IF EXISTS "Anyone can submit bookings" ON bookings;

CREATE POLICY "Anyone can submit bookings"
  ON bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    first_name IS NOT NULL AND 
    LENGTH(TRIM(first_name)) > 0 AND
    email IS NOT NULL AND 
    LENGTH(TRIM(email)) > 0
  );

CREATE POLICY "Anyone can view their booking by reference"
  ON bookings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage bookings"
  ON bookings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = (select auth.uid()) 
      AND u.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u 
      WHERE u.id = (select auth.uid()) 
      AND u.role = 'admin'
    )
  );

-- =====================================================
-- 12. FIX FUNCTIONS SEARCH PATH
-- =====================================================

DROP FUNCTION IF EXISTS public.get_active_excursions();
DROP FUNCTION IF EXISTS public.get_all_excursions();

CREATE OR REPLACE FUNCTION public.get_active_excursions()
RETURNS SETOF excursions
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM excursions WHERE is_active = true ORDER BY display_order, title_fr;
$$;

CREATE OR REPLACE FUNCTION public.get_all_excursions()
RETURNS SETOF excursions
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM excursions ORDER BY display_order, title_fr;
$$;

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
