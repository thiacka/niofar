/*
  # Fix Circuits Admin Read Policy
  
  1. Changes
    - Allow authenticated users to read ALL circuits (active and inactive)
    - This enables admin interface to display all circuits for management
  
  2. Security
    - Only authenticated users can read all circuits
    - Public users (anon) still cannot access circuits directly
    - Admin interface requires authentication
*/

-- Drop existing read policy
DROP POLICY IF EXISTS "Authenticated users can read circuits" ON circuits;

-- Create new policy allowing authenticated users to read all circuits
CREATE POLICY "Authenticated users can read all circuits"
  ON circuits
  FOR SELECT
  TO authenticated
  USING (true);