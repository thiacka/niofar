/*
  # Comprehensive Schema Cache Fix
  
  Forces PostgREST to reload its schema cache for all tables.
  
  1. Re-grants permissions to ensure visibility
  2. Adds comments to trigger schema changes
  3. Sends reload notification
*/

-- Re-grant permissions on excursions
GRANT SELECT ON excursions TO anon;
GRANT SELECT ON excursions TO authenticated;
GRANT ALL ON excursions TO service_role;

-- Re-grant permissions on rentals
GRANT SELECT ON rentals TO anon;
GRANT SELECT ON rentals TO authenticated;
GRANT ALL ON rentals TO service_role;

-- Re-grant permissions on circuits
GRANT SELECT ON circuits TO anon;
GRANT SELECT ON circuits TO authenticated;
GRANT ALL ON circuits TO service_role;

-- Re-grant permissions on circuit_stages
GRANT SELECT ON circuit_stages TO anon;
GRANT SELECT ON circuit_stages TO authenticated;
GRANT ALL ON circuit_stages TO service_role;

-- Update table comments to force schema change detection
COMMENT ON TABLE excursions IS 'Excursions and activities - updated for schema visibility';
COMMENT ON TABLE rentals IS 'Vehicle rentals and incentive services - updated for schema visibility';
COMMENT ON TABLE circuits IS 'Multi-day circuit packages - updated for schema visibility';
COMMENT ON TABLE circuit_stages IS 'Circuit stages/stops - updated for schema visibility';

-- Force PostgREST reload
SELECT pg_notify('pgrst', 'reload schema');
SELECT pg_notify('pgrst', 'reload config');
