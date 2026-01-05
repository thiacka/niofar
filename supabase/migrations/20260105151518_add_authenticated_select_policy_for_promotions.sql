/*
  # Add SELECT policy for authenticated users on promotions table

  1. Security Changes
    - Add SELECT policy for authenticated users to view all promotions
    - This allows admin users to see all promotions (active, inactive, expired)
    - Public users can still only view active promotions through existing policy
  
  2. Notes
    - Without this policy, authenticated users could create promotions but not see them in the admin panel
    - This fixes the issue where promotion creation appeared to fail silently
*/

CREATE POLICY "Authenticated users can view all promotions"
  ON promotions
  FOR SELECT
  TO authenticated
  USING (true);
