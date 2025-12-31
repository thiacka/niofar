/*
  # Add Admin Policies for Circuits and Promotions

  1. Security Changes
    - Add policies for all operations (INSERT, UPDATE, DELETE) on circuits table
    - Add policies for all operations (INSERT, UPDATE, DELETE) on promotions table
    - These policies allow service role access for admin operations
    
  2. Notes
    - Since we use the anon key for the frontend, admin operations go through service role
    - Public read access remains for active circuits/promotions
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Allow all operations for service role on circuits'
  ) THEN
    CREATE POLICY "Allow all operations for service role on circuits"
      ON circuits
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Allow all operations for service role on promotions'
  ) THEN
    CREATE POLICY "Allow all operations for service role on promotions"
      ON promotions
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;
