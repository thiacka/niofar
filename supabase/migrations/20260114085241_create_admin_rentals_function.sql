/*
  # Create Admin RPC Function for All Rentals
  
  1. Purpose
    - Create RPC function to get all rentals (including inactive)
    - For admin dashboard use
  
  2. Functions
    - get_all_rentals: Get all rentals regardless of active status
*/

-- Function to get all rentals (for admin)
CREATE OR REPLACE FUNCTION get_all_rentals()
RETURNS SETOF rentals
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT * FROM rentals 
  ORDER BY type ASC, display_order ASC, name_fr ASC;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_all_rentals() TO authenticated;

-- Notify schema reload
NOTIFY pgrst, 'reload schema';
