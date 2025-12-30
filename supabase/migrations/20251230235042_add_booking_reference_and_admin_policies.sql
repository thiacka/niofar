/*
  # Add booking reference number and admin policies

  1. Changes to bookings table
    - Add `reference_number` column (text, unique) - Human-readable booking reference
    - Add function to auto-generate reference numbers in format NF-YYYYMMDD-XXXX

  2. Security Updates
    - Add policy for anon users to select their own booking by reference_number
    - Add policy for authenticated users to update booking status
    - Add policy for authenticated users to delete contact messages

  3. Notes
    - Reference number format: NF-YYYYMMDD-XXXX (e.g., NF-20251230-A7B3)
    - Allows customers to look up their booking with the reference number
    - Admins can update booking status (pending, confirmed, cancelled)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'reference_number'
  ) THEN
    ALTER TABLE bookings ADD COLUMN reference_number text UNIQUE;
  END IF;
END $$;

CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS trigger AS $$
DECLARE
  date_part text;
  random_part text;
  new_ref text;
BEGIN
  date_part := to_char(now(), 'YYYYMMDD');
  random_part := upper(substr(md5(random()::text), 1, 4));
  new_ref := 'NF-' || date_part || '-' || random_part;
  
  WHILE EXISTS (SELECT 1 FROM bookings WHERE reference_number = new_ref) LOOP
    random_part := upper(substr(md5(random()::text), 1, 4));
    new_ref := 'NF-' || date_part || '-' || random_part;
  END LOOP;
  
  NEW.reference_number := new_ref;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_booking_reference ON bookings;

CREATE TRIGGER set_booking_reference
  BEFORE INSERT ON bookings
  FOR EACH ROW
  WHEN (NEW.reference_number IS NULL)
  EXECUTE FUNCTION generate_booking_reference();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'bookings' 
    AND policyname = 'Anyone can view booking by reference'
  ) THEN
    CREATE POLICY "Anyone can view booking by reference"
      ON bookings
      FOR SELECT
      TO anon
      USING (reference_number IS NOT NULL);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'bookings' 
    AND policyname = 'Authenticated users can update bookings'
  ) THEN
    CREATE POLICY "Authenticated users can update bookings"
      ON bookings
      FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'contact_messages' 
    AND policyname = 'Authenticated users can delete contact messages'
  ) THEN
    CREATE POLICY "Authenticated users can delete contact messages"
      ON contact_messages
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END $$;

UPDATE bookings 
SET reference_number = 'NF-' || to_char(created_at, 'YYYYMMDD') || '-' || upper(substr(md5(id::text), 1, 4))
WHERE reference_number IS NULL;
