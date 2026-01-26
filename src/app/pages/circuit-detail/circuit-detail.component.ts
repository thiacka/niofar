import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';
import { ExcursionService, Excursion } from '../../core/services/excursion.service';
import { ScrollAnimateDirective } from '../../shared/directives/scroll-animate.directive';
import { Circuit, CircuitService, ItineraryDay } from '../../core/services/circuit.service';
import { CurrencyConverterPipe } from '../../shared/pipes/currency-converter.pipe';

interface DayWithImage extends ItineraryDay {
  excursion_image?: string;
}

@Component({
  selector: 'app-circuit-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ScrollAnimateDirective, CurrencyConverterPipe],
  template: `
    <section class="page-hero" [style.background-image]="'url(' + (circuit()?.image_url || '') + ')'">
      <div class="hero-overlay"></div>
      <div class="hero-content container">
        @if (circuit()) {
          <div class="hero-breadcrumb">
            <a routerLink="/circuits">{{ lang.t('circuits.title') }}</a>
            <span>/</span>
            <span>{{ getTitle() }}</span>
          </div>
          <h1>{{ getTitle() }}</h1>
          <div class="hero-meta">
            <div class="meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {{ getDuration() }}
            </div>
            <div class="meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Senegal
            </div>
          </div>
        }
      </div>
    </section>

    @if (isLoading()) {
      <section class="section">
        <div class="container">
          <div class="loading">
            <div class="spinner"></div>
          </div>
        </div>
      </section>
    } @else if (circuit()) {
      <section class="circuit-overview section">
        <div class="container">
          <div class="overview-grid">
            <div class="overview-content" appScrollAnimate>
              <h2>{{ lang.t('circuits.overview') }}</h2>
              <p class="lead">{{ getDescription() }}</p>

              <div class="highlights-section">
                <h3>{{ lang.t('circuits.highlights') }}</h3>
                <ul class="highlights-list">
                  @for (highlight of getHighlights(); track highlight) {
                    <li>{{ highlight }}</li>
                  }
                </ul>
              </div>
            </div>

            <div class="overview-sidebar" appScrollAnimate [animationDelay]="200">
              <div class="price-card">
                <div class="price-header">
                  <span class="price-label">{{ lang.t('circuits.from') }}</span>
                  <div class="price-value">{{ circuit()!.price | currencyConverter }}</div>
                  <span class="price-note">{{ getPriceNote() }}</span>
                </div>
                <a [routerLink]="['/booking', circuit()!.slug]" class="btn btn-primary btn-large">
                  {{ lang.t('circuits.book') }}
                </a>
              </div>

              <div class="info-card">
                <h4>{{ lang.t('booking.included') }}</h4>
                <ul class="included-list">
                  @for (service of getIncludedServices(); track service) {
                    <li>{{ service }}</li>
                  }
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      @if (itineraryDays().length > 0) {
        <section class="itinerary-section section" style="background: var(--color-background-alt);">
          <div class="container">
            <div class="section-header" appScrollAnimate>
              <h2>{{ lang.t('circuits.itinerary') }}</h2>
              <p>{{ lang.t('circuits.itinerarySubtitle') }}</p>
            </div>

            <div class="itinerary-timeline">
              @for (day of itineraryDays(); track day.day; let dayIndex = $index; let isLast = $last) {
                <div class="day-card" appScrollAnimate [animationDelay]="dayIndex * 100">
                  <div class="day-card-inner">
                    <div class="day-image-section">
                      <img [src]="day.excursion_image || circuit()!.image_url" [alt]="getDayTitle(day)" class="day-image" />
                      <div class="day-badge">
                        <span class="day-label">{{ lang.t('circuits.day') }}</span>
                        <span class="day-number-large">{{ day.day }}</span>
                      </div>
                    </div>

                    <div class="day-content-section">
                      <div class="day-header-content">
                        <h3 class="day-title">{{ getDayTitle(day) }}</h3>
                        @if (getDayLocation(day)) {
                          <div class="day-location">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                              <circle cx="12" cy="10" r="3"/>
                            </svg>
                            <span>{{ getDayLocation(day) }}</span>
                          </div>
                        }
                      </div>

                      <p class="day-description">{{ getDayDescription(day) }}</p>

                      <div class="day-details-grid">
                        @if (getDayAccommodation(day)) {
                          <div class="day-detail-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/>
                              <path d="M3 9V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3"/>
                              <path d="M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6"/>
                            </svg>
                            <div>
                              <span class="detail-label">{{ lang.t('booking.accommodation') }}</span>
                              <span class="detail-value">{{ getDayAccommodation(day) }}</span>
                            </div>
                          </div>
                        }

                        @if (getDayMeals(day)) {
                          <div class="day-detail-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2"/>
                              <path d="M6 8h8"/>
                              <path d="M6 12h8"/>
                              <path d="M6 16h8"/>
                              <path d="M2 8h2"/>
                              <path d="M2 12h2"/>
                              <path d="M2 16h2"/>
                            </svg>
                            <div>
                              <span class="detail-label">{{ lang.t('booking.meals') }}</span>
                              <span class="detail-value">{{ getDayMeals(day) }}</span>
                            </div>
                          </div>
                        }
                      </div>
                    </div>
                  </div>

                  @if (!isLast) {
                    <div class="day-connector">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        </section>
      }

      <section class="cta-section">
        <div class="container">
          <div class="cta-content" appScrollAnimate>
            <h2>{{ lang.t('circuits.readyToBook') }}</h2>
            <p>{{ lang.t('circuits.bookingCta') }}</p>
            <a [routerLink]="['/booking', circuit()!.slug]" class="btn btn-accent btn-large">
              {{ lang.t('circuits.bookNow') }}
            </a>
          </div>
        </div>
      </section>
    } @else {
      <section class="section">
        <div class="container">
          <div class="not-found">
            <h2>{{ lang.t('circuits.notFound') }}</h2>
            <a routerLink="/circuits" class="btn btn-primary">{{ lang.t('circuits.backToCircuits') }}</a>
          </div>
        </div>
      </section>
    }
  `,
  styles: [`
    .page-hero {
      position: relative;
      height: 60vh;
      min-height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-size: cover;
      background-position: center;
    }

    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(61, 43, 31, 0.85), rgba(43, 138, 138, 0.6));
    }

    .hero-content {
      position: relative;
      text-align: center;
      color: var(--color-white);
      padding-top: var(--header-height);
    }

    .hero-breadcrumb {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-lg);
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .hero-breadcrumb a {
      color: var(--color-white);
      transition: opacity var(--transition-fast);
    }

    .hero-breadcrumb a:hover {
      opacity: 0.7;
    }

    .hero-content h1 {
      color: var(--color-white);
      text-shadow: 0 2px 8px rgba(0,0,0,0.3);
      margin-bottom: var(--spacing-lg);
      font-size: 3rem;
    }

    .hero-meta {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-xl);
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-size: 1.1rem;
    }

    .overview-grid {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: var(--spacing-4xl);
    }

    .overview-content .lead {
      font-size: 1.2rem;
      line-height: 1.8;
      color: var(--color-text-light);
      margin-bottom: var(--spacing-2xl);
    }

    .highlights-section h3 {
      margin-bottom: var(--spacing-lg);
      color: var(--color-primary);
    }

    .highlights-list {
      list-style: none;
      padding: 0;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-md);
    }

    .highlights-list li {
      position: relative;
      padding-left: var(--spacing-lg);
      color: var(--color-text);
    }

    .highlights-list li::before {
      content: '';
      position: absolute;
      left: 0;
      top: 8px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--color-accent);
    }

    .overview-sidebar {
      position: sticky;
      top: calc(var(--header-height) + var(--spacing-lg));
      align-self: start;
    }

    .price-card {
      background: var(--color-white);
      border-radius: var(--radius-xl);
      padding: var(--spacing-2xl);
      box-shadow: var(--shadow-xl);
      margin-bottom: var(--spacing-lg);
    }

    .price-header {
      text-align: center;
      margin-bottom: var(--spacing-xl);
    }

    .price-label {
      display: block;
      font-size: 0.9rem;
      color: var(--color-text-light);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: var(--spacing-sm);
    }

    .price-value {
      font-family: var(--font-heading);
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--color-primary);
      line-height: 1.2;
    }

    .currency {
      font-size: 1.5rem;
    }

    .price-note {
      display: block;
      font-size: 0.85rem;
      color: var(--color-text-light);
      margin-top: var(--spacing-sm);
    }

    .btn-large {
      width: 100%;
      padding: var(--spacing-lg);
      font-size: 1.1rem;
    }

    .info-card {
      background: var(--color-white);
      border-radius: var(--radius-xl);
      padding: var(--spacing-xl);
      box-shadow: var(--shadow-md);
    }

    .info-card h4 {
      margin-bottom: var(--spacing-lg);
      color: var(--color-text);
    }

    .included-list {
      list-style: none;
      padding: 0;
    }

    .included-list li {
      position: relative;
      padding-left: var(--spacing-lg);
      margin-bottom: var(--spacing-sm);
      color: var(--color-text);
      font-size: 0.95rem;
    }

    .included-list li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: var(--color-success);
      font-weight: 700;
    }

    .section-header {
      text-align: center;
      max-width: 600px;
      margin: 0 auto var(--spacing-4xl);
    }

    .section-header h2 {
      margin-bottom: var(--spacing-md);
    }

    .section-header p {
      color: var(--color-text-light);
      font-size: 1.1rem;
    }

    .itinerary-timeline {
      max-width: 1100px;
      margin: 0 auto;
    }

    .day-card {
      position: relative;
      margin-bottom: var(--spacing-3xl);
    }

    .day-card-inner {
      display: grid;
      grid-template-columns: 420px 1fr;
      gap: 0;
      background: var(--color-white);
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-xl);
      transition: transform var(--transition-base), box-shadow var(--transition-base);
    }

    .day-card-inner:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(61, 43, 31, 0.15);
    }

    .day-image-section {
      position: relative;
      overflow: hidden;
    }

    .day-image {
      width: 100%;
      height: 100%;
      min-height: 350px;
      object-fit: cover;
      transition: transform var(--transition-slow);
    }

    .day-card-inner:hover .day-image {
      transform: scale(1.05);
    }

    .day-badge {
      position: absolute;
      top: var(--spacing-lg);
      left: var(--spacing-lg);
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
      color: var(--color-white);
      padding: var(--spacing-md) var(--spacing-lg);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-xs);
      min-width: 70px;
    }

    .day-label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      opacity: 0.9;
      font-weight: 600;
    }

    .day-number-large {
      font-family: var(--font-heading);
      font-size: 2rem;
      font-weight: 700;
      line-height: 1;
    }

    .day-content-section {
      padding: var(--spacing-2xl);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }

    .day-header-content {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .day-title {
      font-family: var(--font-heading);
      font-size: 1.8rem;
      color: var(--color-primary);
      font-weight: 700;
      line-height: 1.3;
      margin: 0;
    }

    .day-location {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      color: var(--color-secondary);
      font-weight: 600;
      font-size: 0.95rem;
    }

    .day-location svg {
      flex-shrink: 0;
    }

    .day-description {
      color: var(--color-text);
      line-height: 1.8;
      font-size: 1rem;
      margin: 0;
    }

    .day-details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-lg);
      padding-top: var(--spacing-lg);
      border-top: 2px solid var(--color-background-alt);
    }

    .day-detail-item {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-md);
    }

    .day-detail-item svg {
      flex-shrink: 0;
      color: var(--color-accent);
      margin-top: 2px;
    }

    .day-detail-item > div {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .detail-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-text-light);
      font-weight: 600;
    }

    .detail-value {
      font-size: 0.95rem;
      color: var(--color-text);
      font-weight: 500;
    }

    .day-connector {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 60px;
      color: var(--color-secondary);
      opacity: 0.5;
      animation: bounce 2s ease-in-out infinite;
    }

    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    .cta-section {
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
      padding: var(--spacing-4xl) 0;
    }

    .cta-content {
      text-align: center;
      max-width: 600px;
      margin: 0 auto;
    }

    .cta-content h2 {
      color: var(--color-white);
      margin-bottom: var(--spacing-md);
    }

    .cta-content p {
      color: var(--color-white);
      opacity: 0.95;
      font-size: 1.1rem;
      margin-bottom: var(--spacing-xl);
    }

    .loading {
      display: flex;
      justify-content: center;
      padding: var(--spacing-4xl);
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 3px solid rgba(61, 43, 31, 0.1);
      border-top-color: var(--color-primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .not-found {
      text-align: center;
      padding: var(--spacing-4xl);
    }

    .not-found h2 {
      margin-bottom: var(--spacing-xl);
      color: var(--color-text-light);
    }

    @media (max-width: 992px) {
      .overview-grid {
        grid-template-columns: 1fr;
      }

      .overview-sidebar {
        position: static;
      }

      .highlights-list {
        grid-template-columns: 1fr;
      }

      .hero-content h1 {
        font-size: 2rem;
      }

      .day-card-inner {
        grid-template-columns: 1fr;
      }

      .day-image-section {
        min-height: 280px;
      }

      .day-image {
        min-height: 280px;
      }

      .day-title {
        font-size: 1.5rem;
      }

      .day-content-section {
        padding: var(--spacing-xl);
      }
    }

    @media (max-width: 600px) {
      .day-badge {
        top: var(--spacing-md);
        left: var(--spacing-md);
        padding: var(--spacing-sm) var(--spacing-md);
        min-width: 60px;
      }

      .day-label {
        font-size: 0.65rem;
      }

      .day-number-large {
        font-size: 1.5rem;
      }

      .day-title {
        font-size: 1.3rem;
      }

      .day-content-section {
        padding: var(--spacing-lg);
      }

      .day-details-grid {
        grid-template-columns: 1fr;
      }

      .day-connector {
        height: 40px;
      }
    }
  `]
})
export class CircuitDetailComponent implements OnInit {
  lang = inject(LanguageService);
  private route = inject(ActivatedRoute);
  private circuitService = inject(CircuitService);
  private excursionService = inject(ExcursionService);

  circuit = signal<Circuit | null>(null);
  itineraryDays = signal<DayWithImage[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.loadCircuit(slug);
      } else {
        this.isLoading.set(false);
      }
    });
  }

  async loadCircuit(slug: string): Promise<void> {
    this.isLoading.set(true);
    const circuit = await this.circuitService.getCircuitBySlug(slug);
    this.circuit.set(circuit);

    if (circuit && circuit.itinerary && circuit.itinerary.length > 0) {
      const excursions = await this.excursionService.loadExcursions();
      const excursionMap = new Map(excursions.map(e => [e.id, e]));

      const daysWithImages = circuit.itinerary.map(day => ({
        ...day,
        excursion_image: day.excursion_id && excursionMap.has(day.excursion_id)
          ? excursionMap.get(day.excursion_id)!.image_url
          : circuit.image_url
      }));

      this.itineraryDays.set(daysWithImages);
    }

    this.isLoading.set(false);
  }

  getTitle(): string {
    const c = this.circuit();
    if (!c) return '';
    return this.lang.language() === 'fr' ? c.title_fr : c.title_en;
  }

  getDuration(): string {
    const c = this.circuit();
    if (!c) return '';
    return this.lang.language() === 'fr' ? c.duration_fr : c.duration_en;
  }

  getDescription(): string {
    const c = this.circuit();
    if (!c) return '';
    return this.lang.language() === 'fr' ? c.description_fr : c.description_en;
  }

  getHighlights(): string[] {
    const c = this.circuit();
    if (!c) return [];
    return this.lang.language() === 'fr' ? c.highlights_fr : c.highlights_en;
  }

  getPriceNote(): string {
    const c = this.circuit();
    if (!c) return '';
    return this.lang.language() === 'fr' ? c.price_note_fr : c.price_note_en;
  }

  getIncludedServices(): string[] {
    const circuit = this.circuit();
    if (!circuit) return [];

    const services = this.lang.language() === 'fr'
      ? circuit.included_services_fr
      : circuit.included_services_en;

    return Array.isArray(services) ? services : [];
  }

  getDayTitle(day: ItineraryDay): string {
    return this.lang.language() === 'fr' ? day.title_fr : day.title_en;
  }

  getDayDescription(day: ItineraryDay): string {
    return this.lang.language() === 'fr' ? day.description_fr : day.description_en;
  }

  getDayLocation(day: ItineraryDay): string {
    return this.lang.language() === 'fr' ? (day.location_fr || '') : (day.location_en || '');
  }

  getDayAccommodation(day: ItineraryDay): string {
    return this.lang.language() === 'fr' ? (day.accommodation_fr || '') : (day.accommodation_en || '');
  }

  getDayMeals(day: ItineraryDay): string {
    return this.lang.language() === 'fr' ? (day.meals_fr || '') : (day.meals_en || '');
  }
}
