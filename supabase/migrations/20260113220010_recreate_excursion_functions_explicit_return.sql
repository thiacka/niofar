/*
  # Recreate Excursion Functions with Explicit Return Types
  
  Recreates the RPC functions with explicit return types to force
  PostgREST schema resolution.
*/

-- Drop and recreate get_active_excursions
DROP FUNCTION IF EXISTS get_active_excursions();
CREATE OR REPLACE FUNCTION get_active_excursions()
RETURNS SETOF excursions
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT * FROM excursions WHERE is_active = true ORDER BY display_order, title_fr;
$$;

-- Drop and recreate get_all_excursions
DROP FUNCTION IF EXISTS get_all_excursions();
CREATE OR REPLACE FUNCTION get_all_excursions()
RETURNS SETOF excursions
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT * FROM excursions ORDER BY display_order, title_fr;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_active_excursions() TO anon;
GRANT EXECUTE ON FUNCTION get_active_excursions() TO authenticated;
GRANT EXECUTE ON FUNCTION get_all_excursions() TO anon;
GRANT EXECUTE ON FUNCTION get_all_excursions() TO authenticated;

-- Notify PostgREST
NOTIFY pgrst, 'reload schema';
