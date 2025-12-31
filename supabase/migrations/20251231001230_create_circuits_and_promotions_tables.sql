/*
  # Create Circuits and Promotions Tables

  1. New Tables
    - `circuits`
      - `id` (uuid, primary key)
      - `slug` (text, unique) - URL-friendly identifier
      - `image_url` (text) - Main image URL
      - `duration_en` (text) - Duration in English
      - `duration_fr` (text) - Duration in French
      - `title_en` (text) - Title in English
      - `title_fr` (text) - Title in French
      - `description_en` (text) - Description in English
      - `description_fr` (text) - Description in French
      - `highlights_en` (text[]) - Highlights array in English
      - `highlights_fr` (text[]) - Highlights array in French
      - `price` (integer) - Base price in FCFA
      - `price_note_en` (text) - Price note in English
      - `price_note_fr` (text) - Price note in French
      - `is_active` (boolean) - Whether circuit is visible
      - `display_order` (integer) - Order for display
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `promotions`
      - `id` (uuid, primary key)
      - `circuit_id` (uuid, foreign key) - Optional link to specific circuit
      - `code` (text, unique) - Promo code
      - `name_en` (text) - Promo name in English
      - `name_fr` (text) - Promo name in French
      - `description_en` (text) - Description in English
      - `description_fr` (text) - Description in French
      - `discount_type` (text) - 'percentage' or 'fixed'
      - `discount_value` (integer) - Amount or percentage
      - `min_travelers` (integer) - Minimum travelers required
      - `start_date` (date) - Promotion start date
      - `end_date` (date) - Promotion end date
      - `is_active` (boolean) - Whether promo is active
      - `usage_limit` (integer) - Maximum number of uses
      - `usage_count` (integer) - Current usage count
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Public read access for active circuits and promotions
    - Admin-only write access (via service role)
*/

CREATE TABLE IF NOT EXISTS circuits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  image_url text NOT NULL DEFAULT '',
  duration_en text NOT NULL DEFAULT '',
  duration_fr text NOT NULL DEFAULT '',
  title_en text NOT NULL DEFAULT '',
  title_fr text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '',
  description_fr text NOT NULL DEFAULT '',
  highlights_en text[] NOT NULL DEFAULT '{}',
  highlights_fr text[] NOT NULL DEFAULT '{}',
  price integer NOT NULL DEFAULT 0,
  price_note_en text NOT NULL DEFAULT 'per person',
  price_note_fr text NOT NULL DEFAULT 'par personne',
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  circuit_id uuid REFERENCES circuits(id) ON DELETE SET NULL,
  code text UNIQUE NOT NULL,
  name_en text NOT NULL DEFAULT '',
  name_fr text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '',
  description_fr text NOT NULL DEFAULT '',
  discount_type text NOT NULL DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value integer NOT NULL DEFAULT 0,
  min_travelers integer NOT NULL DEFAULT 1,
  start_date date,
  end_date date,
  is_active boolean NOT NULL DEFAULT true,
  usage_limit integer,
  usage_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE circuits ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active circuits"
  ON circuits
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public can view active promotions"
  ON promotions
  FOR SELECT
  USING (is_active = true AND (start_date IS NULL OR start_date <= CURRENT_DATE) AND (end_date IS NULL OR end_date >= CURRENT_DATE));

INSERT INTO circuits (slug, image_url, duration_en, duration_fr, title_en, title_fr, description_en, description_fr, highlights_en, highlights_fr, price, price_note_en, price_note_fr, display_order) VALUES
  ('lac-rose', 'https://images.pexels.com/photos/16558028/pexels-photo-16558028.jpeg?auto=compress&cs=tinysrgb&w=800', '1 day', '1 jour', 'Lake Retba (Pink Lake) Discovery', 'Decouverte du Lac Rose (Lac Retba)', 'Explore the famous Pink Lake, known for its unique rose color caused by algae. Watch salt harvesters at work and enjoy a traditional lunch by the lake.', 'Explorez le celebre Lac Rose, connu pour sa couleur unique causee par les algues. Observez les recolteurs de sel au travail et savourez un dejeuner traditionnel au bord du lac.', ARRAY['Pink Lake visit', 'Salt harvesting demo', 'Traditional lunch', '4x4 dunes experience', 'Local village visit', 'Photo opportunities'], ARRAY['Visite du Lac Rose', 'Demo recolte de sel', 'Dejeuner traditionnel', 'Experience dunes 4x4', 'Visite village local', 'Opportunites photos'], 45000, 'per person', 'par personne', 1),
  ('goree-island', 'https://images.pexels.com/photos/13419505/pexels-photo-13419505.jpeg?auto=compress&cs=tinysrgb&w=800', 'Half day', 'Demi-journee', 'Goree Island - History & Heritage', 'Ile de Goree - Histoire & Patrimoine', 'Visit the UNESCO World Heritage site of Goree Island. Discover the House of Slaves, colonial architecture, and the vibrant artistic community.', 'Visitez le site du patrimoine mondial de l''UNESCO de l''ile de Goree. Decouvrez la Maison des Esclaves, l''architecture coloniale et la communaute artistique vibrante.', ARRAY['Ferry crossing', 'House of Slaves', 'Colonial architecture', 'Art galleries', 'Local crafts', 'Guided tour'], ARRAY['Traversee en ferry', 'Maison des Esclaves', 'Architecture coloniale', 'Galeries d''art', 'Artisanat local', 'Visite guidee'], 35000, 'per person', 'par personne', 2),
  ('sine-saloum', 'https://images.pexels.com/photos/12715636/pexels-photo-12715636.jpeg?auto=compress&cs=tinysrgb&w=800', '2-3 days', '2-3 jours', 'Sine-Saloum Delta Expedition', 'Expedition Delta du Sine-Saloum', 'Immerse yourself in the stunning Sine-Saloum Delta biosphere reserve. Navigate through mangroves, discover bird sanctuaries, and stay in traditional lodges.', 'Immergez-vous dans la reserve de biosphere du Delta du Sine-Saloum. Naviguez a travers les mangroves, decouvrez les sanctuaires d''oiseaux et sejournez dans des lodges traditionnels.', ARRAY['Pirogue boat trip', 'Bird watching', 'Mangrove exploration', 'Traditional lodge', 'Fishing villages', 'Sunset cruise'], ARRAY['Balade en pirogue', 'Observation oiseaux', 'Exploration mangroves', 'Lodge traditionnel', 'Villages de pecheurs', 'Croisiere coucher soleil'], 150000, 'per person (2 days)', 'par personne (2 jours)', 3),
  ('casamance', 'https://images.pexels.com/photos/14604774/pexels-photo-14604774.jpeg?auto=compress&cs=tinysrgb&w=800', '4-5 days', '4-5 jours', 'Casamance - The Green Senegal', 'Casamance - Le Senegal Vert', 'Discover the lush Casamance region with its dense forests, traditional Diola villages, and pristine beaches. Experience authentic rural Senegalese life.', 'Decouvrez la luxuriante region de Casamance avec ses forets denses, ses villages Diola traditionnels et ses plages vierges. Vivez la vie rurale senegalaise authentique.', ARRAY['Ziguinchor visit', 'Diola villages', 'Sacred forests', 'Cap Skirring beach', 'Traditional dances', 'Palm wine tasting'], ARRAY['Visite Ziguinchor', 'Villages Diola', 'Forets sacrees', 'Plage Cap Skirring', 'Danses traditionnelles', 'Degustation vin de palme'], 350000, 'per person (all inclusive)', 'par personne (tout compris)', 4),
  ('saint-louis', 'https://images.pexels.com/photos/16971929/pexels-photo-16971929.jpeg?auto=compress&cs=tinysrgb&w=800', '2 days', '2 jours', 'Saint-Louis - Colonial Heritage', 'Saint-Louis - Heritage Colonial', 'Explore the historic city of Saint-Louis, former capital of French West Africa. Admire the colonial architecture, visit the Langue de Barbarie, and experience the Jazz Festival atmosphere.', 'Explorez la ville historique de Saint-Louis, ancienne capitale de l''Afrique occidentale francaise. Admirez l''architecture coloniale, visitez la Langue de Barbarie et vivez l''atmosphere du Festival de Jazz.', ARRAY['UNESCO old town', 'Faidherbe Bridge', 'Langue de Barbarie', 'Djoudj Bird Park', 'Fishermen village', 'Colonial architecture'], ARRAY['Vieille ville UNESCO', 'Pont Faidherbe', 'Langue de Barbarie', 'Parc oiseaux Djoudj', 'Village pecheurs', 'Architecture coloniale'], 120000, 'per person', 'par personne', 5),
  ('dakar-discovery', 'https://images.pexels.com/photos/17836961/pexels-photo-17836961.jpeg?auto=compress&cs=tinysrgb&w=800', '1 day', '1 jour', 'Dakar City Discovery', 'Decouverte de Dakar', 'Discover the vibrant capital of Senegal. From the African Renaissance Monument to the colorful markets, experience the energy and culture of this dynamic city.', 'Decouvrez la capitale vibrante du Senegal. Du Monument de la Renaissance Africaine aux marches colores, vivez l''energie et la culture de cette ville dynamique.', ARRAY['Renaissance Monument', 'Sandaga Market', 'IFAN Museum', 'Almadies Point', 'Local cuisine', 'Craft village'], ARRAY['Monument Renaissance', 'Marche Sandaga', 'Musee IFAN', 'Pointe des Almadies', 'Cuisine locale', 'Village artisanal'], 40000, 'per person', 'par personne', 6);
