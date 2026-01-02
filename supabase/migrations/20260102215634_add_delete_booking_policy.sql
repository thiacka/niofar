/*
  # Add Delete Booking Policy for Admin

  1. Security Changes
    - Add policy to allow anonymous users (admin with anon key) to delete bookings
    - This enables the admin panel to delete bookings when needed
    
  2. Notes
    - Admin authentication is currently handled client-side
    - In production, consider using service_role key or Supabase Auth
*/

CREATE POLICY "Allow booking deletions"
  ON bookings
  FOR DELETE
  TO anon, authenticated
  USING (true);
