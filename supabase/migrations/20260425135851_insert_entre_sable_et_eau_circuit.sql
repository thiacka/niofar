/*
  # Insert "Entre Sable & Eau" circuit

  1. New Data
    - Adds a new 3-day/2-night circuit: "Entre Sable & Eau"
    - Subtitle: "Lompoul, Lac Rose et Lagune de Somone"
    - Covers: Lac Rose, Lompoul Desert, Ngaye Mekhe, Tivaouane, Thies, Sindia, Somone Lagoon, Saly
    - 3-day itinerary stored in JSONB format
    - Bilingual content (French and English)
    - Price: 266,992 FCFA (~407 EUR) per person base 2 persons

  2. No schema changes
    - Inserts into existing `circuits` table only
*/

INSERT INTO circuits (
  slug,
  image_url,
  duration_en,
  duration_fr,
  duration_days,
  title_en,
  title_fr,
  description_en,
  description_fr,
  highlights_en,
  highlights_fr,
  itinerary,
  included_services_fr,
  included_services_en,
  accommodation_type_fr,
  accommodation_type_en,
  min_participants,
  max_participants,
  price,
  price_note_en,
  price_note_fr,
  is_active,
  display_order
) VALUES (
  'entre-sable-et-eau',
  'https://images.pexels.com/photos/16558028/pexels-photo-16558028.jpeg?auto=compress&cs=tinysrgb&w=1260',
  '3 days / 2 nights',
  '3 jours / 2 nuits',
  3,
  'Between Sand & Water',
  'Entre Sable & Eau',
  'Set off to discover a Senegal of contrasting landscapes, where each stop immerses you in a unique atmosphere. From the astonishing Pink Lake, famous for its singular reflections, to the golden dunes of Lompoul, passing through the serenity of the Somone Lagoon, this circuit invites you to live an experience rich in emotions. Between adventure, nature and relaxation, let yourself be carried away by the beauty of the landscapes and the authenticity of the encounters, all the way to the sunny beaches of Saly, for an unforgettable escape.',
  'Partez a la decouverte d''un Senegal aux paysages contrastes, ou chaque etape vous plonge dans une atmosphere unique. De l''etonnant Lac Rose, celebre pour ses reflets singuliers, aux dunes dorees du Lompoul, en passant par la serenite de la Lagune de Somone, ce circuit vous invite a vivre une experience riche en emotions. Entre aventure, nature et detente, laissez-vous porter par la beaute des paysages et l''authenticite des rencontres, jusqu''aux plages ensoleillees de Saly, pour une parenthese inoubliable.',
  ARRAY[
    'Pink Lake (Lac Rose) - 4x4 dunes & salt harvesting',
    'Lompoul Desert - camel ride & dinner under the stars',
    'Ngaye Mekhe - traditional leather workshops',
    'Tivaouane - Tidiane brotherhood spiritual site',
    'Thies - basket-weaving workshops',
    'Sindia Baobab Forest',
    'Somone Nature Reserve - pirogue & mangroves',
    'Saly seaside resort'
  ],
  ARRAY[
    'Lac Rose - dunes en 4x4 & recolte de sel',
    'Desert de Lompoul - balade a dos de dromadaire & diner sous les etoiles',
    'Ngaye Mekhe - ateliers traditionnels du cuir',
    'Tivaouane - haut lieu spirituel de la confrerie Tidiane',
    'Thies - ateliers de vannerie',
    'Foret de baobabs de Sindia',
    'Reserve naturelle de la Somone - pirogue & mangroves',
    'Station balneaire de Saly'
  ],
  '[
    {
      "day": 1,
      "title_fr": "Aeroport - Lac Rose",
      "title_en": "Airport - Pink Lake",
      "description_fr": "Accueil a l''aeroport et transfert vers le lac Retba, plus connu sous le nom de Lac Rose (environ 80 km / 1 heure). Ce site naturel fascinant doit ses nuances changeantes, allant du rose au mauve, a l''intensite du soleil et du vent. A l''arrivee, installation, diner et nuit au lodge Chez Salim, dans un cadre paisible et authentique.",
      "description_en": "Welcome at the airport and transfer to Lake Retba, better known as the Pink Lake (approximately 80 km / 1 hour). This fascinating natural site owes its changing hues, ranging from pink to mauve, to the intensity of the sun and wind. Upon arrival, check-in, dinner and overnight at Chez Salim lodge, in a peaceful and authentic setting.",
      "location_fr": "Lac Rose",
      "location_en": "Pink Lake",
      "accommodation_fr": "Lodge Chez Salim",
      "accommodation_en": "Chez Salim Lodge",
      "meals_fr": "Diner",
      "meals_en": "Dinner"
    },
    {
      "day": 2,
      "title_fr": "Lac Rose - Lompoul",
      "title_en": "Pink Lake - Lompoul",
      "description_fr": "Excursion en 4x4 a travers les dunes dorees du Lac Rose, rappelant l''epoque mythique du Rallye Paris-Dakar. Decouverte de ce site naturel unique a la couleur changeante, allant du rose eclatant au mauve selon la lumiere du soleil. Avec sa forte salinite, experience etonnante de flottaison. Rencontre avec les recolteurs de sel et decouverte de leurs techniques traditionnelles. Traversee du lac en pirogue. Baignade dans les eaux salees. Dejeuner au Bonaba Cafe avec vue spectaculaire sur le lac. Route vers le desert de Lompoul. Installation dans un campement de charme, tente de style mauritanien. Balade a dos de dromadaire au coucher du soleil, diner sous les etoiles rythme par des sons de djembe.",
      "description_en": "4x4 excursion through the golden dunes of the Pink Lake, reminiscent of the mythical Paris-Dakar Rally era. Discover this unique natural site with its changing color, from bright pink to mauve depending on sunlight. With its high salinity, enjoy an astonishing floating experience. Meet the salt harvesters and discover their traditional techniques. Cross the lake by pirogue. Swim in the salty waters. Lunch at Bonaba Cafe with spectacular views of the lake. Drive to the Lompoul Desert. Check into a charming camp with Mauritanian-style tent. Camel ride at sunset, dinner under the stars accompanied by djembe rhythms.",
      "location_fr": "Lac Rose, Desert de Lompoul",
      "location_en": "Pink Lake, Lompoul Desert",
      "accommodation_fr": "Campement de charme, tente mauritanienne",
      "accommodation_en": "Charming camp, Mauritanian-style tent",
      "meals_fr": "Petit-dejeuner, Dejeuner, Diner",
      "meals_en": "Breakfast, Lunch, Dinner"
    },
    {
      "day": 3,
      "title_fr": "Lompoul - Lagune de Somone - Saly",
      "title_en": "Lompoul - Somone Lagoon - Saly",
      "description_fr": "Decouverte de Ngaye Mekhe et ses ateliers traditionnels du cuir ou sont fabriques a la main chaussures, sandales et sacs. Visite de Tivaouane, haut lieu de la confrerie Tidiane, avec son atmosphere spirituelle et paisible. Arret a Thies, capitale du rail, pour visiter les ateliers de vannerie. Traversee de la Foret de baobabs de Sindia, panorama saisissant de baobabs centenaires. Visite de la Reserve naturelle de la Somone, site classe entre lagune et ocean, riche en mangroves et en oiseaux (herons, pelicans, flamants roses). Traversee en pirogue et dejeuner Chez Rasta dans un cadre naturel exceptionnel. Route vers la station balneaire de Saly.",
      "description_en": "Discover Ngaye Mekhe and its traditional leather workshops where shoes, sandals and bags are handcrafted. Visit Tivaouane, a major Tidiane brotherhood site, with its spiritual and peaceful atmosphere. Stop in Thies, the railway capital, to visit basket-weaving workshops. Cross the Sindia Baobab Forest, a striking panorama of centuries-old baobabs. Visit the Somone Nature Reserve, a classified site between lagoon and ocean, rich in mangroves and birds (herons, pelicans, flamingos). Pirogue crossing and lunch at Chez Rasta in an exceptional natural setting. Drive to the seaside resort of Saly.",
      "location_fr": "Ngaye Mekhe, Tivaouane, Thies, Sindia, Somone, Saly",
      "location_en": "Ngaye Mekhe, Tivaouane, Thies, Sindia, Somone, Saly",
      "accommodation_fr": "",
      "accommodation_en": "",
      "meals_fr": "Petit-dejeuner, Dejeuner",
      "meals_en": "Breakfast, Lunch"
    }
  ]'::jsonb,
  '["Hebergement dans les hotels mentionnes ou similaires", "Pension complete (du diner du jour 1 au dejeuner du jour 3)", "Vehicule avec carburant, chauffeur et guide selon le nombre de personnes", "Tous les frais du guide et/ou chauffeur", "Toutes les excursions mentionnees et droits de visite", "Guide parlant francais ou anglais, autres langues sur demande"]'::jsonb,
  '["Accommodation in mentioned hotels or similar", "Full board (from dinner on day 1 to lunch on day 3)", "Vehicle with fuel, driver and guide according to group size", "All guide and/or driver fees", "All mentioned excursions and entrance fees", "French or English speaking guide, other languages on request"]'::jsonb,
  'Lodge et campement de charme',
  'Lodge and charming camp',
  2,
  50,
  266992,
  'per person (base 2 persons)',
  'par personne (base 2 personnes)',
  true,
  10
);