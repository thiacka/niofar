import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { ScrollAnimateDirective } from '../../shared/directives/scroll-animate.directive';

interface FaqItem {
  questionFr: string;
  questionEn: string;
  answerFr: string;
  answerEn: string;
  category: 'booking' | 'travel' | 'payment' | 'practical';
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [RouterLink, ScrollAnimateDirective],
  template: `
    <section class="page-hero">
      <div class="hero-overlay"></div>
      <div class="hero-content container">
        <h1>{{ lang.t('faq.title') }}</h1>
        <p>{{ lang.t('faq.subtitle') }}</p>
      </div>
    </section>

    <section class="faq-section section">
      <div class="container">
        <div class="faq-categories" appScrollAnimate>
          @for (cat of categories; track cat.key) {
            <button
              class="cat-btn"
              [class.active]="activeCategory() === cat.key"
              (click)="activeCategory.set(cat.key)"
            >
              <span>{{ cat.icon }}</span>
              {{ lang.language() === 'fr' ? cat.labelFr : cat.labelEn }}
            </button>
          }
        </div>

        <div class="faq-list">
          @for (item of filteredFaqs(); track item.questionFr; let i = $index) {
            <div class="faq-item" appScrollAnimate [animationDelay]="i * 60" [class.open]="openIndex() === i">
              <button class="faq-question" (click)="toggle(i)">
                <span>{{ lang.language() === 'fr' ? item.questionFr : item.questionEn }}</span>
                <svg class="faq-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              @if (openIndex() === i) {
                <div class="faq-answer">
                  <p>{{ lang.language() === 'fr' ? item.answerFr : item.answerEn }}</p>
                </div>
              }
            </div>
          }
        </div>

        <div class="faq-cta" appScrollAnimate>
          <p>{{ lang.t('faq.contact') }}</p>
          <div class="cta-buttons">
            <a routerLink="/contact" class="btn btn-primary">{{ lang.t('nav.contact') }}</a>
            <a href="https://wa.me/221756518350" target="_blank" class="btn btn-whatsapp">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.528 5.845L0 24l6.335-1.502A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.787 9.787 0 0 1-5.032-1.388l-.361-.214-3.741.887.938-3.64-.235-.374A9.778 9.778 0 0 1 2.182 12C2.182 6.566 6.566 2.182 12 2.182S21.818 6.566 21.818 12 17.434 21.818 12 21.818z"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .page-hero {
      position: relative;
      height: 35vh;
      min-height: 260px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
    }
    .hero-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.2); }
    .hero-content { position: relative; text-align: center; color: var(--color-white); padding-top: var(--header-height); }
    .hero-content h1 { color: var(--color-white); text-shadow: 0 2px 4px rgba(0,0,0,0.3); margin-bottom: var(--spacing-sm); }
    .hero-content p { opacity: 0.9; font-size: 1.05rem; }

    .faq-categories {
      display: flex;
      gap: var(--spacing-sm);
      flex-wrap: wrap;
      justify-content: center;
      margin-bottom: var(--spacing-3xl);
    }

    .cat-btn {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-sm) var(--spacing-lg);
      border: 2px solid rgba(61,43,31,0.15);
      border-radius: var(--radius-full);
      background: var(--color-white);
      color: var(--color-text-light);
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }
    .cat-btn:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }
    .cat-btn.active {
      background: var(--color-primary);
      border-color: var(--color-primary);
      color: var(--color-white);
      font-weight: 600;
    }

    .faq-list {
      max-width: 760px;
      margin: 0 auto var(--spacing-4xl);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .faq-item {
      background: var(--color-white);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      border: 1px solid rgba(61,43,31,0.08);
      overflow: hidden;
      transition: box-shadow 0.2s;
    }
    .faq-item:hover { box-shadow: var(--shadow-md); }
    .faq-item.open {
      border-color: var(--color-primary);
      box-shadow: var(--shadow-md);
    }

    .faq-question {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-lg);
      padding: var(--spacing-lg) var(--spacing-xl);
      background: none;
      border: none;
      cursor: pointer;
      text-align: left;
      font-size: 1rem;
      font-weight: 600;
      color: var(--color-text);
      transition: color 0.2s;
    }
    .faq-question:hover { color: var(--color-primary); }
    .faq-item.open .faq-question { color: var(--color-primary); }

    .faq-icon {
      flex-shrink: 0;
      color: var(--color-primary);
      transition: transform 0.25s ease;
    }
    .faq-item.open .faq-icon { transform: rotate(180deg); }

    .faq-answer {
      padding: 0 var(--spacing-xl) var(--spacing-xl);
      animation: fadeDown 0.2s ease;
    }
    .faq-answer p {
      margin: 0;
      color: var(--color-text);
      line-height: 1.75;
      font-size: 0.97rem;
    }

    @keyframes fadeDown {
      from { opacity: 0; transform: translateY(-6px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .faq-cta {
      text-align: center;
      padding: var(--spacing-3xl);
      background: var(--color-background-alt);
      border-radius: var(--radius-xl);
    }
    .faq-cta p {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--color-text);
      margin-bottom: var(--spacing-xl);
    }
    .cta-buttons {
      display: flex;
      gap: var(--spacing-md);
      justify-content: center;
      flex-wrap: wrap;
    }
    .btn-whatsapp {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-sm);
      background: #25D366;
      color: white;
      padding: var(--spacing-sm) var(--spacing-xl);
      border-radius: var(--radius-md);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.95rem;
      transition: background 0.2s;
    }
    .btn-whatsapp:hover { background: #128C7E; }
  `]
})
export class FaqComponent {
  lang = inject(LanguageService);

  openIndex = signal<number | null>(null);
  activeCategory = signal<string>('all');

  categories = [
    { key: 'all',      icon: '🌍', labelFr: 'Toutes', labelEn: 'All' },
    { key: 'booking',  icon: '📋', labelFr: 'Réservation', labelEn: 'Booking' },
    { key: 'travel',   icon: '✈️', labelFr: 'Voyage', labelEn: 'Travel' },
    { key: 'payment',  icon: '💳', labelFr: 'Paiement', labelEn: 'Payment' },
    { key: 'practical',icon: '🧳', labelFr: 'Pratique', labelEn: 'Practical' }
  ];

  faqs: FaqItem[] = [
    {
      category: 'booking',
      questionFr: 'Comment réserver un circuit ou une excursion ?',
      questionEn: 'How do I book a tour or excursion?',
      answerFr: 'Sélectionnez le circuit ou l\'excursion de votre choix, cliquez sur "Réserver" et remplissez le formulaire en ligne. Notre équipe vous contactera sous 24h pour confirmer les détails et finaliser votre réservation.',
      answerEn: 'Select the tour or excursion of your choice, click "Book" and fill in the online form. Our team will contact you within 24 hours to confirm the details and finalise your booking.'
    },
    {
      category: 'booking',
      questionFr: 'Puis-je annuler ou modifier ma réservation ?',
      questionEn: 'Can I cancel or modify my booking?',
      answerFr: 'Oui. Toute annulation ou modification doit être communiquée par email ou WhatsApp au moins 72h avant la date prévue. En dessous de ce délai, des frais d\'annulation peuvent s\'appliquer. Contactez-nous directement pour toute demande.',
      answerEn: 'Yes. Any cancellation or modification must be communicated by email or WhatsApp at least 72 hours before the scheduled date. Below this deadline, cancellation fees may apply. Contact us directly for any request.'
    },
    {
      category: 'booking',
      questionFr: 'Proposez-vous des devis sur mesure pour les groupes ?',
      questionEn: 'Do you offer custom quotes for groups?',
      answerFr: 'Absolument. Nous travaillons régulièrement avec des groupes familiaux, scolaires, corporatifs ou d\'amis. Contactez-nous avec le nombre de personnes, vos dates et vos centres d\'intérêt pour recevoir un devis personnalisé.',
      answerEn: 'Absolutely. We regularly work with family, school, corporate or friends groups. Contact us with the number of people, your dates and your interests to receive a personalised quote.'
    },
    {
      category: 'booking',
      questionFr: 'Comment obtenir ma référence de réservation ?',
      questionEn: 'How do I get my booking reference?',
      answerFr: 'Après soumission de votre formulaire en ligne, vous recevrez automatiquement un email de confirmation contenant votre numéro de référence (format NF-AAAAMMJJ-XXXX). Vous pouvez aussi retrouver votre réservation sur la page "Suivi de réservation".',
      answerEn: 'After submitting your online form, you will automatically receive a confirmation email containing your reference number (format NF-YYYYMMDD-XXXX). You can also find your booking on the "Booking Lookup" page.'
    },
    {
      category: 'travel',
      questionFr: 'Les circuits incluent-ils le transport depuis Dakar ?',
      questionEn: 'Do tours include transport from Dakar?',
      answerFr: 'La plupart de nos circuits incluent le transport depuis Dakar ou Saly. Le point de départ précis est indiqué dans chaque programme. Si vous arrivez à l\'aéroport AIBD, nous proposons également des transferts aéroport.',
      answerEn: 'Most of our tours include transport from Dakar or Saly. The exact departure point is indicated in each programme. If you arrive at AIBD airport, we also offer airport transfers.'
    },
    {
      category: 'travel',
      questionFr: 'Les guides parlent-ils français et anglais ?',
      questionEn: 'Do your guides speak French and English?',
      answerFr: 'Oui, tous nos guides locaux sont bilingues français/anglais. Sur demande, nous pouvons également organiser des visites en espagnol ou en allemand pour les groupes.',
      answerEn: 'Yes, all our local guides are bilingual French/English. On request, we can also organise tours in Spanish or German for groups.'
    },
    {
      category: 'travel',
      questionFr: 'Quelle est la meilleure période pour visiter le Sénégal ?',
      questionEn: 'What is the best time to visit Senegal?',
      answerFr: 'La saison sèche (novembre à mai) est idéale : temps ensoleillé, températures agréables (20-30°C) et faible humidité. La saison des pluies (juin à octobre) offre une nature luxuriante et moins de touristes, mais certains accès peuvent être difficiles.',
      answerEn: 'The dry season (November to May) is ideal: sunny weather, pleasant temperatures (20-30°C) and low humidity. The rainy season (June to October) offers lush nature and fewer tourists, but some access may be difficult.'
    },
    {
      category: 'travel',
      questionFr: 'Faut-il un visa pour visiter le Sénégal ?',
      questionEn: 'Do I need a visa to visit Senegal?',
      answerFr: 'Les ressortissants de l\'Union Européenne, des États-Unis, du Canada et de nombreux pays africains n\'ont pas besoin de visa pour un séjour de moins de 90 jours. Consultez l\'ambassade du Sénégal de votre pays pour vérifier les conditions spécifiques.',
      answerEn: 'Citizens of the European Union, the United States, Canada and many African countries do not need a visa for stays under 90 days. Check the Senegalese embassy in your country for specific conditions.'
    },
    {
      category: 'payment',
      questionFr: 'Quels modes de paiement acceptez-vous ?',
      questionEn: 'What payment methods do you accept?',
      answerFr: 'Actuellement, nous acceptons les virements bancaires, le paiement en espèces sur place, et les paiements via Orange Money / Wave pour les clients locaux. Un système de paiement en ligne par carte sera bientôt disponible.',
      answerEn: 'Currently, we accept bank transfers, cash on site, and payments via Orange Money / Wave for local clients. An online card payment system will be available soon.'
    },
    {
      category: 'payment',
      questionFr: 'Quel est le montant de l\'acompte pour confirmer une réservation ?',
      questionEn: 'What is the deposit amount to confirm a booking?',
      answerFr: 'Un acompte de 30% du montant total est demandé pour confirmer votre réservation. Le solde est à régler 48h avant le départ ou en espèces le jour J.',
      answerEn: 'A deposit of 30% of the total amount is required to confirm your booking. The balance is to be paid 48 hours before departure or in cash on the day.'
    },
    {
      category: 'practical',
      questionFr: 'Quelle devise est utilisée au Sénégal ?',
      questionEn: 'What currency is used in Senegal?',
      answerFr: 'La devise officielle est le Franc CFA (FCFA / XOF). Les euros sont largement acceptés dans les hôtels et les grandes boutiques à Dakar et Saly. Les distributeurs de billets sont disponibles dans toutes les grandes villes.',
      answerEn: 'The official currency is the CFA Franc (FCFA / XOF). Euros are widely accepted in hotels and large shops in Dakar and Saly. ATMs are available in all major cities.'
    },
    {
      category: 'practical',
      questionFr: 'Quels vaccins sont recommandés avant le voyage ?',
      questionEn: 'What vaccinations are recommended before travelling?',
      answerFr: 'Le vaccin contre la fièvre jaune est obligatoire pour entrer au Sénégal si vous venez de certains pays. Les vaccins hépatite A, typhoïde et la prophylaxie anti-paludéenne sont également fortement recommandés. Consultez votre médecin avant le départ.',
      answerEn: 'The yellow fever vaccine is mandatory to enter Senegal if you come from certain countries. Hepatitis A, typhoid vaccines and anti-malaria prophylaxis are also strongly recommended. Consult your doctor before departure.'
    }
  ];

  filteredFaqs = () => {
    const cat = this.activeCategory();
    return cat === 'all' ? this.faqs : this.faqs.filter(f => f.category === cat);
  };

  toggle(index: number): void {
    this.openIndex.set(this.openIndex() === index ? null : index);
  }
}
