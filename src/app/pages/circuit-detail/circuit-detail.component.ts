import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DecimalPipe, CommonModule } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';
import { ExcursionService, Excursion } from '../../core/services/excursion.service';
import { CircuitStageService, CircuitStage } from '../../core/services/circuit-stage.service';
import { ScrollAnimateDirective } from '../../shared/directives/scroll-animate.directive';
import { Circuit, CircuitService } from '../../core/services/circuit.service';

interface DayStages {
  dayNumber: number;
  stages: CircuitStage[];
}

@Component({
  selector: 'app-circuit-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DecimalPipe, ScrollAnimateDirective],
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
                  <div class="price-value">{{ circuit()!.price | number }} <span class="currency">FCFA</span></div>
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

      @if (groupedStages().length > 0) {
        <section class="itinerary-section section" style="background: var(--color-background-alt);">
          <div class="container">
            <div class="section-header" appScrollAnimate>
              <h2>{{ lang.t('circuits.itinerary') }}</h2>
              <p>{{ lang.t('circuits.itinerarySubtitle') }}</p>
            </div>

            <div class="itinerary-timeline">
              @for (dayGroup of groupedStages(); track dayGroup.dayNumber; let dayIndex = $index) {
                <div class="day-section" appScrollAnimate [animationDelay]="dayIndex * 100">
                  <div class="day-header">
                    <div class="day-number">
                      <span>{{ lang.t('circuits.day') }} {{ dayGroup.dayNumber }}</span>
                    </div>
                  </div>

                  <div class="stages-container">
                    @for (stage of dayGroup.stages; track stage.id; let stageIndex = $index) {
                      <div class="stage-card">
                        <div class="stage-timeline">
                          <div class="timeline-dot"></div>
                          @if (stageIndex < dayGroup.stages.length - 1) {
                            <div class="timeline-line"></div>
                          }
                        </div>

                        <div class="stage-content">
                          <div class="stage-time">
                            @if (stage.start_time) {
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12 6 12 12 16 14"/>
                              </svg>
                              {{ formatTime(stage.start_time) }}
                              @if (stage.end_time) {
                                - {{ formatTime(stage.end_time) }}
                              }
                            }
                          </div>

                          <h4>{{ getStageTitle(stage) }}</h4>

                          @if (getStageLocation(stage)) {
                            <div class="stage-location">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                              </svg>
                              {{ getStageLocation(stage) }}
                            </div>
                          }

                          <p class="stage-description">{{ getStageDescription(stage) }}</p>

                          @if (stage.images && stage.images.length > 0) {
                            <div class="stage-images">
                              @for (image of stage.images; track image) {
                                <img [src]="image" [alt]="getStageTitle(stage)" />
                              }
                            </div>
                          }

                          @if (stage.duration_minutes > 0) {
                            <div class="stage-duration">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12 6 12 12 16 14"/>
                              </svg>
                              {{ formatDuration(stage.duration_minutes) }}
                            </div>
                          }
                        </div>
                      </div>
                    }
                  </div>
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
      max-width: 900px;
      margin: 0 auto;
    }

    .day-section {
      margin-bottom: var(--spacing-4xl);
    }

    .day-header {
      margin-bottom: var(--spacing-xl);
    }

    .day-number {
      display: inline-block;
      background: var(--color-primary);
      color: var(--color-white);
      padding: var(--spacing-sm) var(--spacing-xl);
      border-radius: var(--radius-full);
      font-weight: 700;
      font-size: 1.1rem;
    }

    .stages-container {
      background: var(--color-white);
      border-radius: var(--radius-xl);
      padding: var(--spacing-2xl);
      box-shadow: var(--shadow-lg);
    }

    .stage-card {
      display: grid;
      grid-template-columns: 40px 1fr;
      gap: var(--spacing-lg);
      padding: var(--spacing-xl) 0;
    }

    .stage-card:not(:last-child) {
      border-bottom: 1px solid rgba(61, 43, 31, 0.1);
    }

    .stage-timeline {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .timeline-dot {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--color-secondary);
      border: 3px solid var(--color-white);
      box-shadow: 0 0 0 2px var(--color-secondary);
      z-index: 1;
    }

    .timeline-line {
      position: absolute;
      top: 16px;
      width: 2px;
      height: calc(100% + var(--spacing-xl) * 2);
      background: linear-gradient(to bottom, var(--color-secondary), rgba(43, 138, 138, 0.3));
    }

    .stage-content h4 {
      color: var(--color-primary);
      margin-bottom: var(--spacing-sm);
    }

    .stage-time {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      font-size: 0.9rem;
      color: var(--color-secondary);
      font-weight: 600;
      margin-bottom: var(--spacing-sm);
    }

    .stage-location {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      font-size: 0.85rem;
      color: var(--color-text-light);
      margin-bottom: var(--spacing-md);
    }

    .stage-description {
      color: var(--color-text);
      line-height: 1.7;
      margin-bottom: var(--spacing-lg);
    }

    .stage-images {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-lg);
    }

    .stage-images img {
      width: 100%;
      height: 150px;
      object-fit: cover;
      border-radius: var(--radius-md);
    }

    .stage-duration {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-xs) var(--spacing-md);
      background: var(--color-background-alt);
      border-radius: var(--radius-full);
      font-size: 0.85rem;
      color: var(--color-text-light);
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
    }

    @media (max-width: 600px) {
      .stage-card {
        grid-template-columns: 30px 1fr;
        gap: var(--spacing-md);
      }

      .stage-images {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CircuitDetailComponent implements OnInit {
  lang = inject(LanguageService);
  private route = inject(ActivatedRoute);
  private circuitService = inject(CircuitService);
  private stageService = inject(CircuitStageService);

  circuit = signal<Circuit | null>(null);
  stages = signal<CircuitStage[]>([]);
  isLoading = signal(true);

  groupedStages = computed(() => {
    const allStages = this.stages();
    const grouped = new Map<number, CircuitStage[]>();

    allStages.forEach(stage => {
      const existing = grouped.get(stage.day_number) || [];
      existing.push(stage);
      grouped.set(stage.day_number, existing);
    });

    const result: DayStages[] = [];
    grouped.forEach((stages, dayNumber) => {
      result.push({ dayNumber, stages });
    });

    return result.sort((a, b) => a.dayNumber - b.dayNumber);
  });

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
    const excursion = await this.circuitService.getCircuitBySlug(slug);
    this.circuit.set(excursion);

    if (excursion) {
      const stages = await this.stageService.getStagesByExcursionId(excursion.id);
      this.stages.set(stages);
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
    return [
      this.lang.t('booking.includedGuide'),
      this.lang.t('booking.includedTransport'),
      this.lang.t('booking.includedEntrance')
    ];
  }

  getStageTitle(stage: CircuitStage): string {
    return this.lang.language() === 'fr' ? stage.title_fr : stage.title_en;
  }

  getStageDescription(stage: CircuitStage): string {
    return this.lang.language() === 'fr' ? stage.description_fr : stage.description_en;
  }

  getStageLocation(stage: CircuitStage): string {
    return this.lang.language() === 'fr' ? stage.location_fr : stage.location_en;
  }

  formatTime(time: string): string {
    if (!time) return '';
    return time.substring(0, 5);
  }

  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) {
      return `${hours}h`;
    }
    return `${hours}h${mins}`;
  }
}
