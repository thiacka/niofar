/*
  # Force Schema Cache Reload
  
  This migration forces PostgREST to reload its schema cache.
*/

SELECT pg_notify('pgrst', 'reload schema');

COMMENT ON TABLE rentals IS 'Equipment rentals and incentive services';
