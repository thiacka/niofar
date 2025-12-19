/*
  # Create contact_messages table

  1. New Tables
    - `contact_messages`
      - `id` (uuid, primary key) - Unique identifier for each message
      - `name` (text, not null) - Name of the person sending the message
      - `email` (text, not null) - Email address of the sender
      - `country` (text, not null) - Country of origin of the sender
      - `message` (text, not null) - The message content
      - `created_at` (timestamptz) - Timestamp when the message was created

  2. Security
    - Enable RLS on `contact_messages` table
    - Add policy for public insert (anyone can submit a contact form)
    - Add policy for authenticated users to read messages (admin access)

  3. Notes
    - This table stores contact form submissions from the website
    - Public users can insert new messages but cannot read existing ones
    - Only authenticated users (admins) can view submitted messages
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  country text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read contact messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);
