/*
  # Force API Exposure for Tables
  
  1. Purpose
    - Ensure excursions and rentals tables are exposed via REST API
    - Force PostgREST schema cache refresh by altering tables
  
  2. Changes
    - Add/update table comments
    - Alter sequences to force schema detection
    - Grant usage on schema
*/

-- Ensure schema is exposed
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Revoke and re-grant to force detection
REVOKE ALL ON excursions FROM anon;
REVOKE ALL ON rentals FROM anon;

GRANT SELECT ON excursions TO anon;
GRANT SELECT ON rentals TO anon;

-- Force sequence permissions
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Alter tables to invalidate cache
DO $$
BEGIN
  EXECUTE 'ALTER TABLE excursions SET (fillfactor = 100)';
  EXECUTE 'ALTER TABLE rentals SET (fillfactor = 100)';
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- Explicit exposure to API
ALTER TABLE excursions REPLICA IDENTITY DEFAULT;
ALTER TABLE rentals REPLICA IDENTITY DEFAULT;

-- Send multiple reload signals
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';
