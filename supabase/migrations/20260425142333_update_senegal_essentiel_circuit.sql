/*
  # Update "Senegal Essentiel" circuit

  1. Modified Table: `circuits`
    - Updates existing circuit with slug 'senegal-essentials'
    - New title: "Senegal Essentiel" (FR) / "Essential Senegal" (EN)
    - Completely rewritten descriptions in both languages
    - Updated highlights to reflect new itinerary content
    - Full 5-day itinerary rewritten with detailed day-by-day descriptions
    - New specific accommodations: Chez Salim, Residence Hote, Lodge des Almadies
    - Updated included services
    - Price updated from 450,000 to 667,808 FCFA (~1018 EUR base 2 persons)

  2. No schema changes
*/

UPDATE circuits
SET
  title_fr = 'Senegal Essentiel',
  title_en = 'Essential Senegal',
  description_fr = 'Carrefour historique de l''Afrique de l''Ouest, le Senegal s''est faconne au fil des siecles au croisement des grands empires saheliens, du commerce transsaharien et des influences coloniales. Terre de royaumes anciens comme le Djolof, il a longtemps ete un espace d''echanges, de migrations et de rencontres culturelles qui ont profondement marque son identite. Aujourd''hui encore, cette richesse historique se reflete dans ses villes, ses traditions et ses paysages contrastes, entre Atlantique, savanes et reserves naturelles. Decouvrez les essentiels du Senegal a travers un voyage court mais intense, qui vous mene de la capitale dynamique Dakar aux sites historiques de l''Ile de Goree, en passant par des reserves naturelles exceptionnelles et des paysages emblematiques. Ce circuit de 5 jours et 4 nuits est une immersion complete au coeur de l''histoire, de la culture et de la nature senegalaise, ideale pour une premiere decouverte du pays.',
  description_en = 'A historical crossroads of West Africa, Senegal has been shaped over centuries at the intersection of great Sahelian empires, trans-Saharan trade and colonial influences. Land of ancient kingdoms like Djolof, it has long been a space of exchanges, migrations and cultural encounters that have profoundly marked its identity. Even today, this historical richness is reflected in its cities, traditions and contrasting landscapes, between the Atlantic, savannas and nature reserves. Discover the essentials of Senegal through a short but intense journey, taking you from the dynamic capital Dakar to the historic sites of Goree Island, passing through exceptional nature reserves and iconic landscapes. This 5-day, 4-night circuit is a complete immersion into the heart of Senegalese history, culture and nature, ideal for a first discovery of the country.',
  highlights_fr = ARRAY[
    'Lac Rose - dunes en 4x4, recolte de sel & flottaison',
    'Saint-Louis - patrimoine mondial UNESCO, balade en caleche',
    'Parc national du Djoudj - sanctuaire ornithologique mondial',
    'Ngaye Mekhe - capitale du cuir, ateliers artisanaux',
    'Thies - vannerie traditionnelle',
    'Reserve de Bandia - safari avec girafes, rhinoceros, buffles',
    'Dakar - visite guidee, marche Kermel, Soumbedioune',
    'Ile de Goree - Maison des Esclaves, patrimoine UNESCO',
    'Monument de la Renaissance africaine'
  ],
  highlights_en = ARRAY[
    'Pink Lake - 4x4 dunes, salt harvesting & floating experience',
    'Saint-Louis - UNESCO World Heritage, horse-drawn carriage tour',
    'Djoudj National Park - world-class bird sanctuary',
    'Ngaye Mekhe - leather capital, artisan workshops',
    'Thies - traditional basket weaving',
    'Bandia Reserve - safari with giraffes, rhinos, buffaloes',
    'Dakar - guided city tour, Kermel market, Soumbedioune',
    'Goree Island - House of Slaves, UNESCO heritage',
    'African Renaissance Monument'
  ],
  itinerary = '[
    {
      "day": 1,
      "title_fr": "Aeroport - Lac Rose",
      "title_en": "Airport - Pink Lake",
      "description_fr": "Accueil a l''aeroport et transfert au campement Chez Salim au Lac Rose (environ 80 km / 1 heure). Installation, diner et nuitee sur place.",
      "description_en": "Welcome at the airport and transfer to Chez Salim camp at the Pink Lake (approximately 80 km / 1 hour). Check-in, dinner and overnight stay.",
      "location_fr": "Lac Rose",
      "location_en": "Pink Lake",
      "accommodation_fr": "Campement Chez Salim",
      "accommodation_en": "Chez Salim Camp",
      "meals_fr": "Diner",
      "meals_en": "Dinner"
    },
    {
      "day": 2,
      "title_fr": "Lac Rose - Saint-Louis",
      "title_en": "Pink Lake - Saint-Louis",
      "description_fr": "Apres le petit-dejeuner au campement Chez Salim, immersion au coeur du mythique Lac Rose. Rencontre authentique avec les ramasseurs de sel, tradition ancestrale dans ce lac aux teintes changeantes, celebre comme derniere etape du legendaire Rallye Paris-Dakar. Aventure en 4x4 a la conquete des dunes de sable bordant le lac, entre pistes sablonneuses et paysages vierges evoquant l''esprit du Paris-Dakar. Excursion jusqu''a la magnifique Grande Cote, ou l''ocean Atlantique s''ecrase sur une plage infinie et preservee. Possibilite de baignade ou experience de flottaison dans les eaux salees du lac. Dejeuner au Bonaba Cafe avec vue panoramique sur le lac. Depart pour Saint-Louis, ville au riche heritage historique classee au patrimoine mondial de l''UNESCO. Installation, diner et nuitee a Residence Hote.",
      "description_en": "After breakfast at Chez Salim camp, immersion in the heart of the mythical Pink Lake. Authentic encounter with salt collectors, an ancestral tradition in this lake with changing hues, famous as the final stop of the legendary Paris-Dakar Rally. 4x4 adventure conquering the sand dunes bordering the lake, between sandy tracks and virgin landscapes evoking the spirit of the Paris-Dakar. Excursion to the magnificent Grande Cote, where the Atlantic Ocean crashes on an infinite preserved beach. Opportunity for swimming or floating experience in the salty lake waters. Lunch at Bonaba Cafe with panoramic views of the lake. Departure for Saint-Louis, a city with rich historical heritage listed as UNESCO World Heritage. Check-in, dinner and overnight at Residence Hote.",
      "location_fr": "Lac Rose, Grande Cote, Saint-Louis",
      "location_en": "Pink Lake, Grande Cote, Saint-Louis",
      "accommodation_fr": "Residence Hote, Saint-Louis",
      "accommodation_en": "Residence Hote, Saint-Louis",
      "meals_fr": "Petit-dejeuner, Dejeuner, Diner",
      "meals_en": "Breakfast, Lunch, Dinner"
    },
    {
      "day": 3,
      "title_fr": "Saint-Louis - Djoudj",
      "title_en": "Saint-Louis - Djoudj",
      "description_fr": "Depart matinal vers le Parc national des oiseaux du Djoudj (environ 60 km au nord), classe au patrimoine mondial de l''UNESCO. Sanctuaire ornithologique exceptionnel accueillant chaque annee des millions d''oiseaux migrateurs apres la traversee du Sahara : pelicans, flamants roses, cormorans et aigles pecheurs. Visite en pirogue a travers les marigots et roselieres, observation de crocodiles, varans, phacochere et chacals. Dejeuner au restaurant du parc. Retour a Saint-Louis et balade en caleche : passage par le Pont Faidherbe, les elegantes demeures historiques et le quartier de Guet Ndar avec ses pirogues colorees. Diner et nuit a l''hotel. Option basse saison (mi-mai a mi-octobre) : excursion au Parc national de la Langue de Barbarie, etroite bande de sable de 20 km separant le fleuve de l''ocean, avec balade en pirogue, observation d''oiseaux et promenade sur plage sauvage.",
      "description_en": "Early morning departure for Djoudj National Bird Park (approximately 60 km north), a UNESCO World Heritage Site. Exceptional bird sanctuary welcoming millions of migratory birds each year after crossing the Sahara: pelicans, flamingos, cormorants and fish eagles. Pirogue tour through creeks and reed beds, observation of crocodiles, monitor lizards, warthogs and jackals. Lunch at the park restaurant. Return to Saint-Louis and horse-drawn carriage tour: Faidherbe Bridge, elegant historic mansions and the Guet Ndar district with its colorful pirogues. Dinner and overnight at hotel. Low season option (mid-May to mid-October): excursion to Langue de Barbarie National Park, a narrow 20 km sand strip separating the river from the ocean, with pirogue ride, bird watching and walk on wild beach.",
      "location_fr": "Parc du Djoudj, Saint-Louis",
      "location_en": "Djoudj Park, Saint-Louis",
      "accommodation_fr": "Residence Hote, Saint-Louis",
      "accommodation_en": "Residence Hote, Saint-Louis",
      "meals_fr": "Petit-dejeuner, Dejeuner, Diner",
      "meals_en": "Breakfast, Lunch, Dinner"
    },
    {
      "day": 4,
      "title_fr": "Saint-Louis - Reserve de Bandia - Dakar",
      "title_en": "Saint-Louis - Bandia Reserve - Dakar",
      "description_fr": "Depart de Saint-Louis en direction de Ngaye Mekhe, reputee capitale du cuir au Senegal. Decouverte du savoir-faire des artisans locaux, specialises dans la confection de chaussures et articles en cuir faits main. Arret a Thies, capitale du rail, pour la visite de la vannerie : art du tressage et fabrication artisanale de paniers et objets du quotidien transmis de generation en generation. Continuation vers la Reserve de Bandia. Dejeuner au restaurant du parc avec vue sur un point d''eau frequente par la faune sauvage. Safari dans la reserve de plus de 3 500 hectares, composee de baobabs et d''acacias : girafes, rhinoceros, buffles, antilopes, zebres, crocodiles, hyenes, tortues et singes. En fin de journee, route vers Dakar et installation au Lodge des Almadies. Diner et nuit a l''hotel.",
      "description_en": "Departure from Saint-Louis toward Ngaye Mekhe, renowned as Senegal''s leather capital. Discover local artisans'' expertise in handcrafting shoes and leather goods. Stop in Thies, the railway capital, to visit basket-weaving workshops: the art of braiding and handcrafting baskets and everyday objects passed down through generations. Continue to Bandia Reserve. Lunch at the park restaurant overlooking a waterhole frequented by wildlife. Safari through the reserve of over 3,500 hectares of baobabs and acacias: giraffes, rhinos, buffaloes, antelopes, zebras, crocodiles, hyenas, tortoises and monkeys. At the end of the day, drive to Dakar and check into Lodge des Almadies. Dinner and overnight at the hotel.",
      "location_fr": "Ngaye Mekhe, Thies, Reserve de Bandia, Dakar",
      "location_en": "Ngaye Mekhe, Thies, Bandia Reserve, Dakar",
      "accommodation_fr": "Lodge des Almadies, Dakar",
      "accommodation_en": "Lodge des Almadies, Dakar",
      "meals_fr": "Petit-dejeuner, Dejeuner, Diner",
      "meals_en": "Breakfast, Lunch, Dinner"
    },
    {
      "day": 5,
      "title_fr": "Dakar - Goree - Aeroport",
      "title_en": "Dakar - Goree - Airport",
      "description_fr": "Visite guidee de Dakar : corniche avec vues sur l''ocean Atlantique, Place de l''Independance, hotel de ville, gare historique, cathedrale et Palais presidentiel. Visite du marche Kermel (architecture coloniale, etals colores) et du village artisanal de Soumbedioune. Traversee en ferry vers l''Ile de Goree (environ 30 minutes), classee au patrimoine mondial de l''UNESCO. Ancien haut lieu de la traite negriere, visite de la celebre Maison des Esclaves, du musee historique et des ruelles fleuries bordees de maisons coloniales. Dejeuner au restaurant Chez Tonton sur l''ile, temps libre pour flaner jusqu''au sommet du promontoire et admirer la vue sur la baie de Dakar. Retour en chaloupe vers Dakar. Passage par la corniche en longeant la mosquee de Ouakam et les iles de la Madeleine, arret au Monument de la Renaissance africaine avec possibilite d''ascension pour vue panoramique. Transfert a l''aeroport selon l''horaire de depart.",
      "description_en": "Guided tour of Dakar: corniche with Atlantic Ocean views, Independence Square, city hall, historic train station, cathedral and Presidential Palace. Visit Kermel market (colonial architecture, colorful stalls) and the artisan village of Soumbedioune. Ferry crossing to Goree Island (approximately 30 minutes), a UNESCO World Heritage Site. Former major slave trade site, visit the famous House of Slaves, the historical museum and the flower-lined alleys bordered by colonial houses. Lunch at Chez Tonton restaurant on the island, free time to stroll to the promontory summit and admire the view of Dakar Bay. Return by boat to Dakar. Drive along the corniche past the Ouakam mosque and Madeleine Islands, stop at the African Renaissance Monument with option to climb for panoramic views. Transfer to airport according to departure schedule.",
      "location_fr": "Dakar, Ile de Goree",
      "location_en": "Dakar, Goree Island",
      "accommodation_fr": "",
      "accommodation_en": "",
      "meals_fr": "Petit-dejeuner, Dejeuner",
      "meals_en": "Breakfast, Lunch"
    }
  ]'::jsonb,
  included_services_fr = '["Hebergement dans les hotels mentionnes ou similaires", "Pension complete (du diner du jour 1 au dejeuner du jour 5)", "Vehicule avec carburant, chauffeur et guide selon le nombre de personnes", "Tous les frais du guide et/ou chauffeur", "Toutes les excursions mentionnees et droits de visite", "Guide parlant francais ou anglais, autres langues sur demande"]'::jsonb,
  included_services_en = '["Accommodation in mentioned hotels or similar", "Full board (from dinner on day 1 to lunch on day 5)", "Vehicle with fuel, driver and guide according to group size", "All guide and/or driver fees", "All mentioned excursions and entrance fees", "French or English speaking guide, other languages on request"]'::jsonb,
  accommodation_type_fr = 'Campement, hotels et lodge',
  accommodation_type_en = 'Camp, hotels and lodge',
  price = 667808,
  price_note_fr = 'par personne (base 2 personnes)',
  price_note_en = 'per person (base 2 persons)',
  updated_at = now()
WHERE id = '6883af07-f783-4904-bb24-e86387f2360e';
