import { Component, inject, signal, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { ScrollAnimateDirective } from '../../shared/directives/scroll-animate.directive';
import { ExcursionService, Excursion } from '../../core/services/excursion.service';

@Component({
  selector: 'app-excursions',
  standalone: true,
  imports: [RouterLink, DecimalPipe, ScrollAnimateDirective],
  template: `
    <section class="page-hero">
      <div class="hero-overlay"></div>
      <div class="hero-content container">
        <h1>{{ lang.t('excursions.title') }}</h1>
        <p>{{ lang.t('excursions.subtitle') }}</p>
      </div>
    </section>

    <section class="excursions-intro section">
      <div class="container">
        <div class="intro-content" appScrollAnimate>
          <p class="lead">{{ lang.t('excursions.intro') }}</p>
        </div>
      </div>
    </section>

    <section class="excursions-list section" style="background: var(--color-background-alt);">
      <div class="container">
        @if (isLoading()) {
          <div class="loading">
            <div class="spinner"></div>
          </div>
        } @else {
          <div class="excursions-grid">
            @for (excursion of excursions(); track excursion.id; let i = $index) {
              <div class="excursion-card" appScrollAnimate [animationDelay]="i * 100">
                <div class="excursion-image">
                  <img [src]="excursion.image_url" [alt]="getTitle(excursion)" />
                  <div class="excursion-duration">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {{ getDuration(excursion) }}
                  </div>
                </div>
                <div class="excursion-content">
                  <h3>{{ getTitle(excursion) }}</h3>
                  <p class="excursion-description">{{ getDescription(excursion) }}</p>
                  <div class="excursion-highlights">
                    <h4>{{ lang.t('excursions.highlights') }}</h4>
                    <ul>
                      @for (highlight of getHighlights(excursion); track highlight) {
                        <li>{{ highlight }}</li>
                      }
                    </ul>
                  </div>
                  <div class="excursion-footer">
                    <div class="excursion-price">
                      <span class="price-label">{{ lang.t('excursions.from') }}</span>
                      <span class="price-value">{{ excursion.price | number }} FCFA</span>
                      <span class="price-note">{{ getPriceNote(excursion) }}</span>
                    </div>
                    <a [routerLink]="['/booking', excursion.slug]" class="btn btn-primary">{{ lang.t('excursions.book') }}</a>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </section>

    <section class="custom-excursion section">
      <div class="container">
        <div class="custom-content">
          <div class="custom-text" appScrollAnimate animationType="fade-right">
            <h2>{{ lang.t('excursions.custom.title') }}</h2>
            <p>{{ lang.t('excursions.custom.text') }}</p>
            <a routerLink="/contact" class="btn btn-secondary">{{ lang.t('excursions.custom.cta') }}</a>
          </div>
          <div class="custom-image" appScrollAnimate animationType="fade-left" [animationDelay]="200">
            <img src="https://images.pexels.com/photos/14604774/pexels-photo-14604774.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Custom excursion" />
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <div class="cta-content" appScrollAnimate animationType="fade-in">
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
      background: url('https://images.pexels.com/photos/12715636/pexels-photo-12715636.jpeg?auto=compress&cs=tinysrgb&w=1920') center/cover no-repeat;
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

    .excursions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: var(--spacing-2xl);
    }

    .excursion-card {
      background: var(--color-white);
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-lg);
      transition: all var(--transition-base);
      display: flex;
      flex-direction: column;
    }

    .excursion-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-xl);
    }

    .excursion-image {
      position: relative;
      height: 250px;
    }

    .excursion-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .excursion-duration {
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

    .excursion-content {
      padding: var(--spacing-xl);
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }

    .excursion-content h3 {
      margin-bottom: var(--spacing-md);
      color: var(--color-primary);
    }

    .excursion-description {
      color: var(--color-text-light);
      line-height: 1.7;
      margin-bottom: var(--spacing-lg);
    }

    .excursion-highlights {
      margin-bottom: var(--spacing-xl);
      flex-grow: 1;
    }

    .excursion-highlights h4 {
      font-size: 0.9rem;
      font-family: var(--font-body);
      font-weight: 600;
      color: var(--color-secondary);
      margin-bottom: var(--spacing-sm);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .excursion-highlights ul {
      list-style: none;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .excursion-highlights li {
      position: relative;
      padding-left: var(--spacing-lg);
      font-size: 0.95rem;
      color: var(--color-text);
    }

    .excursion-highlights li::before {
      content: '';
      position: absolute;
      left: 0;
      top: 8px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--color-accent);
    }

    .excursion-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: var(--spacing-lg);
      border-top: 1px solid rgba(61, 43, 31, 0.1);
    }

    .excursion-price {
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
      .excursions-grid {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      }

      .custom-content {
        grid-template-columns: 1fr;
        gap: var(--spacing-2xl);
      }

      .custom-image {
        order: -1;
      }
    }

    .loading {
      display: flex;
      justify-content: center;
      padding: var(--spacing-4xl);
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(61, 43, 31, 0.1);
      border-top-color: var(--color-primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 480px) {
      .excursions-grid {
        grid-template-columns: 1fr;
      }

      .excursion-footer {
        flex-direction: column;
        gap: var(--spacing-lg);
        align-items: flex-start;
      }

      .excursion-footer .btn {
        width: 100%;
      }
    }
  `]
})
export class ExcursionsComponent implements OnInit {
  lang = inject(LanguageService);
  excursionService = inject(ExcursionService);

  excursions = signal<Excursion[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.loadExcursions();
  }

  async loadExcursions(): Promise<void> {
    this.isLoading.set(true);
    const data = await this.excursionService.loadExcursions();
    this.excursions.set(data);
    this.isLoading.set(false);
  }

  getTitle(excursion: Excursion): string {
    return this.lang.language() === 'fr' ? excursion.title_fr : excursion.title_en;
  }

  getDuration(excursion: Excursion): string {
    return this.lang.language() === 'fr' ? excursion.duration_fr : excursion.duration_en;
  }

  getDescription(excursion: Excursion): string {
    return this.lang.language() === 'fr' ? excursion.description_fr : excursion.description_en;
  }

  getHighlights(excursion: Excursion): string[] {
    return this.lang.language() === 'fr' ? excursion.highlights_fr : excursion.highlights_en;
  }

  getPriceNote(excursion: Excursion): string {
    return this.lang.language() === 'fr' ? excursion.price_note_fr : excursion.price_note_en;
  }
}
