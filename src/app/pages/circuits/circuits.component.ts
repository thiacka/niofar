import { Component, inject, signal, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { ScrollAnimateDirective } from '../../shared/directives/scroll-animate.directive';
import { CircuitService, Circuit } from '../../core/services/circuit.service';

@Component({
  selector: 'app-circuits',
  standalone: true,
  imports: [RouterLink, DecimalPipe, ScrollAnimateDirective],
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
        <div class="intro-content" appScrollAnimate>
          <p class="lead">{{ lang.t('circuits.intro') }}</p>
        </div>
      </div>
    </section>

    <section class="circuits-list section" style="background: var(--color-background-alt);">
      <div class="container">
        @if (isLoading()) {
          <div class="loading">
            <div class="spinner"></div>
          </div>
        } @else {
          <div class="circuits-grid">
            @for (circuit of circuits(); track circuit.id; let i = $index) {
              <div class="circuit-card" appScrollAnimate [animationDelay]="i * 100">
                <div class="circuit-image">
                  <img [src]="circuit.image_url" [alt]="getTitle(circuit)" />
                  <div class="circuit-duration">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {{ getDuration(circuit) }}
                  </div>
                </div>
                <div class="circuit-content">
                  <h3>{{ getTitle(circuit) }}</h3>
                  <p class="circuit-description">{{ getDescription(circuit) }}</p>
                  <div class="circuit-highlights">
                    <h4>{{ lang.t('circuits.highlights') }}</h4>
                    <ul>
                      @for (highlight of getHighlights(circuit); track highlight) {
                        <li>{{ highlight }}</li>
                      }
                    </ul>
                  </div>
                  <div class="circuit-footer">
                    <div class="circuit-price">
                      <span class="price-label">{{ lang.t('circuits.from') }}</span>
                      <span class="price-value">{{ circuit.price | number }} FCFA</span>
                      <span class="price-note">{{ getPriceNote(circuit) }}</span>
                    </div>
                    <a [routerLink]="['/booking', circuit.slug]" class="btn btn-primary">{{ lang.t('circuits.book') }}</a>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </section>

    <section class="custom-circuit section">
      <div class="container">
        <div class="custom-content">
          <div class="custom-text" appScrollAnimate animationType="fade-right">
            <h2>{{ lang.t('circuits.custom.title') }}</h2>
            <p>{{ lang.t('circuits.custom.text') }}</p>
            <a routerLink="/contact" class="btn btn-secondary">{{ lang.t('circuits.custom.cta') }}</a>
          </div>
          <div class="custom-image" appScrollAnimate animationType="fade-left" [animationDelay]="200">
            <img src="https://images.pexels.com/photos/14604774/pexels-photo-14604774.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Custom circuit" />
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
      background: url('https://images.pexels.com/photos/16558028/pexels-photo-16558028.jpeg?auto=compress&cs=tinysrgb&w=1920') center/cover no-repeat;
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
export class CircuitsComponent implements OnInit {
  lang = inject(LanguageService);
  circuitService = inject(CircuitService);

  circuits = signal<Circuit[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.loadCircuits();
  }

  async loadCircuits(): Promise<void> {
    this.isLoading.set(true);
    const data = await this.circuitService.loadCircuits();
    this.circuits.set(data);
    this.isLoading.set(false);
  }

  getTitle(circuit: Circuit): string {
    return this.lang.language() === 'fr' ? circuit.title_fr : circuit.title_en;
  }

  getDuration(circuit: Circuit): string {
    return this.lang.language() === 'fr' ? circuit.duration_fr : circuit.duration_en;
  }

  getDescription(circuit: Circuit): string {
    return this.lang.language() === 'fr' ? circuit.description_fr : circuit.description_en;
  }

  getHighlights(circuit: Circuit): string[] {
    return this.lang.language() === 'fr' ? circuit.highlights_fr : circuit.highlights_en;
  }

  getPriceNote(circuit: Circuit): string {
    return this.lang.language() === 'fr' ? circuit.price_note_fr : circuit.price_note_en;
  }
}
