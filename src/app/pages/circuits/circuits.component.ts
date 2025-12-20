import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';

interface Circuit {
  id: string;
  image: string;
  duration: { en: string; fr: string };
  title: { en: string; fr: string };
  description: { en: string; fr: string };
  highlights: { en: string[]; fr: string[] };
  price: number;
  priceNote: { en: string; fr: string };
}

@Component({
  selector: 'app-circuits',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  template: `
    <section class="page-hero">
      <div class="hero-overlay"></div>
      <div class="hero-content container">
        <h1>{{ lang.t('circuits.title') }}</h1>
        <p>{{ lang.t('circuits.subtitle') }}</p>
      </div>
    </section>

    <section class="circuits-intro section">
      <div class="container">
        <div class="intro-content">
          <p class="lead">{{ lang.t('circuits.intro') }}</p>
        </div>
      </div>
    </section>

    <section class="circuits-list section" style="background: var(--color-background-alt);">
      <div class="container">
        <div class="circuits-grid">
          @for (circuit of circuits; track circuit.id) {
            <div class="circuit-card">
              <div class="circuit-image">
                <img [src]="circuit.image" [alt]="circuit.title[lang.language()]" />
                <div class="circuit-duration">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {{ circuit.duration[lang.language()] }}
                </div>
              </div>
              <div class="circuit-content">
                <h3>{{ circuit.title[lang.language()] }}</h3>
                <p class="circuit-description">{{ circuit.description[lang.language()] }}</p>
                <div class="circuit-highlights">
                  <h4>{{ lang.t('circuits.highlights') }}</h4>
                  <ul>
                    @for (highlight of circuit.highlights[lang.language()]; track highlight) {
                      <li>{{ highlight }}</li>
                    }
                  </ul>
                </div>
                <div class="circuit-footer">
                  <div class="circuit-price">
                    <span class="price-label">{{ lang.t('circuits.from') }}</span>
                    <span class="price-value">{{ circuit.price | number }} FCFA</span>
                    <span class="price-note">{{ circuit.priceNote[lang.language()] }}</span>
                  </div>
                  <a [routerLink]="['/booking', circuit.id]" class="btn btn-primary">{{ lang.t('circuits.book') }}</a>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <section class="custom-circuit section">
      <div class="container">
        <div class="custom-content">
          <div class="custom-text">
            <h2>{{ lang.t('circuits.custom.title') }}</h2>
            <p>{{ lang.t('circuits.custom.text') }}</p>
            <a routerLink="/contact" class="btn btn-secondary">{{ lang.t('circuits.custom.cta') }}</a>
          </div>
          <div class="custom-image">
            <img src="https://images.pexels.com/photos/3889827/pexels-photo-3889827.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Custom circuit" />
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>{{ lang.t('contact.title') }}</h2>
          <a routerLink="/contact" class="btn btn-accent">{{ lang.t('hero.cta') }}</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .page-hero {
      position: relative;
      height: 50vh;
      min-height: 350px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: url('https://images.pexels.com/photos/3889742/pexels-photo-3889742.jpeg?auto=compress&cs=tinysrgb&w=1920') center/cover no-repeat;
    }

    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(61, 43, 31, 0.75), rgba(43, 138, 138, 0.5));
    }

    .hero-content {
      position: relative;
      text-align: center;
      color: var(--color-white);
      padding-top: var(--header-height);
    }

    .hero-content h1 {
      color: var(--color-white);
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
      margin-bottom: var(--spacing-md);
    }

    .hero-content p {
      font-size: 1.125rem;
      opacity: 0.95;
      max-width: 600px;
      margin: 0 auto;
    }

    .intro-content {
      text-align: center;
      max-width: 800px;
      margin: 0 auto;
    }

    .intro-content .lead {
      font-size: 1.25rem;
      color: var(--color-text-light);
      line-height: 1.8;
    }

    .circuits-grid {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2xl);
    }

    .circuit-card {
      display: grid;
      grid-template-columns: 400px 1fr;
      background: var(--color-white);
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-lg);
      transition: all var(--transition-base);
    }

    .circuit-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-xl);
    }

    .circuit-card:nth-child(even) {
      direction: rtl;
    }

    .circuit-card:nth-child(even) > * {
      direction: ltr;
    }

    .circuit-image {
      position: relative;
      height: 100%;
      min-height: 350px;
    }

    .circuit-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .circuit-duration {
      position: absolute;
      top: var(--spacing-lg);
      left: var(--spacing-lg);
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      background: var(--color-white);
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--radius-full);
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-text);
      box-shadow: var(--shadow-md);
    }

    .circuit-card:nth-child(even) .circuit-duration {
      left: auto;
      right: var(--spacing-lg);
    }

    .circuit-content {
      padding: var(--spacing-2xl);
      display: flex;
      flex-direction: column;
    }

    .circuit-content h3 {
      margin-bottom: var(--spacing-md);
      color: var(--color-primary);
    }

    .circuit-description {
      color: var(--color-text-light);
      line-height: 1.7;
      margin-bottom: var(--spacing-lg);
    }

    .circuit-highlights {
      margin-bottom: var(--spacing-xl);
      flex-grow: 1;
    }

    .circuit-highlights h4 {
      font-size: 0.9rem;
      font-family: var(--font-body);
      font-weight: 600;
      color: var(--color-secondary);
      margin-bottom: var(--spacing-sm);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .circuit-highlights ul {
      list-style: none;
      padding: 0;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-xs) var(--spacing-lg);
    }

    .circuit-highlights li {
      position: relative;
      padding-left: var(--spacing-lg);
      font-size: 0.95rem;
      color: var(--color-text);
    }

    .circuit-highlights li::before {
      content: '';
      position: absolute;
      left: 0;
      top: 8px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--color-accent);
    }

    .circuit-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: var(--spacing-lg);
      border-top: 1px solid rgba(61, 43, 31, 0.1);
    }

    .circuit-price {
      display: flex;
      flex-direction: column;
    }

    .price-label {
      font-size: 0.8rem;
      color: var(--color-text-light);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .price-value {
      font-family: var(--font-heading);
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-primary);
    }

    .price-note {
      font-size: 0.8rem;
      color: var(--color-text-light);
    }

    .custom-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-4xl);
      align-items: center;
    }

    .custom-text h2 {
      margin-bottom: var(--spacing-lg);
    }

    .custom-text p {
      color: var(--color-text-light);
      margin-bottom: var(--spacing-xl);
      line-height: 1.8;
    }

    .custom-image {
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-xl);
    }

    .custom-image img {
      width: 100%;
      height: 350px;
      object-fit: cover;
    }

    .cta-section {
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
      padding: var(--spacing-4xl) 0;
    }

    .cta-content {
      text-align: center;
    }

    .cta-content h2 {
      color: var(--color-white);
      margin-bottom: var(--spacing-xl);
    }

    @media (max-width: 992px) {
      .circuit-card {
        grid-template-columns: 1fr;
      }

      .circuit-card:nth-child(even) {
        direction: ltr;
      }

      .circuit-image {
        min-height: 250px;
      }

      .circuit-card:nth-child(even) .circuit-duration {
        left: var(--spacing-lg);
        right: auto;
      }

      .circuit-highlights ul {
        grid-template-columns: 1fr;
      }

      .custom-content {
        grid-template-columns: 1fr;
        gap: var(--spacing-2xl);
      }

      .custom-image {
        order: -1;
      }
    }

    @media (max-width: 480px) {
      .circuit-footer {
        flex-direction: column;
        gap: var(--spacing-lg);
        align-items: flex-start;
      }

      .circuit-footer .btn {
        width: 100%;
      }
    }
  `]
})
export class CircuitsComponent {
  lang = inject(LanguageService);

  circuits: Circuit[] = [
    {
      id: 'lac-rose',
      image: 'https://images.pexels.com/photos/3889854/pexels-photo-3889854.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: { en: '1 day', fr: '1 jour' },
      title: {
        en: 'Lake Retba (Pink Lake) Discovery',
        fr: 'Decouverte du Lac Rose (Lac Retba)'
      },
      description: {
        en: 'Explore the famous Pink Lake, known for its unique rose color caused by algae. Watch salt harvesters at work and enjoy a traditional lunch by the lake.',
        fr: 'Explorez le celebre Lac Rose, connu pour sa couleur unique causee par les algues. Observez les recolteurs de sel au travail et savourez un dejeuner traditionnel au bord du lac.'
      },
      highlights: {
        en: ['Pink Lake visit', 'Salt harvesting demo', 'Traditional lunch', '4x4 dunes experience', 'Local village visit', 'Photo opportunities'],
        fr: ['Visite du Lac Rose', 'Demo recolte de sel', 'Dejeuner traditionnel', 'Experience dunes 4x4', 'Visite village local', 'Opportunites photos']
      },
      price: 45000,
      priceNote: { en: 'per person', fr: 'par personne' }
    },
    {
      id: 'goree-island',
      image: 'https://images.pexels.com/photos/5560549/pexels-photo-5560549.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: { en: 'Half day', fr: 'Demi-journee' },
      title: {
        en: 'Goree Island - History & Heritage',
        fr: 'Ile de Goree - Histoire & Patrimoine'
      },
      description: {
        en: 'Visit the UNESCO World Heritage site of Goree Island. Discover the House of Slaves, colonial architecture, and the vibrant artistic community.',
        fr: 'Visitez le site du patrimoine mondial de l\'UNESCO de l\'ile de Goree. Decouvrez la Maison des Esclaves, l\'architecture coloniale et la communaute artistique vibrante.'
      },
      highlights: {
        en: ['Ferry crossing', 'House of Slaves', 'Colonial architecture', 'Art galleries', 'Local crafts', 'Guided tour'],
        fr: ['Traversee en ferry', 'Maison des Esclaves', 'Architecture coloniale', 'Galeries d\'art', 'Artisanat local', 'Visite guidee']
      },
      price: 35000,
      priceNote: { en: 'per person', fr: 'par personne' }
    },
    {
      id: 'sine-saloum',
      image: 'https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: { en: '2-3 days', fr: '2-3 jours' },
      title: {
        en: 'Sine-Saloum Delta Expedition',
        fr: 'Expedition Delta du Sine-Saloum'
      },
      description: {
        en: 'Immerse yourself in the stunning Sine-Saloum Delta biosphere reserve. Navigate through mangroves, discover bird sanctuaries, and stay in traditional lodges.',
        fr: 'Immergez-vous dans la reserve de biosphere du Delta du Sine-Saloum. Naviguez a travers les mangroves, decouvrez les sanctuaires d\'oiseaux et sejournez dans des lodges traditionnels.'
      },
      highlights: {
        en: ['Pirogue boat trip', 'Bird watching', 'Mangrove exploration', 'Traditional lodge', 'Fishing villages', 'Sunset cruise'],
        fr: ['Balade en pirogue', 'Observation oiseaux', 'Exploration mangroves', 'Lodge traditionnel', 'Villages de pecheurs', 'Croisiere coucher soleil']
      },
      price: 150000,
      priceNote: { en: 'per person (2 days)', fr: 'par personne (2 jours)' }
    },
    {
      id: 'casamance',
      image: 'https://images.pexels.com/photos/3889891/pexels-photo-3889891.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: { en: '4-5 days', fr: '4-5 jours' },
      title: {
        en: 'Casamance - The Green Senegal',
        fr: 'Casamance - Le Senegal Vert'
      },
      description: {
        en: 'Discover the lush Casamance region with its dense forests, traditional Diola villages, and pristine beaches. Experience authentic rural Senegalese life.',
        fr: 'Decouvrez la luxuriante region de Casamance avec ses forets denses, ses villages Diola traditionnels et ses plages vierges. Vivez la vie rurale senegalaise authentique.'
      },
      highlights: {
        en: ['Ziguinchor visit', 'Diola villages', 'Sacred forests', 'Cap Skirring beach', 'Traditional dances', 'Palm wine tasting'],
        fr: ['Visite Ziguinchor', 'Villages Diola', 'Forets sacrees', 'Plage Cap Skirring', 'Danses traditionnelles', 'Degustation vin de palme']
      },
      price: 350000,
      priceNote: { en: 'per person (all inclusive)', fr: 'par personne (tout compris)' }
    },
    {
      id: 'saint-louis',
      image: 'https://images.pexels.com/photos/3889843/pexels-photo-3889843.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: { en: '2 days', fr: '2 jours' },
      title: {
        en: 'Saint-Louis - Colonial Heritage',
        fr: 'Saint-Louis - Heritage Colonial'
      },
      description: {
        en: 'Explore the historic city of Saint-Louis, former capital of French West Africa. Admire the colonial architecture, visit the Langue de Barbarie, and experience the Jazz Festival atmosphere.',
        fr: 'Explorez la ville historique de Saint-Louis, ancienne capitale de l\'Afrique occidentale francaise. Admirez l\'architecture coloniale, visitez la Langue de Barbarie et vivez l\'atmosphere du Festival de Jazz.'
      },
      highlights: {
        en: ['UNESCO old town', 'Faidherbe Bridge', 'Langue de Barbarie', 'Djoudj Bird Park', 'Fishermen village', 'Colonial architecture'],
        fr: ['Vieille ville UNESCO', 'Pont Faidherbe', 'Langue de Barbarie', 'Parc oiseaux Djoudj', 'Village pecheurs', 'Architecture coloniale']
      },
      price: 120000,
      priceNote: { en: 'per person', fr: 'par personne' }
    },
    {
      id: 'dakar-discovery',
      image: 'https://images.pexels.com/photos/5560532/pexels-photo-5560532.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: { en: '1 day', fr: '1 jour' },
      title: {
        en: 'Dakar City Discovery',
        fr: 'Decouverte de Dakar'
      },
      description: {
        en: 'Discover the vibrant capital of Senegal. From the African Renaissance Monument to the colorful markets, experience the energy and culture of this dynamic city.',
        fr: 'Decouvrez la capitale vibrante du Senegal. Du Monument de la Renaissance Africaine aux marches colores, vivez l\'energie et la culture de cette ville dynamique.'
      },
      highlights: {
        en: ['Renaissance Monument', 'Sandaga Market', 'IFAN Museum', 'Almadies Point', 'Local cuisine', 'Craft village'],
        fr: ['Monument Renaissance', 'Marche Sandaga', 'Musee IFAN', 'Pointe des Almadies', 'Cuisine locale', 'Village artisanal']
      },
      price: 40000,
      priceNote: { en: 'per person', fr: 'par personne' }
    }
  ];
}
