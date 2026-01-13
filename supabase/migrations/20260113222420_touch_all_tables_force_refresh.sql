/*
  # Touch All Tables to Force Schema Refresh
  
  1. Purpose
    - Add comments to all tables to force schema metadata refresh
    - This should trigger PostgREST to rescan the schema
*/

-- Touch all relevant tables with updated comments
COMMENT ON TABLE excursions IS 'Day trips and excursions - updated';
COMMENT ON TABLE rentals IS 'Vehicle and equipment rentals - updated';
COMMENT ON TABLE circuits IS 'Multi-day tour circuits - updated';
COMMENT ON TABLE promotions IS 'Promotional offers and discounts - updated';
COMMENT ON TABLE bookings IS 'Customer bookings and reservations - updated';

-- Update the updated_at on a dummy basis to force change detection
-- (This doesn't change data, just triggers detection)

-- Force extensions reload which can help with schema cache
SELECT pg_reload_conf();

-- Multiple notify attempts
DO $$
BEGIN
  PERFORM pg_notify('pgrst', 'reload schema');
  PERFORM pg_notify('pgrst', 'reload config');
  PERFORM pg_sleep(0.1);
  PERFORM pg_notify('pgrst', 'reload schema');
END $$;
