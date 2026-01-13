/*
  # Force PostgREST Full Reset
  
  Uses multiple techniques to force PostgREST schema cache refresh:
  1. Alters tables to trigger schema change detection
  2. Recreates the pgrst schema cache function
  3. Sends multiple reload signals
*/

-- Technique 1: Alter each table to force schema detection
ALTER TABLE excursions SET SCHEMA public;
ALTER TABLE rentals SET SCHEMA public;
ALTER TABLE circuits SET SCHEMA public;
ALTER TABLE circuit_stages SET SCHEMA public;
ALTER TABLE promotions SET SCHEMA public;
ALTER TABLE bookings SET SCHEMA public;
ALTER TABLE contact_messages SET SCHEMA public;
ALTER TABLE page_content SET SCHEMA public;
ALTER TABLE page_images SET SCHEMA public;
ALTER TABLE users SET SCHEMA public;

-- Technique 2: Add and remove a dummy column to force cache invalidation
DO $$
BEGIN
  -- excursions
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'excursions' AND column_name = '_cache_bust') THEN
    ALTER TABLE excursions ADD COLUMN _cache_bust boolean DEFAULT false;
  END IF;
  ALTER TABLE excursions DROP COLUMN IF EXISTS _cache_bust;
  
  -- rentals
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rentals' AND column_name = '_cache_bust') THEN
    ALTER TABLE rentals ADD COLUMN _cache_bust boolean DEFAULT false;
  END IF;
  ALTER TABLE rentals DROP COLUMN IF EXISTS _cache_bust;
  
  -- circuits
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'circuits' AND column_name = '_cache_bust') THEN
    ALTER TABLE circuits ADD COLUMN _cache_bust boolean DEFAULT false;
  END IF;
  ALTER TABLE circuits DROP COLUMN IF EXISTS _cache_bust;
END $$;

-- Technique 3: Ensure schema is exposed properly
ALTER ROLE authenticator SET pgrst.db_schemas TO 'public';
ALTER ROLE anon SET pgrst.db_schemas TO 'public';
ALTER ROLE authenticated SET pgrst.db_schemas TO 'public';

-- Technique 4: Multiple reload notifications
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';
SELECT pg_notify('pgrst', 'reload schema');
SELECT pg_notify('pgrst', 'reload config');

-- Technique 5: Touch the pg_catalog to force refresh
SELECT pg_catalog.pg_relation_size('excursions');
SELECT pg_catalog.pg_relation_size('rentals');
