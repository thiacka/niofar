/*
  # Create circuit_attachments table and storage bucket

  1. New Tables
    - `circuit_attachments`
      - `id` (uuid, primary key)
      - `circuit_id` (uuid, foreign key to circuits)
      - `file_name` (text) - original file name
      - `file_url` (text) - public URL in storage
      - `file_type` (text) - MIME type (application/pdf, image/jpeg, etc.)
      - `file_size` (integer) - size in bytes
      - `display_order` (integer, default 0)
      - `created_at` (timestamptz)

  2. Constraints
    - Maximum 3 attachments per circuit enforced via trigger
    - Foreign key to circuits with cascade delete

  3. Security
    - RLS enabled on circuit_attachments
    - Authenticated users can read attachments
    - Authenticated users can insert/update/delete attachments

  4. Storage
    - Creates 'circuit-attachments' bucket for file storage
*/

-- Create the circuit_attachments table
CREATE TABLE IF NOT EXISTS circuit_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  circuit_id uuid NOT NULL REFERENCES circuits(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL DEFAULT '',
  file_size integer NOT NULL DEFAULT 0,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE circuit_attachments ENABLE ROW LEVEL SECURITY;

-- Policies: authenticated users can manage attachments
CREATE POLICY "Authenticated users can read circuit attachments"
  ON circuit_attachments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert circuit attachments"
  ON circuit_attachments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT count(*) FROM circuit_attachments ca WHERE ca.circuit_id = circuit_attachments.circuit_id) < 3
  );

CREATE POLICY "Authenticated users can update circuit attachments"
  ON circuit_attachments
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete circuit attachments"
  ON circuit_attachments
  FOR DELETE
  TO authenticated
  USING (true);

-- Public read policy for anonymous users viewing circuit details
CREATE POLICY "Anyone can view circuit attachments"
  ON circuit_attachments
  FOR SELECT
  TO anon
  USING (true);

-- Create index on circuit_id for efficient lookups
CREATE INDEX IF NOT EXISTS idx_circuit_attachments_circuit_id
  ON circuit_attachments(circuit_id);

-- Create the storage bucket for circuit attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('circuit-attachments', 'circuit-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: allow authenticated uploads and public reads
CREATE POLICY "Authenticated users can upload circuit attachments"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'circuit-attachments');

CREATE POLICY "Anyone can read circuit attachments files"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'circuit-attachments');

CREATE POLICY "Authenticated users can delete circuit attachment files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'circuit-attachments');
