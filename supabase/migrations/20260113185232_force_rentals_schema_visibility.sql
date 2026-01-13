/*
  # Force Rentals Table Schema Visibility
  
  Forces PostgREST to recognize the rentals table by altering it.
*/

ALTER TABLE rentals REPLICA IDENTITY DEFAULT;

GRANT SELECT ON rentals TO anon;
GRANT SELECT ON rentals TO authenticated;
GRANT ALL ON rentals TO service_role;

NOTIFY pgrst, 'reload schema';
