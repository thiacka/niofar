/*
  # Aggressive Cache Reload - Alter Excursions Table
  
  Forces PostgREST to reload its schema cache by performing a significant DDL operation.
  This adds and immediately removes a temporary column to trigger a schema reload.
*/

-- Add a temporary column (forces DDL change)
ALTER TABLE excursions ADD COLUMN IF NOT EXISTS _cache_reload_temp text DEFAULT NULL;

-- Remove the temporary column immediately
ALTER TABLE excursions DROP COLUMN IF EXISTS _cache_reload_temp;

-- Revoke and regrant all permissions to force permission cache reload
REVOKE ALL ON excursions FROM anon;
REVOKE ALL ON excursions FROM authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON excursions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON excursions TO authenticated;

-- Update table comment
COMMENT ON TABLE excursions IS 'Excursions and activities - Schema reloaded 2026-01-11 19:06';

-- Send explicit reload notification
NOTIFY pgrst, 'reload schema';