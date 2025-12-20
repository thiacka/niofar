import { Injectable, signal, computed } from '@angular/core';

export type Language = 'en' | 'fr';

interface Translations {
  [key: string]: {
    en: string;
    fr: string;
  };
}

const translations: Translations = {
  'nav.home': { en: 'Home', fr: 'Accueil' },
  'nav.about': { en: 'About', fr: 'A propos' },
  'nav.services': { en: 'Services', fr: 'Services' },
  'nav.experiences': { en: 'Experiences', fr: 'Experiences' },
  'nav.why': { en: 'Why NIO FAR', fr: 'Pourquoi NIO FAR' },
  'nav.contact': { en: 'Contact', fr: 'Contact' },
  'nav.circuits': { en: 'Tours & Discovery', fr: 'Circuits & Decouvertes' },

  'hero.title': { en: 'Discover the Real Senegal', fr: 'Decouvrez le vrai Senegal' },
  'hero.subtitle': { en: 'Authentic travel experiences, human encounters and unforgettable memories.', fr: 'Experiences de voyage authentiques, rencontres humaines et souvenirs inoubliables.' },
  'hero.cta': { en: 'Book your experience', fr: 'Reservez votre experience' },

  'home.intro.title': { en: 'Welcome to NIO FAR', fr: 'Bienvenue chez NIO FAR' },
  'home.intro.text': { en: 'NIO FAR - which means "We are together" in Wolof - is a local travel agency passionate about Senegal, its people, its culture and its landscapes. We help you discover the real Senegal through authentic, respectful and meaningful experiences.', fr: 'NIO FAR - qui signifie "Nous sommes ensemble" en Wolof - est une agence de voyage locale passionnee par le Senegal, ses habitants, sa culture et ses paysages. Nous vous aidons a decouvrir le vrai Senegal a travers des experiences authentiques, respectueuses et enrichissantes.' },

  'home.services.title': { en: 'Our Services', fr: 'Nos Services' },
  'home.services.excursions': { en: 'Tailor-made excursions', fr: 'Excursions sur mesure' },
  'home.services.excursions.desc': { en: 'Explore villages, markets, artisans, national parks and iconic sites.', fr: 'Explorez villages, marches, artisans, parcs nationaux et sites emblematiques.' },
  'home.services.transfers': { en: 'Airport transfers', fr: 'Transferts aeroport' },
  'home.services.transfers.desc': { en: 'Reliable, safe and comfortable transfers with professional drivers.', fr: 'Transferts fiables, securises et confortables avec des chauffeurs professionnels.' },
  'home.services.accommodation': { en: 'Accommodation booking', fr: 'Reservation d\'hebergements' },
  'home.services.accommodation.desc': { en: 'Carefully selected hotels, lodges and guesthouses.', fr: 'Hotels, lodges et maisons d\'hotes soigneusement selectionnes.' },

  'about.title': { en: 'Who we are', fr: 'Qui sommes-nous' },
  'about.text1': { en: 'NIO FAR was born from a simple idea: travel should first and foremost be a human experience.', fr: 'NIO FAR est ne d\'une idee simple : le voyage doit avant tout etre une experience humaine.' },
  'about.text2': { en: 'Our mission is to connect travelers with the true soul of Senegal through encounters, sharing, smiles and respect for local communities.', fr: 'Notre mission est de connecter les voyageurs a l\'ame veritable du Senegal a travers des rencontres, le partage, les sourires et le respect des communautes locales.' },
  'about.values.title': { en: 'Our values', fr: 'Nos valeurs' },
  'about.values.authenticity': { en: 'Authenticity', fr: 'Authenticite' },
  'about.values.respect': { en: 'Respect for people and nature', fr: 'Respect des personnes et de la nature' },
  'about.values.expertise': { en: 'Local expertise', fr: 'Expertise locale' },
  'about.values.hospitality': { en: 'Warm hospitality', fr: 'Hospitalite chaleureuse' },
  'about.closing': { en: 'With NIO FAR, you never travel alone - we are with you every step of the way.', fr: 'Avec NIO FAR, vous ne voyagez jamais seul - nous sommes avec vous a chaque etape.' },

  'services.title': { en: 'Our Services', fr: 'Nos Services' },
  'services.excursions.title': { en: 'Tailor-made excursions', fr: 'Excursions sur mesure' },
  'services.excursions.text': { en: 'Explore villages, markets, artisans, national parks and iconic sites. Each excursion is designed according to your interests and rhythm.', fr: 'Explorez villages, marches, artisans, parcs nationaux et sites emblematiques. Chaque excursion est concue selon vos interets et votre rythme.' },
  'services.transfers.title': { en: 'Airport transfers', fr: 'Transferts aeroport' },
  'services.transfers.text': { en: 'Reliable, safe and comfortable transfers with professional drivers who welcome you with a smile.', fr: 'Transferts fiables, securises et confortables avec des chauffeurs professionnels qui vous accueillent avec le sourire.' },
  'services.accommodation.title': { en: 'Accommodation booking', fr: 'Reservation d\'hebergements' },
  'services.accommodation.text': { en: 'Carefully selected hotels, lodges and guesthouses known for their charm and local hospitality.', fr: 'Hotels, lodges et maisons d\'hotes soigneusement selectionnes pour leur charme et leur hospitalite locale.' },

  'experiences.title': { en: 'Live the Experience', fr: 'Vivez l\'Experience' },
  'experiences.subtitle': { en: 'Travel beyond tourism. Live moments of sharing, discovery and immersion.', fr: 'Voyagez au-dela du tourisme. Vivez des moments de partage, de decouverte et d\'immersion.' },
  'experiences.cultural': { en: 'Cultural encounters', fr: 'Rencontres culturelles' },
  'experiences.nature': { en: 'Nature & wildlife', fr: 'Nature & faune' },
  'experiences.traditions': { en: 'Local traditions', fr: 'Traditions locales' },
  'experiences.lifestyle': { en: 'Senegalese way of life', fr: 'Art de vivre senegalais' },
  'experiences.closing': { en: 'Each experience leaves a memory, not just a photo.', fr: 'Chaque experience laisse un souvenir, pas seulement une photo.' },

  'why.title': { en: 'Why NIO FAR', fr: 'Pourquoi NIO FAR' },
  'why.local': { en: '100% local agency', fr: 'Agence 100% locale' },
  'why.guides': { en: 'Experienced local guides', fr: 'Guides locaux experimentes' },
  'why.support': { en: 'Personalized support', fr: 'Accompagnement personnalise' },
  'why.responsible': { en: 'Responsible tourism', fr: 'Tourisme responsable' },
  'why.immersion': { en: 'Authentic immersion', fr: 'Immersion authentique' },
  'why.closing': { en: 'Your journey, our commitment.', fr: 'Votre voyage, notre engagement.' },

  'contact.title': { en: 'Let\'s plan your journey together', fr: 'Planifions votre voyage ensemble' },
  'contact.name': { en: 'Name', fr: 'Nom' },
  'contact.email': { en: 'Email', fr: 'Email' },
  'contact.country': { en: 'Country', fr: 'Pays' },
  'contact.message': { en: 'Message', fr: 'Message' },
  'contact.send': { en: 'Send message', fr: 'Envoyer le message' },
  'contact.success': { en: 'Thank you! Your message has been sent.', fr: 'Merci ! Votre message a ete envoye.' },
  'contact.error': { en: 'An error occurred. Please try again.', fr: 'Une erreur est survenue. Veuillez reessayer.' },
  'contact.whatsapp': { en: 'WhatsApp', fr: 'WhatsApp' },
  'contact.location': { en: 'Senegal', fr: 'Senegal' },

  'footer.tagline': { en: 'Discover the Real Senegal', fr: 'Decouvrez le vrai Senegal' },
  'footer.rights': { en: 'All rights reserved', fr: 'Tous droits reserves' },

  'circuits.title': { en: 'Tours & Discovery', fr: 'Circuits & Decouvertes' },
  'circuits.subtitle': { en: 'Explore Senegal with our carefully crafted itineraries', fr: 'Explorez le Senegal avec nos itineraires soigneusement elabores' },
  'circuits.intro': { en: 'Each of our circuits is designed to offer you an authentic and immersive experience. From day trips to multi-day adventures, discover the best of Senegal with passionate local guides.', fr: 'Chacun de nos circuits est concu pour vous offrir une experience authentique et immersive. Des excursions d\'une journee aux aventures de plusieurs jours, decouvrez le meilleur du Senegal avec des guides locaux passionnes.' },
  'circuits.highlights': { en: 'Highlights', fr: 'Points forts' },
  'circuits.from': { en: 'From', fr: 'A partir de' },
  'circuits.book': { en: 'Book this tour', fr: 'Reserver ce circuit' },
  'circuits.custom.title': { en: 'Custom Itinerary', fr: 'Circuit Sur Mesure' },
  'circuits.custom.text': { en: 'Don\'t see exactly what you\'re looking for? We specialize in creating personalized journeys tailored to your interests, schedule, and budget. Let us design your perfect Senegalese adventure.', fr: 'Vous ne trouvez pas exactement ce que vous cherchez ? Nous sommes specialises dans la creation de voyages personnalises adaptes a vos interets, votre emploi du temps et votre budget. Laissez-nous concevoir votre aventure senegalaise parfaite.' },
  'circuits.custom.cta': { en: 'Request a custom tour', fr: 'Demander un circuit sur mesure' },
};

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLang = signal<Language>('en');

  readonly language = this.currentLang.asReadonly();

  constructor() {
    const savedLang = localStorage.getItem('nio-far-lang') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'fr')) {
      this.currentLang.set(savedLang);
    }
  }

  setLanguage(lang: Language): void {
    this.currentLang.set(lang);
    localStorage.setItem('nio-far-lang', lang);
  }

  toggleLanguage(): void {
    const newLang = this.currentLang() === 'en' ? 'fr' : 'en';
    this.setLanguage(newLang);
  }

  t(key: string): string {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Missing translation for key: ${key}`);
      return key;
    }
    return translation[this.currentLang()];
  }
}
