/*
  # Force PostgREST Cache Reload for Excursions
  
  Forces PostgREST to reload its schema cache by performing a DDL operation.
  Also grants explicit permissions and drops the temporary view.
*/

-- Drop the temporary view
DROP VIEW IF EXISTS excursions_view;

-- Add a comment to force schema reload
COMMENT ON TABLE excursions IS 'Excursions and activities available for booking - Updated 2026-01-11';

-- Ensure proper grants
GRANT SELECT, INSERT, UPDATE, DELETE ON excursions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON excursions TO authenticated;