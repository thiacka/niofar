/*
  # Insert "Evasion au Senegal" circuit

  1. New Data
    - Adds a new 8-day/7-night circuit: "Evasion au Senegal"
    - Covers: Dakar, Goree, Lac Rose, Lompoul, Somone, Palmarin, Delta du Saloum, Joal-Fadiouth, Saly
    - 8-day itinerary stored in JSONB format
    - Bilingual content (French and English)
    - Price: 949,000 FCFA (~1447 EUR) per person base 2 persons

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
  'evasion-au-senegal',
  'https://images.pexels.com/photos/13419505/pexels-photo-13419505.jpeg?auto=compress&cs=tinysrgb&w=1260',
  '8 days / 7 nights',
  '8 jours / 7 nuits',
  8,
  'Escape to Senegal',
  'Evasion au Senegal',
  'Senegal is a land of contrasts and history, blending cultural richness, historical heritage and natural diversity. Located in West Africa, this fascinating country captivates with the beauty of its landscapes and the warmth of its welcome. Before the arrival of Europeans, powerful empires such as the Mali Empire and the Songhai Empire left their mark on the region. From the 16th century, exchanges with Europe profoundly transformed the territory, particularly through maritime trade. Senegal then became a major center of French West Africa, with Saint-Louis and then Dakar as administrative capitals. Independence was proclaimed in 1960 under the leadership of Leopold Sedar Senghor, an iconic figure of the country. Today, Senegal offers a unique experience combining discovery and emotion. Its capital, Dakar, pulses with modernity and tradition. Off its coast, Goree Island, a UNESCO World Heritage Site, is a poignant place of remembrance, witness to the history of the slave trade. A few kilometers away, the Pink Lake amazes with its astonishing colors, while the Lompoul Desert invites you to escape into spectacular dunes. To the north, the Djoudj National Bird Sanctuary, a UNESCO World Heritage Site, is one of the largest bird sanctuaries in West Africa. Further south, the Saloum Delta reveals its mangroves and peaceful islands, offering immersion in preserved nature. Finally, the seaside resort of Saly provides an ideal stop to relax by the ocean.',
  'Le Senegal est une terre de contrastes et d''histoire, ou se melent richesse culturelle, heritage historique et diversite naturelle. Situe en Afrique de l''Ouest, ce pays fascinant seduit autant par la beaute de ses paysages que par la chaleur de son accueil. Avant l''arrivee des Europeens, de puissants empires tels que l''Empire du Mali et l''Empire songhai ont marque la region. A partir du XVIe siecle, les echanges avec l''Europe transforment profondement le territoire, notamment a travers le commerce maritime et la traite negriere. Le Senegal devient ensuite un centre majeur de l''Afrique Occidentale Francaise, avec Saint-Louis puis Dakar comme capitales administratives. L''independance est proclamee en 1960 sous l''impulsion de Leopold Sedar Senghor, figure emblematique du pays. Aujourd''hui, le Senegal offre une experience unique melant decouverte et emotion. Sa capitale, Dakar, vibre au rythme de la modernite et des traditions. Au large de ses cotes, l''Ile de Goree, Patrimoine mondial de l''UNESCO, constitue un lieu de memoire poignant, temoin de l''histoire de la traite negriere. A quelques kilometres, le Lac Rose emerveille par ses couleurs etonnantes, tandis que le Desert de Lompoul invite a l''evasion au coeur de dunes spectaculaires. Au nord, le Parc national des oiseaux du Djoudj, classe au patrimoine mondial de l''UNESCO, constitue l''un des plus grands sanctuaires d''oiseaux d''Afrique de l''Ouest. Plus au sud, le Delta du Saloum devoile ses mangroves et ses iles paisibles, offrant une immersion dans une nature preservee. Enfin, la station balneaire de Saly constitue une halte ideale pour se detendre au bord de l''ocean.',
  ARRAY[
    'Dakar city tour & African Renaissance Monument',
    'Goree Island - UNESCO World Heritage Site',
    'Pink Lake (Lac Rose) - 4x4 dunes & salt harvesting',
    'Lompoul Desert - camel ride & dinner under the stars',
    'Somone Lagoon - pirogue & mangroves',
    'Saloum Delta National Park - biosphere reserve',
    'Joal-Fadiouth - shell islands & Senghor birthplace',
    'Traditional Thieboudienne cooking experience',
    'Cultural percussion show',
    'Saly seaside resort'
  ],
  ARRAY[
    'Visite de Dakar & Monument de la Renaissance Africaine',
    'Ile de Goree - Patrimoine mondial UNESCO',
    'Lac Rose - dunes en 4x4 & recolte de sel',
    'Desert de Lompoul - balade a dos de dromadaire & diner sous les etoiles',
    'Lagune de Somone - pirogue & mangroves',
    'Parc national du Delta du Saloum - reserve de biosphere',
    'Joal-Fadiouth - iles aux coquillages & lieu de naissance de Senghor',
    'Preparation du Thieboudienne traditionnel',
    'Spectacle de percussions traditionnelles',
    'Station balneaire de Saly'
  ],
  '[
    {
      "day": 1,
      "title_fr": "Aeroport - Dakar",
      "title_en": "Airport - Dakar",
      "description_fr": "Accueil a l''aeroport et transfert a Dakar (environ 63 km / 1 heure). Enregistrement a l''hotel Lodge des Almadies ou dans un etablissement similaire. Installation dans vos chambres et temps libre. Diner libre (non compris) et nuit a l''hotel.",
      "description_en": "Welcome at the airport and transfer to Dakar (approximately 63 km / 1 hour). Check-in at the Lodge des Almadies hotel or similar establishment. Settle into your rooms and enjoy free time. Dinner at leisure (not included) and overnight at the hotel.",
      "location_fr": "Dakar",
      "location_en": "Dakar",
      "accommodation_fr": "Lodge des Almadies ou similaire",
      "accommodation_en": "Lodge des Almadies or similar",
      "meals_fr": "Diner libre",
      "meals_en": "Dinner at leisure"
    },
    {
      "day": 2,
      "title_fr": "Dakar - Goree - Lac Rose",
      "title_en": "Dakar - Goree - Pink Lake",
      "description_fr": "Decouverte de Dakar, vibrante capitale du Senegal. Visite du Monument de la Renaissance Africaine avec panorama spectaculaire, du Marche Kermel et du Village artisanal de Soumbedioune. Traversee en chaloupe vers l''Ile de Goree, classee au patrimoine mondial de l''UNESCO. Dejeuner au restaurant Chez Tonton. Visite de la Maison des Esclaves et du Musee historique de Goree. Depart en direction du Lac Rose dans l''apres-midi. Installation, diner et nuit au lodge Chez Salim.",
      "description_en": "Discover Dakar, the vibrant capital of Senegal. Visit the African Renaissance Monument with its spectacular panorama, Kermel Market and Soumbedioune Craft Village. Ferry crossing to Goree Island, a UNESCO World Heritage Site. Lunch at Chez Tonton restaurant. Visit the House of Slaves and the Goree Historical Museum. Departure toward the Pink Lake in the afternoon. Check-in, dinner and overnight at Chez Salim lodge.",
      "location_fr": "Dakar, Ile de Goree, Lac Rose",
      "location_en": "Dakar, Goree Island, Pink Lake",
      "accommodation_fr": "Lodge Chez Salim",
      "accommodation_en": "Chez Salim Lodge",
      "meals_fr": "Dejeuner, Diner",
      "meals_en": "Lunch, Dinner"
    },
    {
      "day": 3,
      "title_fr": "Lac Rose - Lompoul",
      "title_en": "Pink Lake - Lompoul",
      "description_fr": "Excursion en 4x4 a travers les dunes du Lac Rose, rappelant l''epoque du Rallye Paris-Dakar. Decouverte de ce site naturel unique a la couleur changeante, allant du rose eclatant au mauve. Rencontre avec les recolteurs de sel et traversee du lac en pirogue. Baignade dans les eaux salees. Dejeuner au Bonaba Cafe avec vue spectaculaire sur le lac. Route vers le desert de Lompoul. Installation dans un campement de charme, tente de style mauritanien. Balade a dos de dromadaire au coucher du soleil, diner sous les etoiles rythme par des sons de djembe.",
      "description_en": "4x4 excursion through the Pink Lake dunes, reminiscent of the Paris-Dakar Rally era. Discover this unique natural site with its changing colors, from bright pink to mauve. Meet the salt harvesters and cross the lake by pirogue. Swim in the salty waters. Lunch at Bonaba Cafe with a spectacular view of the lake. Drive to the Lompoul Desert. Check into a charming camp with Mauritanian-style tents. Camel ride at sunset, dinner under the stars accompanied by djembe rhythms.",
      "location_fr": "Lac Rose, Desert de Lompoul",
      "location_en": "Pink Lake, Lompoul Desert",
      "accommodation_fr": "Campement de charme, tente mauritanienne",
      "accommodation_en": "Charming camp, Mauritanian-style tent",
      "meals_fr": "Petit-dejeuner, Dejeuner, Diner",
      "meals_en": "Breakfast, Lunch, Dinner"
    },
    {
      "day": 4,
      "title_fr": "Lompoul - Lagune de Somone - Palmarin",
      "title_en": "Lompoul - Somone Lagoon - Palmarin",
      "description_fr": "Decouverte de Ngaye Mekhe et ses ateliers traditionnels du cuir. Visite de Tivaouane, haut lieu de la confrerie Tidiane. Arret a Thies, capitale du rail, pour visiter les ateliers de vannerie. Traversee de la Foret de baobabs de Sindia. Visite de la Reserve naturelle de la Somone avec traversee en pirogue et dejeuner Chez Rasta. Route vers le Delta du Saloum a travers la brousse. Arrivee a Palmarin, installation au King Baobab Lodge ou similaire, sur la pointe de Sangomar. Detente entre piscine et plage sauvage. Diner et nuit.",
      "description_en": "Discover Ngaye Mekhe and its traditional leather workshops. Visit Tivaouane, a major Tidiane brotherhood site. Stop in Thies, the railway capital, to visit basket-weaving workshops. Cross the Sindia Baobab Forest. Visit the Somone Nature Reserve with a pirogue crossing and lunch at Chez Rasta. Drive toward the Saloum Delta through the bush. Arrive in Palmarin, check into King Baobab Lodge or similar, on the Sangomar spit. Relax between pool and wild beach. Dinner and overnight.",
      "location_fr": "Ngaye Mekhe, Tivaouane, Thies, Somone, Palmarin",
      "location_en": "Ngaye Mekhe, Tivaouane, Thies, Somone, Palmarin",
      "accommodation_fr": "King Baobab Lodge ou similaire",
      "accommodation_en": "King Baobab Lodge or similar",
      "meals_fr": "Petit-dejeuner, Dejeuner, Diner",
      "meals_en": "Breakfast, Lunch, Dinner"
    },
    {
      "day": 5,
      "title_fr": "Parc National du Delta du Saloum",
      "title_en": "Saloum Delta National Park",
      "description_fr": "Journee en pirogue au coeur du Parc national du delta du Saloum, classe Reserve mondiale de biosphere. Navigation dans un dedale de bolongs sinueux bordes de mangroves. Observation de la faune : oiseaux migrateurs (herons, sternes, pelicans), crabes violonistes, et rencontre avec les cueilleuses d''huitres de paletuviers et les pecheurs traditionnels. Dejeuner sur une plage sauvage avec grillade de poisson frais. Baignade dans des eaux calmes et detente sur la plage deserte. Retour au lodge en fin d''apres-midi. Diner et nuit au coeur du Sine Saloum.",
      "description_en": "Full day by pirogue in the heart of the Saloum Delta National Park, classified as a World Biosphere Reserve. Navigate through a maze of winding creeks bordered by mangroves. Wildlife observation: migratory birds (herons, terns, pelicans), fiddler crabs, and encounters with mangrove oyster gatherers and traditional fishermen. Lunch on a wild beach with fresh fish barbecue. Swim in calm waters and relax on the deserted beach. Return to the lodge in the late afternoon. Dinner and overnight in the heart of Sine Saloum.",
      "location_fr": "Delta du Saloum",
      "location_en": "Saloum Delta",
      "accommodation_fr": "King Baobab Lodge ou similaire",
      "accommodation_en": "King Baobab Lodge or similar",
      "meals_fr": "Petit-dejeuner, Dejeuner, Diner",
      "meals_en": "Breakfast, Lunch, Dinner"
    },
    {
      "day": 6,
      "title_fr": "Marche de Samba Dia - Palmarin",
      "title_en": "Samba Dia Market - Palmarin",
      "description_fr": "Depart pour Samba Dia et son marche hebdomadaire (luma), rassemblant habitants, cultivateurs, pecheurs et eleveurs. Decouverte des produits locaux, tissus, cereales, epices, betail et remedes traditionnels. Retour a Palmarin pour une immersion villageoise : balade en caleche, accueil par une famille locale. Preparation du Thieboudienne avec les femmes de l''association Nebeday, degustation a la senegalaise autour d''un plat commun. Ceremonie des trois thes a la menthe et echanges sur les traditions locales. Detente piscine et plage. Spectacle culturel en soiree avec percussions traditionnelles, tam-tams, calebasses et danses locales.",
      "description_en": "Departure for Samba Dia and its weekly market (luma), gathering locals, farmers, fishermen and herders. Discover local products, fabrics, cereals, spices, livestock and traditional remedies. Return to Palmarin for a village immersion: horse-cart ride, welcome by a local family. Thieboudienne preparation with the women of the Nebeday association, tasting Senegalese-style around a shared dish. Traditional three-tea ceremony with mint and exchanges about local traditions. Pool and beach relaxation. Evening cultural show with traditional percussion, tam-tams, calabashes and local dances.",
      "location_fr": "Samba Dia, Palmarin",
      "location_en": "Samba Dia, Palmarin",
      "accommodation_fr": "King Baobab Lodge ou similaire",
      "accommodation_en": "King Baobab Lodge or similar",
      "meals_fr": "Petit-dejeuner, Dejeuner, Diner",
      "meals_en": "Breakfast, Lunch, Dinner"
    },
    {
      "day": 7,
      "title_fr": "Palmarin - Joal-Fadiouth - Saly",
      "title_en": "Palmarin - Joal-Fadiouth - Saly",
      "description_fr": "Matinee de detente au bord de la piscine ou sur la plage. Depart pour Joal-Fadiouth, ville natale du poete et president Leopold Sedar Senghor. Dejeuner a La Taverne du Pecheur face a la mangrove. Embarquement en pirogue traditionnelle vers l''ile de Fadiouth. Decouverte des celebres cimetieres mixtes et des greniers a mil avec un guide local. Promenade dans les ruelles de l''ile, retour par le pittoresque pont en bois. Route vers Saly, installation a l''Hotel Royam. Diner et nuit. Fin de journee libre : detente, baignade piscine ou ocean.",
      "description_en": "Morning relaxation by the pool or on the beach. Departure for Joal-Fadiouth, birthplace of poet and president Leopold Sedar Senghor. Lunch at La Taverne du Pecheur facing the mangrove. Board a traditional pirogue to Fadiouth Island. Discover the famous mixed cemeteries and millet granaries with a local guide. Stroll through the island''s alleys, return via the picturesque wooden bridge. Drive to Saly, check into Hotel Royam. Dinner and overnight. Free evening: relaxation, pool or ocean swimming.",
      "location_fr": "Palmarin, Joal-Fadiouth, Saly",
      "location_en": "Palmarin, Joal-Fadiouth, Saly",
      "accommodation_fr": "Hotel Royam, Saly",
      "accommodation_en": "Hotel Royam, Saly",
      "meals_fr": "Petit-dejeuner, Dejeuner, Diner",
      "meals_en": "Breakfast, Lunch, Dinner"
    },
    {
      "day": 8,
      "title_fr": "Journee libre - Depart",
      "title_en": "Free Day - Departure",
      "description_fr": "Petit-dejeuner a l''hotel. Journee libre avec option safari a la Reserve de Bandia (girafes, rhinoceros, gazelles, crocodiles, zebres) et/ou Ranch des Lions. Liberation des chambres a midi. Transfert a l''aeroport quatre heures avant le vol.",
      "description_en": "Breakfast at the hotel. Free day with optional safari at Bandia Nature Reserve (giraffes, rhinoceros, gazelles, crocodiles, zebras) and/or Lion Ranch. Room checkout at noon. Airport transfer four hours before flight departure.",
      "location_fr": "Saly, Aeroport",
      "location_en": "Saly, Airport",
      "accommodation_fr": "",
      "accommodation_en": "",
      "meals_fr": "Petit-dejeuner",
      "meals_en": "Breakfast"
    }
  ]'::jsonb,
  '["Hebergement dans les hotels mentionnes ou equivalents", "Pension complete (du dejeuner du jour 1 au dejeuner du jour 6)", "Vehicule avec carburant, chauffeur et guide selon le nombre de participants", "Tous les honoraires du guide et/ou du chauffeur", "Toutes les excursions mentionnees et les droits d''entree", "Guide parlant francais ou anglais"]'::jsonb,
  '["Accommodation in mentioned hotels or equivalent", "Full board (from lunch on day 1 to lunch on day 6)", "Vehicle with fuel, driver and guide according to group size", "All guide and/or driver fees", "All mentioned excursions and entrance fees", "French or English speaking guide"]'::jsonb,
  'Hotels, lodges et campements de charme',
  'Hotels, lodges and charming camps',
  2,
  50,
  949000,
  'per person (base 2 persons)',
  'par personne (base 2 personnes)',
  true,
  8
);