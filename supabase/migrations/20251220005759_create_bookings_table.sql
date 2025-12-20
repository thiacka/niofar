/*
  # Create bookings table

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key) - Unique identifier for each booking
      - `circuit_id` (text, not null) - ID of the circuit being booked
      - `circuit_title` (text, not null) - Title of the circuit for reference
      - `first_name` (text, not null) - Customer's first name
      - `last_name` (text, not null) - Customer's last name
      - `email` (text, not null) - Customer's email address
      - `phone` (text) - Customer's phone number (optional)
      - `country` (text, not null) - Customer's country
      - `start_date` (date, not null) - Desired start date of the trip
      - `end_date` (date) - Desired end date of the trip (optional)
      - `adults` (integer, not null) - Number of adult travelers
      - `children` (integer) - Number of children (default 0)
      - `special_requests` (text) - Special requests or notes
      - `estimated_total` (integer) - Estimated total price in FCFA
      - `status` (text) - Booking status (pending, confirmed, cancelled)
      - `created_at` (timestamptz) - Timestamp when booking was created

  2. Security
    - Enable RLS on `bookings` table
    - Add policy for public insert (anyone can submit a booking)
    - Add policy for authenticated users to read bookings (admin access)

  3. Notes
    - This table stores tour booking requests from the website
    - Public users can submit bookings but cannot read existing ones
    - Only authenticated users (admins) can view submitted bookings
*/

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  circuit_id text NOT NULL,
  circuit_title text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  country text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  adults integer NOT NULL DEFAULT 1,
  children integer DEFAULT 0,
  special_requests text,
  estimated_total integer,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit bookings"
  ON bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (true);
