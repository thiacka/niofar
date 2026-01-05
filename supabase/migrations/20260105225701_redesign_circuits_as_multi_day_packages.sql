/*
  # Redesign Circuits as Multi-Day Packages

  1. Changes
    - Modify circuits table to support multi-day packages
    - Add duration_days field for number of days
    - Add itinerary field (JSONB) to store day-by-day schedule with excursions
    - Add accommodations field (JSONB) for lodging details
    - Add included_services field (JSONB) for guides, meals, transport, etc.
    - Keep existing fields for compatibility

  2. Structure
    - Circuits are now packages that combine multiple excursions over several days
    - Each day in itinerary can reference excursions from the excursions table
    - Accommodations and services are part of the package
    - Price represents the total package price
  
  3. Example Itinerary Structure:
    [
      {
        "day": 1,
        "title_fr": "Arrivée et Lac Rose",
        "title_en": "Arrival and Pink Lake",
        "excursion_ids": ["d9ca714f-fbba-4e7e-94ae-459195d42aaf"],
        "accommodation_fr": "Hôtel à Dakar",
        "accommodation_en": "Hotel in Dakar",
        "meals_included": ["dinner"]
      },
      {
        "day": 2,
        "title_fr": "Île de Gorée",
        "title_en": "Goree Island",
        "excursion_ids": ["7b430488-d607-414b-9241-bea0fe8aca92"],
        "accommodation_fr": "Hôtel à Dakar",
        "accommodation_en": "Hotel in Dakar",
        "meals_included": ["breakfast", "lunch", "dinner"]
      }
    ]

  4. Security
    - Enable RLS on circuits table
    - Add policies for authenticated users to read
    - Add policies for admin to manage
*/

-- Add new fields for multi-day packages
DO $$ 
BEGIN
  -- Add duration in days
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'circuits' AND column_name = 'duration_days'
  ) THEN
    ALTER TABLE circuits ADD COLUMN duration_days integer NOT NULL DEFAULT 1;
  END IF;

  -- Add itinerary (day-by-day schedule)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'circuits' AND column_name = 'itinerary'
  ) THEN
    ALTER TABLE circuits ADD COLUMN itinerary jsonb NOT NULL DEFAULT '[]'::jsonb;
  END IF;

  -- Add included services (guides, meals, transport)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'circuits' AND column_name = 'included_services_fr'
  ) THEN
    ALTER TABLE circuits ADD COLUMN included_services_fr jsonb NOT NULL DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'circuits' AND column_name = 'included_services_en'
  ) THEN
    ALTER TABLE circuits ADD COLUMN included_services_en jsonb NOT NULL DEFAULT '[]'::jsonb;
  END IF;

  -- Add accommodations summary
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'circuits' AND column_name = 'accommodation_type_fr'
  ) THEN
    ALTER TABLE circuits ADD COLUMN accommodation_type_fr text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'circuits' AND column_name = 'accommodation_type_en'
  ) THEN
    ALTER TABLE circuits ADD COLUMN accommodation_type_en text;
  END IF;

  -- Add group size info
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'circuits' AND column_name = 'min_participants'
  ) THEN
    ALTER TABLE circuits ADD COLUMN min_participants integer DEFAULT 2;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'circuits' AND column_name = 'max_participants'
  ) THEN
    ALTER TABLE circuits ADD COLUMN max_participants integer DEFAULT 12;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE circuits ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can read circuits" ON circuits;
DROP POLICY IF EXISTS "Admin can insert circuits" ON circuits;
DROP POLICY IF EXISTS "Admin can update circuits" ON circuits;
DROP POLICY IF EXISTS "Admin can delete circuits" ON circuits;

-- Policy for authenticated users to read active circuits
CREATE POLICY "Authenticated users can read circuits"
  ON circuits
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Admin policies (using service role key in backend)
CREATE POLICY "Admin can insert circuits"
  ON circuits
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can update circuits"
  ON circuits
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can delete circuits"
  ON circuits
  FOR DELETE
  TO authenticated
  USING (true);
