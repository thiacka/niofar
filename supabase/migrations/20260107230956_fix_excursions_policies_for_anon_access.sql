/*
  # Fix Excursions Table Policies for Anonymous Access

  1. Changes
    - Drop existing restrictive policies that require authentication
    - Add new policies allowing anonymous (anon) role access for CRUD operations
    - This enables the admin panel to work without authentication
  
  2. Security Notes
    - This is a temporary solution for development
    - In production, proper authentication should be implemented
    - Consider implementing role-based access control
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can view all excursions" ON excursions;
DROP POLICY IF EXISTS "Authenticated users can insert excursions" ON excursions;
DROP POLICY IF EXISTS "Authenticated users can update excursions" ON excursions;
DROP POLICY IF EXISTS "Authenticated users can delete excursions" ON excursions;

-- Create new policies allowing anon role access
CREATE POLICY "Anyone can view all excursions"
  ON excursions
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert excursions"
  ON excursions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update excursions"
  ON excursions
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete excursions"
  ON excursions
  FOR DELETE
  USING (true);
