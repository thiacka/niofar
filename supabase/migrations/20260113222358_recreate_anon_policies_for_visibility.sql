/*
  # Recreate Anon Policies for API Visibility
  
  1. Purpose
    - Drop and recreate anon SELECT policies to force API discovery
    - Ensure tables are visible to anonymous users for public content
  
  2. Changes
    - Recreate "Anon can view active excursions" policy
    - Create "Anon can view active rentals" policy
*/

-- Drop existing anon policies
DROP POLICY IF EXISTS "Anon can view active excursions" ON excursions;
DROP POLICY IF EXISTS "Anon can view active rentals" ON rentals;

-- Recreate excursions anon policy
CREATE POLICY "Anon can view active excursions"
  ON excursions FOR SELECT
  TO anon
  USING (is_active = true);

-- Create rentals anon policy
CREATE POLICY "Anon can view active rentals"
  ON rentals FOR SELECT
  TO anon
  USING (is_active = true);

-- Force schema reload
NOTIFY pgrst, 'reload schema';
