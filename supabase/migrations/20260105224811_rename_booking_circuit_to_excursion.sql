/*
  # Rename Booking Circuit References to Excursion

  1. Changes
    - Rename circuit_id to excursion_id in bookings table
    - Rename circuit_title to excursion_title in bookings table
  
  2. Notes
    - Since circuits data was moved to excursions, bookings should reference excursions
    - This maintains referential integrity
*/

DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'circuit_id'
  ) THEN
    ALTER TABLE bookings RENAME COLUMN circuit_id TO excursion_id;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'circuit_title'
  ) THEN
    ALTER TABLE bookings RENAME COLUMN circuit_title TO excursion_title;
  END IF;
END $$;
