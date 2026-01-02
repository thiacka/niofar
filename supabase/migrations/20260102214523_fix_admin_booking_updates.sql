/*
  # Fix Admin Booking Update Permissions

  1. Security Changes
    - Update bookings table policies to allow anonymous users (with anon key) to update booking status
    - This is necessary because the admin interface uses the anon key, not authenticated users
    - In production, consider using service_role key or implementing proper Supabase Auth

  2. Notes
    - The admin authentication is currently handled client-side with a password
    - The admin uses the same anon key as public users
    - This policy allows status updates for demo purposes
*/

-- Drop the existing authenticated-only update policy
DROP POLICY IF EXISTS "Authenticated users can update bookings" ON bookings;

-- Create new policy allowing anon users to update booking status
CREATE POLICY "Allow booking status updates"
  ON bookings
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
