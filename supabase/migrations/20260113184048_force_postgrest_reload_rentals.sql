/*
  # Force PostgREST Schema Cache Reload for Rentals Table

  This migration forces PostgREST to reload its schema cache
  to detect the new rentals table.

  1. Changes
    - Sends NOTIFY to pgrst_ddl_watch channel
    - Adds a comment to the rentals table to trigger cache refresh
*/

NOTIFY pgrst, 'reload schema';

COMMENT ON TABLE rentals IS 'Rentals table for vehicles, incentives and boats';
