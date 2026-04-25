/*
  # Insert "Grand Voyage du Senegal" circuit

  1. New Data
    - Adds a new 8-day/7-night circuit: "Grand Voyage du Senegal"
    - Covers: Dakar, Goree, Lac Rose, Saint-Louis, Djoudj, Langue de Barbarie, Lompoul, Touba, Kaolack, Toubacouta, Delta du Saloum, Saly
    - 8-day itinerary stored in JSONB format
    - Bilingual content (French and English)
    - Price: 1,029,920 FCFA (~1570 EUR) per person base 2 persons

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
  'grand-voyage-du-senegal',
  'https://images.pexels.com/photos/16971929/pexels-photo-16971929.jpeg?auto=compress&cs=tinysrgb&w=1260',
  '8 days / 7 nights',
  '8 jours / 7 nuits',
  8,
  'Grand Tour of Senegal',
  'Grand Voyage du Senegal',
  'This circuit offers a true journey through the history of Senegal, from its ancient origins to its contemporary identity, between traditions, spirituality and exceptional landscapes. It begins at the heart of the ancient kingdoms, notably the Serere kingdoms of Sine and Saloum, which long structured the social and political organization of the country. These civilizations were gradually influenced by contact with Berber populations and the great trans-Saharan trade routes, which introduced Islam to the region. Later, European missionaries also left their mark on the territory, particularly during the colonial era. The history continues with the colonial period and the construction of Dakar, which became the capital and symbol of the country''s modern development. The journey then leads to the mythical Pink Lake, known for its unique hues and its role as the finish line of the famous Paris-Dakar Rally. Then on to Saint-Louis, former colonial capital and major witness to French history in West Africa. The route is enriched by a spiritual stop in Touba, center of Mouridism around the majestic Great Mosque, illustrating the importance of brotherhoods in the social and religious construction of contemporary Senegal. Finally, the journey ends in the natural splendor of the Saloum Delta and its islands, cradle of the ancient Serere kingdoms, where mangroves, creeks and traditional villages offer a final glimpse of an authentic Senegal deeply rooted in its history.',
  'Ce circuit propose un veritable voyage a travers l''histoire du Senegal, depuis ses origines anciennes jusqu''a son identite contemporaine, entre traditions, spiritualite et paysages d''exception. Il commence au coeur des anciens royaumes, notamment les royaumes sereres du Sine et du Saloum, qui ont longtemps structure l''organisation sociale et politique du pays. Ces civilisations ont ete progressivement influencees par les contacts avec les populations berberes et les grandes routes commerciales transsahariennes, qui ont introduit l''islam dans la region. Plus tard, les missionnaires europeens marqueront egalement le territoire, notamment a l''epoque coloniale, transformant durablement les structures sociales et religieuses. L''histoire se poursuit avec la periode coloniale et la construction de Dakar, devenue capitale et symbole du developpement moderne du pays. Non loin de la, le voyage mene vers le mythique Lac Rose, haut lieu naturel et historique, connu pour ses teintes uniques et son role dans l''arrivee du celebre Rallye Paris-Dakar. Puis cap vers Saint-Louis, ancienne capitale coloniale, temoin majeur de l''histoire francaise en Afrique de l''Ouest. Le parcours s''enrichit ensuite d''une etape spirituelle a Touba, centre du mouridisme autour de la majestueuse Grande Mosquee de Touba, illustrant l''importance des confreries dans la construction sociale et religieuse du Senegal contemporain. Enfin, le voyage s''acheve dans la splendeur naturelle du Delta du Saloum et de ses iles, berceau des anciens royaumes sereres, ou mangroves, bolongs et villages traditionnels offrent un dernier regard sur un Senegal authentique et profondement enracine dans son histoire.',
  ARRAY[
    'Dakar city tour & African Renaissance Monument',
    'Goree Island - UNESCO World Heritage Site',
    'Pink Lake (Lac Rose) - 4x4 dunes & salt harvesting',
    'Saint-Louis - UNESCO colonial heritage & Faidherbe Bridge',
    'Djoudj National Bird Sanctuary - UNESCO World Heritage',
    'Langue de Barbarie National Park',
    'Lompoul Desert - camel ride & dinner under the stars',
    'Touba Great Mosque - spiritual capital of Mouridism',
    'Saloum Delta National Park - biosphere reserve',
    'Sipo Island - traditional village & ecological camp',
    'Traditional weekly markets',
    'Saly seaside resort'
  ],
  ARRAY[
    'Visite de Dakar & Monument de la Renaissance Africaine',
    'Ile de Goree - Patrimoine mondial UNESCO',
    'Lac Rose - dunes en 4x4 & recolte de sel',
    'Saint-Louis - Patrimoine colonial UNESCO & Pont Faidherbe',
    'Parc national des oiseaux du Djoudj - Patrimoine mondial UNESCO',
    'Parc national de la Langue de Barbarie',
    'Desert de Lompoul - balade a dos de dromadaire & diner sous les etoiles',
    'Grande Mosquee de Touba - capitale spirituelle du mouridisme',
    'Parc national du Delta du Saloum - reserve de biosphere',
    'Ile de Sipo - village traditionnel & campement ecologique',
    'Marches hebdomadaires traditionnels',
    'Station balneaire de Saly'
  ],
  '[
    {
      "day": 1,
      "title_fr": "Aeroport - Dakar",
      "title_en": "Airport - Dakar",
      "description_fr": "Accueil a l''aeroport et transfert vers Dakar (environ 63 km / 1 heure). Installation a l''hotel Lodge des Almadies ou similaire. Nuitee a l''hotel. Diner non inclus.",
      "description_en": "Welcome at the airport and transfer to Dakar (approximately 63 km / 1 hour). Check-in at the Lodge des Almadies hotel or similar. Overnight at the hotel. Dinner not included.",
      "location_fr": "Dakar",
      "location_en": "Dakar",
      "accommodation_fr": "Lodge des Almadies ou similaire",
      "accommodation_en": "Lodge des Almadies or similar",
      "meals_fr": "Diner non inclus",
      "meals_en": "Dinner not included"
    },
    {
      "day": 2,
      "title_fr": "Dakar - Goree - Lac Rose",
      "title_en": "Dakar - Goree - Pink Lake",
      "description_fr": "Decouverte de Dakar, vibrante capitale du Senegal : Place de l''Independance, Palais presidentiel, Monument de la Renaissance Africaine avec panorama spectaculaire, Marche Kermel et Village artisanal de Soumbedioune. Traversee en chaloupe vers l''Ile de Goree, classee au patrimoine mondial de l''UNESCO. Dejeuner au restaurant Chez Tonton. Visite de la Maison des Esclaves et du Musee historique de Goree. Depart dans l''apres-midi vers le Lac Rose. Installation, diner et nuit au lodge Chez Salim.",
      "description_en": "Discover Dakar, the vibrant capital of Senegal: Independence Square, Presidential Palace, African Renaissance Monument with spectacular panorama, Kermel Market and Soumbedioune Craft Village. Ferry crossing to Goree Island, a UNESCO World Heritage Site. Lunch at Chez Tonton restaurant. Visit the House of Slaves and the Goree Historical Museum. Afternoon departure toward the Pink Lake. Check-in, dinner and overnight at Chez Salim lodge.",
      "location_fr": "Dakar, Ile de Goree, Lac Rose",
      "location_en": "Dakar, Goree Island, Pink Lake",
      "accommodation_fr": "Lodge Chez Salim",
      "accommodation_en": "Chez Salim Lodge",
      "meals_fr": "Dejeuner, Diner",
      "meals_en": "Lunch, Dinner"
    },
    {
      "day": 3,
      "title_fr": "Lac Rose - Saint-Louis",
      "title_en": "Pink Lake - Saint-Louis",
      "description_fr": "Immersion au coeur du Lac Rose. Rencontre avec les ramasseurs de sel et decouverte de leurs techniques ancestrales. Aventure en 4x4 a travers les dunes de sable evoquant l''esprit du Rallye Paris-Dakar. Excursion jusqu''a la Grande Cote, ou l''ocean Atlantique s''ecrase sur une plage infinie. Baignade ou experience de flottaison dans les eaux salees du lac. Dejeuner au Bonaba Cafe avec vue panoramique sur le lac. Depart pour Saint-Louis, ville classee au patrimoine mondial de l''UNESCO. Installation, diner et nuitee a la Residence Hote.",
      "description_en": "Immersion at the heart of the Pink Lake. Meet the salt gatherers and discover their ancestral techniques. 4x4 adventure through sand dunes evoking the spirit of the Paris-Dakar Rally. Excursion to the Grande Cote, where the Atlantic Ocean crashes onto an endless beach. Swim or float in the lake''s salty waters. Lunch at Bonaba Cafe with panoramic views of the lake. Departure for Saint-Louis, a UNESCO World Heritage city. Check-in, dinner and overnight at Residence Hote.",
      "location_fr": "Lac Rose, Saint-Louis",
      "location_en": "Pink Lake, Saint-Louis",
      "accommodation_fr": "Residence Hote, Saint-Louis",
      "accommodation_en": "Residence Hote, Saint-Louis",
      "meals_fr": "Petit-dejeuner, Dejeuner, Diner",
      "meals_en": "Breakfast, Lunch, Dinner"
    },
    {
      "day": 4,
      "title_fr": "Saint-Louis - Djoudj",
      "title_en": "Saint-Louis - Djoudj",
      "description_fr": "Depart matinal vers le Parc national des oiseaux du Djoudj (60 km au nord), classe au patrimoine mondial de l''UNESCO. Ce sanctuaire exceptionnel accueille chaque annee des millions d''oiseaux migrateurs apres la traversee du Sahara : pelicans, flamants roses, cormorans et aigles pecheurs. Visite en pirogue a travers les marigots et roselieres, avec observation de crocodiles, varans, phacochere et chacals. Dejeuner au restaurant du parc. Retour a Saint-Louis et balade en caleche : Pont Faidherbe, demeures historiques et quartier de Guet Ndar avec ses pirogues colorees. Diner et nuit a l''hotel. Option basse saison (mi-mai a mi-octobre) : visite du Parc national de la Langue de Barbarie a la place du Djoudj.",
      "description_en": "Early morning departure to Djoudj National Bird Sanctuary (60 km north), a UNESCO World Heritage Site. This exceptional sanctuary welcomes millions of migratory birds each year after crossing the Sahara: pelicans, flamingos, cormorants and fish eagles. Pirogue tour through creeks and reed beds, with sightings of crocodiles, monitor lizards, warthogs and jackals. Lunch at the park restaurant. Return to Saint-Louis and horse-cart tour: Faidherbe Bridge, historic mansions and Guet Ndar quarter with its colorful pirogues. Dinner and overnight at the hotel. Low season option (mid-May to mid-October): visit to Langue de Barbarie National Park instead of Djoudj.",
      "location_fr": "Saint-Louis, Parc du Djoudj",
      "location_en": "Saint-Louis, Djoudj Park",
      "accommodation_fr": "Residence Hote, Saint-Louis",
      "accommodation_en": "Residence Hote, Saint-Louis",
      "meals_fr": "Petit-dejeuner, Dejeuner, Diner",
      "meals_en": "Breakfast, Lunch, Dinner"
    },
    {
      "day": 5,
      "title_fr": "Saint-Louis - Ocean et Savane - Lompoul",
      "title_en": "Saint-Louis - Ocean & Savanna - Lompoul",
      "description_fr": "Direction le Parc National de la Langue de Barbarie pour une immersion au coeur d''un ecosysteme unique. Traversee du fleuve Senegal en pirogue pour rejoindre la Langue de Barbarie, fine bande de sable entre fleuve et ocean. Balade sur une plage sauvage et preservee. Dejeuner au restaurant Ocean et Savane avec vue panoramique exceptionnelle. Apres-midi detente : baignade au choix dans la piscine, le fleuve ou l''ocean Atlantique. Route vers le desert de Lompoul. Installation dans un campement de charme, tente de style mauritanien. Balade a dos de dromadaire au coucher du soleil, diner sous les etoiles rythme par des sons de djembe.",
      "description_en": "Head to Langue de Barbarie National Park for an immersion in a unique ecosystem. Cross the Senegal River by pirogue to reach the Langue de Barbarie, a thin strip of sand between river and ocean. Walk on a wild, preserved beach. Lunch at Ocean et Savane restaurant with exceptional panoramic views. Afternoon relaxation: swim in the pool, the river or the Atlantic Ocean. Drive to the Lompoul Desert. Check into a charming camp with Mauritanian-style tents. Camel ride at sunset, dinner under the stars accompanied by djembe rhythms.",
      "location_fr": "Langue de Barbarie, Desert de Lompoul",
      "location_en": "Langue de Barbarie, Lompoul Desert",
      "accommodation_fr": "Campement de charme, tente mauritanienne",
      "accommodation_en": "Charming camp, Mauritanian-style tent",
      "meals_fr": "Petit-dejeuner, Dejeuner, Diner",
      "meals_en": "Breakfast, Lunch, Dinner"
    },
    {
      "day": 6,
      "title_fr": "Lompoul - Touba - Kaolack - Toubacouta",
      "title_en": "Lompoul - Touba - Kaolack - Toubacouta",
      "description_fr": "Depart vers les iles du Saloum avec escale a Touba, haut lieu spirituel du pays. Decouverte de la majestueuse Grande Mosquee de Touba, centre de la confrerie des Mourides, l''une des plus influentes du Senegal. Poursuite a travers les paysages du centre du pays jusqu''a Kaolack, dejeuner au Relais de Kaolack. Route vers le Delta du Saloum. Arrivee a Toubacouta, village au coeur de la mangrove. Installation a l''hotel Keur Saloum. Excursion en pirogue : decouverte du Diorom Boumag, impressionnant amas coquillier, puis visite du reposoir des oiseaux ou des milliers d''aigrettes, cormorans, martins-pecheurs et pelicans se rassemblent sur les paletuviers. Diner et nuit.",
      "description_en": "Departure toward the Saloum Islands with a stop in Touba, the country''s spiritual heartland. Discover the majestic Great Mosque of Touba, center of the Mouride brotherhood, one of the most influential in Senegal. Continue through the central country landscapes to Kaolack, lunch at Relais de Kaolack. Drive to the Saloum Delta. Arrive in Toubacouta, a village in the heart of the mangrove. Check into Keur Saloum hotel. Pirogue excursion: discover Diorom Boumag, an impressive shell mound, then visit the bird roost where thousands of egrets, cormorants, kingfishers and pelicans gather on the mangrove trees. Dinner and overnight.",
      "location_fr": "Touba, Kaolack, Toubacouta",
      "location_en": "Touba, Kaolack, Toubacouta",
      "accommodation_fr": "Hotel Keur Saloum, Toubacouta",
      "accommodation_en": "Keur Saloum Hotel, Toubacouta",
      "meals_fr": "Petit-dejeuner, Dejeuner, Diner",
      "meals_en": "Breakfast, Lunch, Dinner"
    },
    {
      "day": 7,
      "title_fr": "Parc du Delta du Saloum - Ile de Sipo",
      "title_en": "Saloum Delta Park - Sipo Island",
      "description_fr": "Excursion en pirogue au coeur du Parc National du Delta du Saloum, classe Reserve mondiale de biosphere. Navigation a travers un dedale de bolongs bordes de paletuviers. Rencontre avec cueilleuses d''huitres et pecheurs, observation d''oiseaux dans la mangrove. Cap sur l''ile de Sipo, village authentique de huttes traditionnelles en paille. Installation au campement ecologique Les Terrasses de Sipo avec vue sur la mangrove et le bolong du Bandiala. Dejeuner barbecue de poisson et salades. Apres-midi detente : baignade dans les eaux calmes du bolong, observation de la faune (singes, phacochere, varans, mangoustes, oiseaux) depuis un mirador. Derniere soiree africaine rythmee et chaleureuse. Diner et nuit.",
      "description_en": "Pirogue excursion in the heart of the Saloum Delta National Park, a World Biosphere Reserve. Navigate through a maze of creeks bordered by mangrove trees. Meet oyster gatherers and fishermen, observe birds in the mangrove. Head to Sipo Island, an authentic village of traditional thatched huts. Check into Les Terrasses de Sipo ecological camp with views of the mangrove and Bandiala creek. Fish barbecue lunch with salads. Afternoon relaxation: swim in the calm warm creek waters, wildlife watching (monkeys, warthogs, monitor lizards, mongooses, birds) from a lookout. Final African evening with warm rhythmic ambiance. Dinner and overnight.",
      "location_fr": "Delta du Saloum, Ile de Sipo",
      "location_en": "Saloum Delta, Sipo Island",
      "accommodation_fr": "Les Terrasses de Sipo, campement ecologique",
      "accommodation_en": "Les Terrasses de Sipo, ecological camp",
      "meals_fr": "Petit-dejeuner, Dejeuner, Diner",
      "meals_en": "Breakfast, Lunch, Dinner"
    },
    {
      "day": 8,
      "title_fr": "Toubacouta - Marche - Saly - Depart",
      "title_en": "Toubacouta - Market - Saly - Departure",
      "description_fr": "Apres le dejeuner, depart vers un marche hebdomadaire de la region : Sokone (mercredi), Passy (samedi), Touba Nding (jeudi) ou Touba Mouride (dimanche). Ces marches sont de veritables carrefours d''echanges reunissant marchands, cultivateurs, maralchers, pecheurs et eleveurs. Marche du betail avec zebus, moutons, chevres et chevaux. Ambiance vivante et coloree avec boubous eclatants et marchandage anime. Route vers Saly, station balneaire face a l''ocean Atlantique, pour une derniere pause detente. Transfert a l''aeroport quatre heures avant le vol retour.",
      "description_en": "After lunch, departure to a regional weekly market: Sokone (Wednesday), Passy (Saturday), Touba Nding (Thursday) or Touba Mouride (Sunday). These markets are true crossroads of exchange gathering merchants, farmers, market gardeners, fishermen and herders. Livestock market with zebus, sheep, goats and horses. Lively and colorful atmosphere with vibrant boubous and animated bargaining. Drive to Saly, a seaside resort facing the Atlantic Ocean, for a final relaxation stop. Airport transfer four hours before return flight.",
      "location_fr": "Toubacouta, Saly, Aeroport",
      "location_en": "Toubacouta, Saly, Airport",
      "accommodation_fr": "",
      "accommodation_en": "",
      "meals_fr": "Petit-dejeuner, Dejeuner",
      "meals_en": "Breakfast, Lunch"
    }
  ]'::jsonb,
  '["Hebergement dans les hotels mentionnes ou similaires", "Pension complete (du dejeuner du jour 1 au dejeuner du jour 6)", "Vehicule avec carburant, chauffeur et guide selon le nombre de personnes", "Tous les frais du guide et/ou chauffeur", "Toutes les excursions mentionnees et droits de visite", "Guide parlant francais ou anglais, autres langues sur demande"]'::jsonb,
  '["Accommodation in mentioned hotels or similar", "Full board (from lunch on day 1 to lunch on day 6)", "Vehicle with fuel, driver and guide according to group size", "All guide and/or driver fees", "All mentioned excursions and entrance fees", "French or English speaking guide, other languages on request"]'::jsonb,
  'Hotels, lodges et campements ecologiques',
  'Hotels, lodges and ecological camps',
  2,
  50,
  1029920,
  'per person (base 2 persons)',
  'par personne (base 2 personnes)',
  true,
  9
);