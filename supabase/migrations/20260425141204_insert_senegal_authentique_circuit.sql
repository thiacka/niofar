/*
  # Insert "Senegal Authentique" circuit

  1. New Data
    - Adds a new 6-day/5-night circuit: "Senegal Authentique"
    - Subtitle: "Entre cascades, safaris et mangroves, vivez l'essence du Senegal"
    - Covers: Saly, Wassadou, Niokolo-Koba, Kedougou, Iwol, Dindefelo, Tomboronkoto, Mako, Tambacounda, Kaolack, Toubacouta, Delta du Saloum, Fathala Reserve
    - 6-day itinerary stored in JSONB format
    - Bilingual content (French and English)
    - Price: 816,720 FCFA (~1245 EUR) per person base 2 persons

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
  'senegal-authentique',
  'https://images.pexels.com/photos/14604774/pexels-photo-14604774.jpeg?auto=compress&cs=tinysrgb&w=1260',
  '6 days / 5 nights',
  '6 jours / 5 nuits',
  6,
  'Authentic Senegal',
  'Senegal Authentique',
  'Cradle of great kingdoms and crossroads of civilizations, Senegal is a land where history blends intimately with landscapes and living traditions. From the ancient empires of Tekrour and Djolof to the influences of trans-Saharan trade, the country has been shaped through exchanges, migrations and rich, diverse cultural heritages. But beyond the great cities and Atlantic coasts, it is in eastern Senegal that one of the most authentic hearts of the country beats. The Kedougou region, long overlooked by classic circuits, reveals a rawer, more intimate face, where nature still sets the pace and ancestral traditions remain deeply rooted. Here live the Bedik and Bassari communities, guardians of ways of life inherited from centuries of history, often linked to ancient migrations from the Fouta-Djalon foothills. Their perched villages, their rites and their close relationship with the land tell another story of Senegal — one of cultural resistance and harmony with nature. Between the Bassari Country reliefs, classified forests and savannas of Niokolo-Koba National Park, a UNESCO World Heritage Site, this region offers a rare immersion in a preserved environment, refuge of exceptional biodiversity. This journey invites you to travel back in time and cross the contrasting landscapes of Senegal, from the red earth of the East to the mangroves of the Saloum Delta, another major historical and ecological site. More than a simple circuit, "Authentic Senegal" is a human and sensory experience, an encounter with the living history of a country proud of its roots.',
  'Berceau de grands royaumes et carrefour de civilisations, le Senegal est une terre ou l''histoire se mele intimement aux paysages et aux traditions vivantes. Des anciens empires du Tekrour et du Djolof jusqu''aux influences du commerce transsaharien, le pays s''est construit au fil des echanges, des migrations et des heritages culturels riches et diversifies. Mais au-dela des grandes villes et des cotes atlantiques, c''est dans le Senegal oriental que bat l''un des coeurs les plus authentiques du pays. La region de Kedougou, longtemps restee en marge des circuits classiques, devoile un visage plus brut, plus intime, ou la nature impose encore son rythme et ou les traditions ancestrales demeurent profondement enracinees. Ici vivent notamment les communautes Bedik et Bassari, gardiennes de modes de vie herites de siecles d''histoire, souvent lies aux migrations anciennes venues des contreforts du Fouta-Djalon. Leurs villages perches, leurs rites et leur relation etroite a la terre racontent une autre histoire du Senegal — celle de la resistance culturelle et de l''harmonie avec la nature. Entre les reliefs du pays Bassari, les forets classees et les savanes du Parc national du Niokolo-Koba, classe au patrimoine mondial de l''UNESCO, cette region offre une immersion rare dans un environnement preserve, refuge d''une biodiversite exceptionnelle. Ce voyage vous invite a remonter le temps et a traverser les paysages contrastes du Senegal, des terres rouges de l''Est jusqu''aux mangroves du Delta du Saloum, autre haut lieu historique et ecologique. Plus qu''un simple circuit, "Senegal Authentique" est une experience humaine et sensorielle, une rencontre avec l''histoire vivante d''un pays fier de ses racines.',
  ARRAY[
    'Niokolo-Koba National Park - UNESCO World Heritage safari',
    'Kedougou - mountainous landscapes of eastern Senegal',
    'Iwol Bedik village - perched ancestral village',
    'Dindefelo Waterfall - 80m spectacular cascade',
    'Tomboronkoto - traditional gold panning',
    'Gambia River - hippo observation at Mako & Wassadou',
    'Saloum Delta - pirogue through mangroves & bird roosts',
    'Fathala Reserve - walk with lions experience',
    'Wassadou - baboon colony & banana plantation',
    'Traditional picnic lunches in nature'
  ],
  ARRAY[
    'Parc national du Niokolo-Koba - safari patrimoine mondial UNESCO',
    'Kedougou - paysages montagneux du Senegal oriental',
    'Village Bedik d''Iwol - village ancestral perche',
    'Cascade de Dindefelo - chute spectaculaire de 80m',
    'Tomboronkoto - orpaillage traditionnel',
    'Fleuve Gambie - observation des hippopotames a Mako & Wassadou',
    'Delta du Saloum - pirogue dans les mangroves & reposoirs d''oiseaux',
    'Reserve de Fathala - marche avec les lions',
    'Wassadou - colonie de babouins & bananeraie',
    'Dejeuners pique-nique en pleine nature'
  ],
  '[
    {
      "day": 1,
      "title_fr": "Saly - Portes du Niokolo-Koba (Wassadou)",
      "title_en": "Saly - Gates of Niokolo-Koba (Wassadou)",
      "description_fr": "Depart de Saly a travers la steppe arbustive, ecosysteme emblematique du Senegal. Halte au Relais de Tambacounda. Poursuite vers Wassadou, ecrin de biodiversite en bordure du fleuve Gambie et aux portes du Parc national du Niokolo-Koba. Installation a l''Hotel Wassadou, cases traditionnelles confortables ouvertes sur l''environnement. Balade le long des berges jusqu''a une bananeraie luxuriante, observation des hippopotames et singes dans leur habitat naturel. Au coucher du soleil, spectacle unique autour des grands fromagers, refuge d''une colonie de babouins. Diner et nuit dans le calme du campement, berces par les sons de la nature.",
      "description_en": "Departure from Saly through the shrubby steppe, an iconic Senegalese ecosystem. Stop at Relais de Tambacounda. Continue to Wassadou, a haven of biodiversity on the banks of the Gambia River and at the gates of Niokolo-Koba National Park. Check into Hotel Wassadou, comfortable traditional huts open to the environment. Walk along the riverbanks to a lush banana plantation, observe hippos and monkeys in their natural habitat. At sunset, a unique spectacle around the great kapok trees, home to a baboon colony. Dinner and overnight in the camp''s absolute calm, lulled by the sounds of nature.",
      "location_fr": "Saly, Tambacounda, Wassadou",
      "location_en": "Saly, Tambacounda, Wassadou",
      "accommodation_fr": "Hotel Wassadou, cases traditionnelles",
      "accommodation_en": "Hotel Wassadou, traditional huts",
      "meals_fr": "Dejeuner, Diner",
      "meals_en": "Lunch, Dinner"
    },
    {
      "day": 2,
      "title_fr": "Wassadou - Parc Niokolo-Koba - Kedougou",
      "title_en": "Wassadou - Niokolo-Koba Park - Kedougou",
      "description_fr": "Depart aux premieres lueurs du jour pour un safari inoubliable au coeur du Parc national du Niokolo-Koba, classe au patrimoine mondial de l''UNESCO. Accompagne d''un guide animalier experimente, decouverte d''une faune exceptionnelle : phacochere, antilopes, singes et grande diversite d''oiseaux. Possibilite d''apercevoir lions ou pantheres. Dejeuner pique-nique en pleine nature. Balade a pied le long du fleuve Gambie au village de Mako pour observer les hippopotames. Continuation vers la region montagneuse de Kedougou aux paysages spectaculaires. Installation a l''Hotel Bedik. Diner et nuit a l''hotel.",
      "description_en": "Early morning departure for an unforgettable safari in the heart of Niokolo-Koba National Park, a UNESCO World Heritage Site. Accompanied by an experienced wildlife guide, discover exceptional fauna: warthogs, antelopes, monkeys and a great diversity of birds. Chance to spot lions or leopards. Picnic lunch in the wild. Walk along the Gambia River at Mako village to observe hippos. Continue to the mountainous Kedougou region with spectacular landscapes. Check into Hotel Bedik. Dinner and overnight at the hotel.",
      "location_fr": "Parc Niokolo-Koba, Mako, Kedougou",
      "location_en": "Niokolo-Koba Park, Mako, Kedougou",
      "accommodation_fr": "Hotel Bedik, Kedougou",
      "accommodation_en": "Hotel Bedik, Kedougou",
      "meals_fr": "Petit-dejeuner, Dejeuner pique-nique, Diner",
      "meals_en": "Breakfast, Picnic lunch, Dinner"
    },
    {
      "day": 3,
      "title_fr": "Kedougou - Iwol - Dindefelo - Kedougou",
      "title_en": "Kedougou - Iwol - Dindefelo - Kedougou",
      "description_fr": "Decouverte de l''ethnie Bedik et ascension vers le village perche d''Iwol (environ 2h30 aller-retour, possibilite de faire une partie en vehicule). Plongee dans le mode de vie bedik et panorama exceptionnel sur les paysages environnants. Piste vers le village peul de Dindefelo au coeur d''une nature luxuriante. Randonnee a travers une vegetation dense et petits ruisseaux jusqu''a la spectaculaire Cascade de Dindefelo, haute d''environ 80 metres, avec bassin naturel propice a la baignade. Dejeuner pique-nique au pied de la cascade dans un cadre rafraichissant. Retour a Kedougou, installation a l''Hotel Bedik. Diner et nuit.",
      "description_en": "Discover the Bedik ethnic group and climb to the perched village of Iwol (approximately 2h30 round trip, with option for partial vehicle transport). Immerse yourself in the Bedik way of life and enjoy exceptional panoramic views of surrounding landscapes. Track to the Fulani village of Dindefelo in the heart of lush nature. Hike through dense vegetation and small streams to the spectacular Dindefelo Waterfall, approximately 80 meters high, with a natural pool perfect for swimming. Picnic lunch at the foot of the waterfall in a refreshing setting. Return to Kedougou, check into Hotel Bedik. Dinner and overnight.",
      "location_fr": "Iwol, Dindefelo, Kedougou",
      "location_en": "Iwol, Dindefelo, Kedougou",
      "accommodation_fr": "Hotel Bedik, Kedougou",
      "accommodation_en": "Hotel Bedik, Kedougou",
      "meals_fr": "Petit-dejeuner, Dejeuner pique-nique, Diner",
      "meals_en": "Breakfast, Picnic lunch, Dinner"
    },
    {
      "day": 4,
      "title_fr": "Kedougou - Tomboronkoto - Mako - Tambacounda",
      "title_en": "Kedougou - Tomboronkoto - Mako - Tambacounda",
      "description_fr": "Depart de Kedougou vers Tomboronkoto, village emblematique de l''orpaillage au Senegal. Decouverte des sites d''exploitation artisanale ou l''or est extrait selon des methodes traditionnelles, regard authentique sur le quotidien des orpailleurs. Poursuite vers le village de Mako en bordure du fleuve Gambie. Dejeuner sur place dans un cadre naturel agreable. Continuation vers Tambacounda a travers les paysages typiques de l''est senegalais. Installation au Relais de Tambacounda. Diner et nuit a l''hotel.",
      "description_en": "Departure from Kedougou to Tomboronkoto, an iconic gold panning village in Senegal. Discover the artisanal mining sites where gold is extracted using traditional methods, an authentic look at the daily life of gold panners. Continue to the village of Mako on the banks of the Gambia River. Lunch on site in a pleasant natural setting. Drive on to Tambacounda through typical eastern Senegalese landscapes. Check into Relais de Tambacounda. Dinner and overnight at the hotel.",
      "location_fr": "Tomboronkoto, Mako, Tambacounda",
      "location_en": "Tomboronkoto, Mako, Tambacounda",
      "accommodation_fr": "Relais de Tambacounda",
      "accommodation_en": "Relais de Tambacounda",
      "meals_fr": "Petit-dejeuner, Dejeuner, Diner",
      "meals_en": "Breakfast, Lunch, Dinner"
    },
    {
      "day": 5,
      "title_fr": "Tambacounda - Kaolack - Toubacouta",
      "title_en": "Tambacounda - Kaolack - Toubacouta",
      "description_fr": "Depart vers le Delta du Saloum, l''une des plus belles regions naturelles du Senegal, reputee pour ses paysages de mangroves et sa biodiversite exceptionnelle. Arret a Kaolack pour le dejeuner au Relais de Kaolack. Poursuite vers Toubacouta, porte d''entree du Delta du Saloum, avec ses nombreux bolongs serpentant a travers les mangroves. Installation a l''hotel Keur Saloum, lodge niche en pleine nature avec vue sur cet environnement d''exception. Diner et nuit a l''hotel, dans une atmosphere paisible bercee par les sons de la nature.",
      "description_en": "Departure toward the Saloum Delta, one of Senegal''s most beautiful natural regions, renowned for its mangrove landscapes and exceptional biodiversity. Stop in Kaolack for lunch at Relais de Kaolack. Continue to Toubacouta, gateway to the Saloum Delta, with its many creeks winding through the mangroves. Check into Keur Saloum hotel, a lodge nestled in nature with views of this exceptional environment. Dinner and overnight at the hotel, in a peaceful atmosphere lulled by the sounds of nature.",
      "location_fr": "Tambacounda, Kaolack, Toubacouta",
      "location_en": "Tambacounda, Kaolack, Toubacouta",
      "accommodation_fr": "Hotel Keur Saloum, Toubacouta",
      "accommodation_en": "Keur Saloum Hotel, Toubacouta",
      "meals_fr": "Petit-dejeuner, Dejeuner, Diner",
      "meals_en": "Breakfast, Lunch, Dinner"
    },
    {
      "day": 6,
      "title_fr": "Toubacouta - Reserve de Fathala - Saly",
      "title_en": "Toubacouta - Fathala Reserve - Saly",
      "description_fr": "Excursion en pirogue traditionnelle a travers les bolongs bordes de mangroves jusqu''aux reposoirs d''oiseaux, sanctuaires naturels abritant une grande diversite d''especes. Retour a Keur Saloum et dejeuner dans ce cadre naturel apaisant. Dans l''apres-midi, experience inoubliable a la Reserve de Fathala : au coeur de pres de 6 000 hectares de foret, vivez l''emotion unique d''une marche avec les lions, encadree par des guides specialises, dans des conditions strictement securisees. En fin de journee, route vers Saly avec des souvenirs forts d''une journee riche en emotions.",
      "description_en": "Traditional pirogue excursion through mangrove-lined creeks to the bird roosts, natural sanctuaries home to a great diversity of species. Return to Keur Saloum and lunch in this soothing natural setting. In the afternoon, an unforgettable experience at Fathala Reserve: in the heart of nearly 6,000 hectares of forest, live the unique emotion of a walk with lions, supervised by specialized guides in strictly secured conditions. At the end of the day, drive to Saly with strong memories of a day rich in emotions.",
      "location_fr": "Toubacouta, Reserve de Fathala, Saly",
      "location_en": "Toubacouta, Fathala Reserve, Saly",
      "accommodation_fr": "",
      "accommodation_en": "",
      "meals_fr": "Petit-dejeuner, Dejeuner",
      "meals_en": "Breakfast, Lunch"
    }
  ]'::jsonb,
  '["Hebergement dans les hotels mentionnes ou similaires", "Pension complete (du dejeuner du jour 1 au dejeuner du jour 6)", "Vehicule avec carburant, chauffeur et guide selon le nombre de personnes", "Tous les frais du guide et/ou chauffeur", "Toutes les excursions mentionnees et droits de visite", "Guide parlant francais ou anglais, autres langues sur demande"]'::jsonb,
  '["Accommodation in mentioned hotels or similar", "Full board (from lunch on day 1 to lunch on day 6)", "Vehicle with fuel, driver and guide according to group size", "All guide and/or driver fees", "All mentioned excursions and entrance fees", "French or English speaking guide, other languages on request"]'::jsonb,
  'Hotels et campements',
  'Hotels and camps',
  2,
  50,
  816720,
  'per person (base 2 persons)',
  'par personne (base 2 personnes)',
  true,
  11
);