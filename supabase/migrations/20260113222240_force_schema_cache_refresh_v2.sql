/*
  # Force PostgREST Schema Cache Refresh
  
  1. Purpose
    - Force PostgREST to reload schema cache
    - Ensure excursions and rentals tables are visible
  
  2. Method
    - Grant explicit permissions on tables
    - Add comments to force detection
    - Send reload notification
*/

-- Ensure proper grants for anon and authenticated roles
GRANT SELECT ON excursions TO anon;
GRANT SELECT ON excursions TO authenticated;
GRANT ALL ON excursions TO authenticated;

GRANT SELECT ON rentals TO anon;
GRANT SELECT ON rentals TO authenticated;
GRANT ALL ON rentals TO authenticated;

-- Add table comments to force schema detection
COMMENT ON TABLE excursions IS 'Excursions and day trips';
COMMENT ON TABLE rentals IS 'Vehicle and equipment rentals';

-- Force PostgREST to reload
NOTIFY pgrst, 'reload schema';
