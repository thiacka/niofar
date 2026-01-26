/*
  # Force page_content table visibility in PostgREST schema cache

  1. Changes
    - Add comment to page_content table to force schema cache reload
    - Notify PostgREST to reload schema
    - Ensure anon role can access the table

  2. Notes
    - This migration forces PostgREST to discover the page_content table
    - The table already exists but was not visible in the schema cache
*/

COMMENT ON TABLE page_content IS 'Static page content for multilingual support - updated for schema visibility';

GRANT SELECT ON page_content TO anon;
GRANT SELECT ON page_content TO authenticated;
GRANT INSERT, UPDATE, DELETE ON page_content TO authenticated;

NOTIFY pgrst, 'reload schema';