/*
  # Force PostgREST to Discover Excursions Table
  
  This migration forces PostgREST to discover the excursions table by:
  1. Renaming the table temporarily
  2. Renaming it back to its original name
  3. This forces PostgREST to reload the schema and discover the table
*/

-- Temporarily rename the table
ALTER TABLE IF EXISTS excursions RENAME TO excursions_backup;

-- Rename it back
ALTER TABLE IF EXISTS excursions_backup RENAME TO excursions;

-- Add table comment to ensure cache refresh
COMMENT ON TABLE excursions IS 'Excursions and activities available for booking';

-- Ensure all necessary grants are in place
GRANT ALL ON excursions TO anon;
GRANT ALL ON excursions TO authenticated;
GRANT ALL ON excursions TO service_role;

-- Send reload notification
NOTIFY pgrst, 'reload schema';