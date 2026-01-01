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
  'nav.services': { en: 'Services', fr: 'Services' },
  'nav.experiences': { en: 'Experiences', fr: 'Experiences' },
  'nav.why': { en: 'Why NIO FAR', fr: 'Pourquoi NIO FAR' },
  'nav.contact': { en: 'Contact', fr: 'Contact' },
  'nav.circuits': { en: 'Tours & Discovery', fr: 'Circuits & Decouvertes' },

  'hero.title': { en: 'Discover the Real Senegal', fr: 'Decouvrez le vrai Senegal' },
  'hero.subtitle': { en: 'Authentic travel experiences, human encounters and unforgettable memories.', fr: 'Experiences de voyage authentiques, rencontres humaines et souvenirs inoubliables.' },
  'hero.cta': { en: 'Book your experience', fr: 'Reservez votre experience' },
  'hero.slogan': { en: 'Africa so close', fr: 'L\'Afrique si proche' },

  'hero.slide1.title': { en: 'Pink Lake', fr: 'Lac Rose' },
  'hero.slide1.subtitle': { en: 'A unique natural wonder', fr: 'Une merveille naturelle unique' },
  'hero.slide2.title': { en: 'Goree Island', fr: 'Ile de Goree' },
  'hero.slide2.subtitle': { en: 'UNESCO World Heritage', fr: 'Patrimoine mondial UNESCO' },
  'hero.slide3.title': { en: 'Casamance', fr: 'Casamance' },
  'hero.slide3.subtitle': { en: 'The green Senegal', fr: 'Le Senegal vert' },
  'hero.slide4.title': { en: 'Saint-Louis', fr: 'Saint-Louis' },
  'hero.slide4.subtitle': { en: 'Colonial charm', fr: 'Charme colonial' },

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
  'contact.viewMap': { en: 'View larger map', fr: 'Voir la carte en grand' },

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

  'booking.title': { en: 'Book Your Tour', fr: 'Reservez Votre Circuit' },
  'booking.subtitle': { en: 'Complete the form below to request your booking', fr: 'Remplissez le formulaire ci-dessous pour demander votre reservation' },
  'booking.details': { en: 'Your Information', fr: 'Vos Informations' },
  'booking.firstName': { en: 'First Name', fr: 'Prenom' },
  'booking.lastName': { en: 'Last Name', fr: 'Nom' },
  'booking.phone': { en: 'Phone Number', fr: 'Numero de telephone' },
  'booking.tripDetails': { en: 'Trip Details', fr: 'Details du voyage' },
  'booking.startDate': { en: 'Start Date', fr: 'Date de debut' },
  'booking.endDate': { en: 'End Date (optional)', fr: 'Date de fin (optionnel)' },
  'booking.adults': { en: 'Adults', fr: 'Adultes' },
  'booking.children': { en: 'Children (under 12)', fr: 'Enfants (moins de 12 ans)' },
  'booking.specialRequests': { en: 'Special Requests', fr: 'Demandes speciales' },
  'booking.specialRequestsPlaceholder': { en: 'Dietary requirements, mobility needs, special occasions...', fr: 'Regime alimentaire, besoins de mobilite, occasions speciales...' },
  'booking.estimateNote': { en: 'This is an estimate. Final price will be confirmed by our team.', fr: 'Ceci est une estimation. Le prix final sera confirme par notre equipe.' },
  'booking.estimatedTotal': { en: 'Estimated Total', fr: 'Total estime' },
  'booking.submit': { en: 'Request Booking', fr: 'Demander la reservation' },
  'booking.success': { en: 'Thank you! Your booking request has been submitted. We will contact you within 24 hours.', fr: 'Merci ! Votre demande de reservation a ete soumise. Nous vous contacterons dans les 24 heures.' },
  'booking.error': { en: 'An error occurred. Please try again or contact us directly.', fr: 'Une erreur est survenue. Veuillez reessayer ou nous contacter directement.' },
  'booking.dateError': { en: 'End date must be after start date', fr: 'La date de fin doit etre apres la date de debut' },
  'booking.note': { en: 'You will receive a confirmation email with all details.', fr: 'Vous recevrez un email de confirmation avec tous les details.' },
  'booking.needHelp': { en: 'Need Help?', fr: 'Besoin d\'aide ?' },
  'booking.helpText': { en: 'Our team is here to assist you with your booking.', fr: 'Notre equipe est la pour vous aider avec votre reservation.' },
  'booking.included': { en: 'What\'s Included', fr: 'Ce qui est inclus' },
  'booking.includedGuide': { en: 'Professional local guide', fr: 'Guide local professionnel' },
  'booking.includedTransport': { en: 'Transportation', fr: 'Transport' },
  'booking.includedEntrance': { en: 'Entrance fees', fr: 'Frais d\'entree' },
  'booking.backToCircuits': { en: 'Back to all tours', fr: 'Retour aux circuits' },
  'booking.notFound': { en: 'Tour not found', fr: 'Circuit non trouve' },
  'booking.browseCircuits': { en: 'Browse all tours', fr: 'Voir tous les circuits' },

  'contact.info': { en: 'Contact Information', fr: 'Informations de contact' },

  'confirmation.title': { en: 'Booking Confirmed!', fr: 'Reservation confirmee !' },
  'confirmation.subtitle': { en: 'Thank you for choosing NIO FAR', fr: 'Merci d\'avoir choisi NIO FAR' },
  'confirmation.reference': { en: 'Your booking reference', fr: 'Votre reference de reservation' },
  'confirmation.details': { en: 'Booking Details', fr: 'Details de la reservation' },
  'confirmation.next': { en: 'What happens next?', fr: 'Et maintenant ?' },
  'confirmation.step1': { en: 'You will receive a confirmation email shortly', fr: 'Vous recevrez un email de confirmation sous peu' },
  'confirmation.step2': { en: 'Our team will review your booking within 24 hours', fr: 'Notre equipe examinera votre reservation dans les 24 heures' },
  'confirmation.step3': { en: 'We will contact you to finalize the details', fr: 'Nous vous contacterons pour finaliser les details' },
  'confirmation.backHome': { en: 'Back to Home', fr: 'Retour a l\'accueil' },
  'confirmation.viewCircuits': { en: 'Explore more tours', fr: 'Decouvrir plus de circuits' },

  'admin.loginTitle': { en: 'Admin Panel', fr: 'Panneau d\'administration' },
  'admin.password': { en: 'Password', fr: 'Mot de passe' },
  'admin.passwordPlaceholder': { en: 'Enter admin password', fr: 'Entrez le mot de passe admin' },
  'admin.login': { en: 'Login', fr: 'Connexion' },
  'admin.loginError': { en: 'Invalid password', fr: 'Mot de passe invalide' },
  'admin.logout': { en: 'Logout', fr: 'Deconnexion' },
  'admin.bookings': { en: 'Bookings', fr: 'Reservations' },
  'admin.messages': { en: 'Messages', fr: 'Messages' },
  'admin.loading': { en: 'Loading...', fr: 'Chargement...' },
  'admin.noBookings': { en: 'No bookings yet', fr: 'Aucune reservation pour le moment' },
  'admin.noMessages': { en: 'No messages yet', fr: 'Aucun message pour le moment' },
  'admin.reference': { en: 'Reference', fr: 'Reference' },
  'admin.client': { en: 'Client', fr: 'Client' },
  'admin.circuit': { en: 'Circuit', fr: 'Circuit' },
  'admin.date': { en: 'Date', fr: 'Date' },
  'admin.travelers': { en: 'Travelers', fr: 'Voyageurs' },
  'admin.total': { en: 'Total', fr: 'Total' },
  'admin.status': { en: 'Status', fr: 'Statut' },
  'admin.actions': { en: 'Actions', fr: 'Actions' },
  'admin.adults': { en: 'adults', fr: 'adultes' },
  'admin.children': { en: 'children', fr: 'enfants' },
  'admin.status.pending': { en: 'Pending', fr: 'En attente' },
  'admin.status.confirmed': { en: 'Confirmed', fr: 'Confirme' },
  'admin.status.cancelled': { en: 'Cancelled', fr: 'Annule' },
  'admin.viewNotes': { en: 'View notes', fr: 'Voir les notes' },
  'admin.specialRequests': { en: 'Special Requests', fr: 'Demandes speciales' },
  'admin.reply': { en: 'Reply', fr: 'Repondre' },
  'admin.delete': { en: 'Delete', fr: 'Supprimer' },
  'admin.confirmDelete': { en: 'Are you sure you want to delete this message?', fr: 'Etes-vous sur de vouloir supprimer ce message ?' },

  'admin.circuits': { en: 'Circuits', fr: 'Circuits' },
  'admin.promotions': { en: 'Promotions', fr: 'Promotions' },
  'admin.circuitsManagement': { en: 'Circuits Management', fr: 'Gestion des circuits' },
  'admin.promotionsManagement': { en: 'Promotions Management', fr: 'Gestion des promotions' },
  'admin.addCircuit': { en: 'Add Circuit', fr: 'Ajouter un circuit' },
  'admin.editCircuit': { en: 'Edit Circuit', fr: 'Modifier le circuit' },
  'admin.addPromotion': { en: 'Add Promotion', fr: 'Ajouter une promotion' },
  'admin.editPromotion': { en: 'Edit Promotion', fr: 'Modifier la promotion' },
  'admin.inactive': { en: 'Inactive', fr: 'Inactif' },
  'admin.active': { en: 'Active', fr: 'Actif' },
  'admin.edit': { en: 'Edit', fr: 'Modifier' },
  'admin.toggleStatus': { en: 'Toggle status', fr: 'Changer le statut' },
  'admin.confirmDeleteCircuit': { en: 'Are you sure you want to delete this circuit?', fr: 'Etes-vous sur de vouloir supprimer ce circuit ?' },
  'admin.confirmDeletePromotion': { en: 'Are you sure you want to delete this promotion?', fr: 'Etes-vous sur de vouloir supprimer cette promotion ?' },
  'admin.price': { en: 'Price', fr: 'Prix' },
  'admin.imageUrl': { en: 'Image URL', fr: 'URL de l\'image' },
  'admin.titleFr': { en: 'Title (French)', fr: 'Titre (Francais)' },
  'admin.titleEn': { en: 'Title (English)', fr: 'Titre (Anglais)' },
  'admin.durationFr': { en: 'Duration (French)', fr: 'Duree (Francais)' },
  'admin.durationEn': { en: 'Duration (English)', fr: 'Duree (Anglais)' },
  'admin.descriptionFr': { en: 'Description (French)', fr: 'Description (Francais)' },
  'admin.descriptionEn': { en: 'Description (English)', fr: 'Description (Anglais)' },
  'admin.highlightsFr': { en: 'Highlights (French)', fr: 'Points forts (Francais)' },
  'admin.highlightsEn': { en: 'Highlights (English)', fr: 'Points forts (Anglais)' },
  'admin.highlightsPlaceholder': { en: 'Separated by commas', fr: 'Separes par des virgules' },
  'admin.priceNoteFr': { en: 'Price note (French)', fr: 'Note de prix (Francais)' },
  'admin.priceNoteEn': { en: 'Price note (English)', fr: 'Note de prix (Anglais)' },
  'admin.displayOrder': { en: 'Display order', fr: 'Ordre d\'affichage' },
  'admin.cancel': { en: 'Cancel', fr: 'Annuler' },
  'admin.save': { en: 'Save', fr: 'Enregistrer' },
  'admin.saving': { en: 'Saving...', fr: 'Enregistrement...' },
  'admin.code': { en: 'Promo Code', fr: 'Code promo' },
  'admin.promoName': { en: 'Name', fr: 'Nom' },
  'admin.nameFr': { en: 'Name (French)', fr: 'Nom (Francais)' },
  'admin.nameEn': { en: 'Name (English)', fr: 'Nom (Anglais)' },
  'admin.discount': { en: 'Discount', fr: 'Reduction' },
  'admin.discountType': { en: 'Discount type', fr: 'Type de reduction' },
  'admin.discountValue': { en: 'Value', fr: 'Valeur' },
  'admin.percentage': { en: 'Percentage', fr: 'Pourcentage' },
  'admin.fixedAmount': { en: 'Fixed amount (FCFA)', fr: 'Montant fixe (FCFA)' },
  'admin.validity': { en: 'Validity', fr: 'Validite' },
  'admin.startDate': { en: 'Start date', fr: 'Date de debut' },
  'admin.endDate': { en: 'End date', fr: 'Date de fin' },
  'admin.usage': { en: 'Usage', fr: 'Utilisation' },
  'admin.usageLimit': { en: 'Usage limit', fr: 'Limite d\'utilisation' },
  'admin.unlimited': { en: 'Unlimited', fr: 'Illimite' },
  'admin.minTravelers': { en: 'Min. travelers', fr: 'Voyageurs min.' },
  'admin.allCircuits': { en: 'All circuits', fr: 'Tous les circuits' },
  'admin.noLimit': { en: 'No limit', fr: 'Sans limite' },
  'admin.noPromotions': { en: 'No promotions yet', fr: 'Aucune promotion pour le moment' },

  'admin.dashboard': { en: 'Dashboard', fr: 'Tableau de bord' },
  'dashboard.totalBookings': { en: 'Total Bookings', fr: 'Total reservations' },
  'dashboard.confirmed': { en: 'Confirmed', fr: 'Confirmees' },
  'dashboard.pending': { en: 'Pending', fr: 'En attente' },
  'dashboard.cancelled': { en: 'Cancelled', fr: 'Annulees' },
  'dashboard.totalRevenue': { en: 'Total Revenue', fr: 'Revenu total' },
  'dashboard.recentBookings': { en: 'Recent Bookings', fr: 'Reservations recentes' },
  'dashboard.noRecentBookings': { en: 'No recent bookings', fr: 'Aucune reservation recente' },
  'dashboard.bookingsByStatus': { en: 'Bookings by Status', fr: 'Reservations par statut' },
  'dashboard.popularCircuits': { en: 'Popular Circuits', fr: 'Circuits populaires' },
  'dashboard.noCircuitData': { en: 'No circuit data yet', fr: 'Aucune donnee de circuit' },
  'dashboard.bookingsCount': { en: 'Bookings', fr: 'Reservations' },

  'admin.images': { en: 'Images', fr: 'Images' },
  'images.allPages': { en: 'All pages', fr: 'Toutes les pages' },
  'images.pageHome': { en: 'Home', fr: 'Accueil' },
  'images.pageServices': { en: 'Services', fr: 'Services' },
  'images.pageExperiences': { en: 'Experiences', fr: 'Experiences' },
  'images.pageWhyNioFar': { en: 'Why NIO FAR', fr: 'Pourquoi NIO FAR' },
  'images.addImage': { en: 'Add Image', fr: 'Ajouter une image' },
  'images.editImage': { en: 'Edit Image', fr: 'Modifier l\'image' },
  'images.noImages': { en: 'No images yet', fr: 'Aucune image pour le moment' },
  'images.page': { en: 'Page', fr: 'Page' },
  'images.section': { en: 'Section', fr: 'Section' },
  'images.imageUrl': { en: 'Image URL', fr: 'URL de l\'image' },
  'images.imageUrlPlaceholder': { en: 'https://example.com/image.jpg', fr: 'https://exemple.com/image.jpg' },
  'images.altTextEn': { en: 'Alt text (English)', fr: 'Texte alt (Anglais)' },
  'images.altTextFr': { en: 'Alt text (French)', fr: 'Texte alt (Francais)' },
  'images.altTextPlaceholder': { en: 'Description of the image', fr: 'Description de l\'image' },
  'images.displayOrder': { en: 'Display order', fr: 'Ordre d\'affichage' },
  'images.isActive': { en: 'Active', fr: 'Active' },
  'images.inactive': { en: 'Inactive', fr: 'Inactive' },
  'images.preview': { en: 'Preview', fr: 'Apercu' },
  'images.edit': { en: 'Edit', fr: 'Modifier' },
  'images.delete': { en: 'Delete', fr: 'Supprimer' },
  'images.toggleActive': { en: 'Toggle active', fr: 'Activer/Desactiver' },
  'images.confirmDelete': { en: 'Are you sure you want to delete this image?', fr: 'Etes-vous sur de vouloir supprimer cette image ?' },
  'dashboard.revenue': { en: 'Revenue', fr: 'Revenu' },
  'dashboard.quickStats': { en: 'Quick Stats', fr: 'Statistiques rapides' },
  'dashboard.totalCircuits': { en: 'Total Circuits', fr: 'Total circuits' },
  'dashboard.activeCircuits': { en: 'Active Circuits', fr: 'Circuits actifs' },
  'dashboard.messages': { en: 'Messages', fr: 'Messages' },
  'dashboard.recentMessages': { en: 'Recent Messages', fr: 'Messages recents' },
  'dashboard.noRecentMessages': { en: 'No recent messages', fr: 'Aucun message recent' },
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
