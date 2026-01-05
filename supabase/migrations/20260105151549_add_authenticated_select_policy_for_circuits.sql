/*
  # Add SELECT policy for authenticated users on circuits table

  1. Security Changes
    - Add SELECT policy for authenticated users to view all circuits
    - This allows admin users to see all circuits (active and inactive)
    - Public users can still only view active circuits through existing policy
  
  2. Notes
    - Without this policy, authenticated users could create circuits but not see them in the admin panel
    - This fixes the issue where circuit creation and editing appeared to fail silently
*/

CREATE POLICY "Authenticated users can view all circuits"
  ON circuits
  FOR SELECT
  TO authenticated
  USING (true);
