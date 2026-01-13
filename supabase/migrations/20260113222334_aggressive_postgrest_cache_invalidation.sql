/*
  # Aggressive PostgREST Cache Invalidation
  
  1. Purpose
    - Force PostgREST to recognize excursions and rentals tables
    - Use pg_notify with multiple reload signals
  
  2. Method
    - Modify table structure temporarily
    - Use event trigger pattern
    - Multiple notify calls
*/

-- Temporarily add and remove a column to invalidate cache for excursions
ALTER TABLE excursions ADD COLUMN IF NOT EXISTS _cache_buster INTEGER;
ALTER TABLE excursions DROP COLUMN IF EXISTS _cache_buster;

-- Temporarily add and remove a column to invalidate cache for rentals
ALTER TABLE rentals ADD COLUMN IF NOT EXISTS _cache_buster INTEGER;
ALTER TABLE rentals DROP COLUMN IF EXISTS _cache_buster;

-- Ensure all table grants are in place
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  LOOP
    EXECUTE format('GRANT SELECT ON public.%I TO anon', t);
    EXECUTE format('GRANT ALL ON public.%I TO authenticated', t);
  END LOOP;
END $$;

-- Multiple reload signals
SELECT pg_notify('pgrst', 'reload schema');
SELECT pg_notify('pgrst', 'reload config');

NOTIFY pgrst, 'reload schema';
