/*
  # Force PostgREST Schema Cache Refresh
  
  This migration forces PostgREST to reload its schema cache by:
  1. Adding a comment to the excursions table
  2. Sending a schema reload notification
*/

COMMENT ON TABLE excursions IS 'Excursions and activities available for booking';

NOTIFY pgrst, 'reload schema';