-- Make circuit_id and circuit_title nullable in bookings table
-- since the application now primarily uses excursion_id / excursion_title

ALTER TABLE bookings
  ALTER COLUMN circuit_id DROP NOT NULL,
  ALTER COLUMN circuit_title DROP NOT NULL;
