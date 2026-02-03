import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { ScrollAnimateDirective } from '../../shared/directives/scroll-animate.directive';
import { RentalService, Rental } from '../../core/services/rental.service';
import { CurrencyConverterPipe } from '../../shared/pipes/currency-converter.pipe';

@Component({
  selector: 'app-rentals',
  standalone: true,
  imports: [RouterLink, ScrollAnimateDirective, CurrencyConverterPipe],
  template: `
    <section class="page-hero">
      <div class="hero-overlay"></div>
      <div class="hero-content container">
        <h1>{{ lang.t('rentals.title') }}</h1>
        <p>{{ lang.t('rentals.subtitle') }}</p>
      </div>
    </section>

    <section class="rentals-intro section">
      <div class="container">
        <div class="intro-content" appScrollAnimate>
          <p class="lead">{{ lang.t('rentals.intro') }}</p>
        </div>
      </div>
    </section>

    <section class="rentals-vehicles section" style="background: var(--color-background-alt);">
      <div class="container">
        <div class="section-header" appScrollAnimate>
          <h2>{{ lang.t('rentals.vehicles.title') }}</h2>
          <p>{{ lang.t('rentals.vehicles.description') }}</p>
          <div class="vehicle-types">
            <div class="vehicle-type-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/>
                <circle cx="6.5" cy="16.5" r="2.5"/>
                <circle cx="16.5" cy="16.5" r="2.5"/>
              </svg>
              <span>4x4</span>
            </div>
            <div class="vehicle-type-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 17h2l.64-2.54c.24-.959.24-1.962 0-2.92l-1.07-4.27A3 3 0 0 0 17.66 5H4a2 2 0 0 0-2 2v10h2"/>
                <circle cx="7" cy="17" r="2"/>
                <path d="M9 17h6"/>
                <circle cx="17" cy="17" r="2"/>
              </svg>
              <span>{{ lang.language() === 'fr' ? 'Berlines' : 'Sedans' }}</span>
            </div>
            <div class="vehicle-type-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8 6v6"/>
                <path d="M15 6v6"/>
                <path d="M2 12h19.6"/>
                <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/>
                <circle cx="7" cy="18" r="2"/>
                <circle cx="17" cy="18" r="2"/>
              </svg>
              <span>Minibus</span>
            </div>
            <div class="vehicle-type-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8 6v6"/>
                <path d="M15 6v6"/>
                <path d="M2 12h19.6"/>
                <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/>
                <circle cx="7" cy="18" r="2"/>
                <path d="M9 18h5"/>
                <circle cx="16" cy="18" r="2"/>
              </svg>
              <span>Bus</span>
            </div>
          </div>
        </div>

        @if (isLoadingVehicles()) {
          <div class="loading">
            <div class="spinner"></div>
          </div>
        } @else if (vehicles().length === 0) {
          <div class="empty-state" appScrollAnimate>
            <p>{{ lang.t('rentals.noVehicles') }}</p>
          </div>
        } @else {
          <div class="rentals-grid">
            @for (vehicle of vehicles(); track vehicle.id; let i = $index) {
              <div class="rental-card" appScrollAnimate [animationDelay]="i * 100">
                <div class="rental-image">
                  <img [src]="vehicle.image_url" [alt]="getName(vehicle)" />
                  <div class="rental-category">{{ vehicle.category }}</div>
                </div>
                <div class="rental-content">
                  <h3>{{ getName(vehicle) }}</h3>
                  <p class="rental-description">{{ getDescription(vehicle) }}</p>
                  <div class="rental-features">
                    <h4>{{ lang.t('rentals.features') }}</h4>
                    <ul>
                      @for (feature of getFeatures(vehicle); track feature) {
                        <li>{{ feature }}</li>
                      }
                    </ul>
                  </div>
                  <div class="rental-footer">
                    <div class="rental-info">
                      <div class="rental-capacity">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                        {{ vehicle.capacity }} {{ lang.t('rentals.passengers') }}
                      </div>
                      <div class="rental-price">
                        <span class="price-value">{{ vehicle.price_per_day | currencyConverter }}</span>
                        <span class="price-note">{{ lang.t('rentals.perDay') }}</span>
                      </div>
                    </div>
                    <a routerLink="/contact" class="btn btn-primary">{{ lang.t('rentals.contact') }}</a>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </section>

    <section class="rentals-incentives section">
      <div class="container">
        <div class="section-header" appScrollAnimate>
          <div class="section-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              <polyline points="16 12 18 14 22 10"/>
            </svg>
          </div>
          <h2>{{ lang.t('rentals.incentives.title') }}</h2>
          <p>{{ lang.t('rentals.incentives.description') }}</p>
        </div>

        @if (isLoadingIncentives()) {
          <div class="loading">
            <div class="spinner"></div>
          </div>
        } @else if (incentives().length === 0) {
          <div class="empty-state" appScrollAnimate>
            <p>{{ lang.t('rentals.noIncentives') }}</p>
          </div>
        } @else {
          <div class="rentals-grid">
            @for (incentive of incentives(); track incentive.id; let i = $index) {
              <div class="rental-card" appScrollAnimate [animationDelay]="i * 100">
                <div class="rental-image">
                  <img [src]="incentive.image_url" [alt]="getName(incentive)" />
                </div>
                <div class="rental-content">
                  <h3>{{ getName(incentive) }}</h3>
                  <p class="rental-description">{{ getDescription(incentive) }}</p>
                  <div class="rental-features">
                    <h4>{{ lang.t('rentals.included') }}</h4>
                    <ul>
                      @for (feature of getFeatures(incentive); track feature) {
                        <li>{{ feature }}</li>
                      }
                    </ul>
                  </div>
                  <div class="rental-footer">
                    <div class="rental-info">
                      <div class="rental-capacity">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                        {{ incentive.capacity }} {{ lang.t('rentals.people') }}
                      </div>
                      <div class="rental-price">
                        <span class="price-value">{{ incentive.price_per_day | currencyConverter }}</span>
                        <span class="price-note">{{ getPriceNote(incentive) }}</span>
                      </div>
                    </div>
                    <a routerLink="/contact" class="btn btn-primary">{{ lang.t('rentals.contact') }}</a>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </section>

    <section class="rentals-boats section" style="background: var(--color-background-alt);">
      <div class="container">
        <div class="section-header" appScrollAnimate>
          <div class="section-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
              <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/>
              <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/>
              <path d="M12 10v4"/>
              <path d="M12 2v3"/>
            </svg>
          </div>
          <h2>{{ lang.t('rentals.boats.title') }}</h2>
          <p>{{ lang.t('rentals.boats.description') }}</p>
        </div>

        @if (isLoadingBoats()) {
          <div class="loading">
            <div class="spinner"></div>
          </div>
        } @else if (boats().length === 0) {
          <div class="empty-state" appScrollAnimate>
            <p>{{ lang.t('rentals.noBoats') }}</p>
          </div>
        } @else {
          <div class="rentals-grid">
            @for (boat of boats(); track boat.id; let i = $index) {
              <div class="rental-card" appScrollAnimate [animationDelay]="i * 100">
                <div class="rental-image">
                  <img [src]="boat.image_url" [alt]="getName(boat)" />
                </div>
                <div class="rental-content">
                  <h3>{{ getName(boat) }}</h3>
                  <p class="rental-description">{{ getDescription(boat) }}</p>
                  <div class="rental-features">
                    <h4>{{ lang.t('rentals.amenities') }}</h4>
                    <ul>
                      @for (feature of getFeatures(boat); track feature) {
                        <li>{{ feature }}</li>
                      }
                    </ul>
                  </div>
                  <div class="rental-footer">
                    <div class="rental-info">
                      <div class="rental-capacity">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                        {{ boat.capacity }} {{ lang.t('rentals.guests') }}
                      </div>
                      <div class="rental-price">
                        <span class="price-value">{{ boat.price_per_day | currencyConverter }}</span>
                        <span class="price-note">{{ getPriceNote(boat) }}</span>
                      </div>
                    </div>
                    <a routerLink="/contact" class="btn btn-primary">{{ lang.t('rentals.contact') }}</a>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <div class="cta-content" appScrollAnimate animationType="fade-in">
          <h2>{{ lang.t('rentals.cta.title') }}</h2>
          <p>{{ lang.t('rentals.cta.text') }}</p>
          <a routerLink="/contact" class="btn btn-accent">{{ lang.t('rentals.cta.button') }}</a>
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
      background: url('https://media.istockphoto.com/id/1218922039/fr/photo/personnes-travaillant-et-trafic-%C3%A0-dakar-la-capitale-du-s%C3%A9n%C3%A9gal-afrique-de-louest.jpg?s=612x612&w=0&k=20&c=53eOKujkWl6U8PRNKSeGulSgwWPzNcld4FcZ2xlLUVM=') center/cover no-repeat;
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

    .section-header {
      text-align: center;
      margin-bottom: var(--spacing-3xl);
    }

    .section-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      margin: 0 auto var(--spacing-lg);
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
      border-radius: 50%;
      color: var(--color-white);
      box-shadow: var(--shadow-lg);
    }

    .section-header h2 {
      margin-bottom: var(--spacing-md);
    }

    .section-header p {
      color: var(--color-text-light);
      font-size: 1.125rem;
      max-width: 700px;
      margin: 0 auto;
    }

    .vehicle-types {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: var(--spacing-lg);
      margin-top: var(--spacing-xl);
    }

    .vehicle-type-badge {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-md) var(--spacing-xl);
      background: var(--color-white);
      border-radius: var(--radius-full);
      box-shadow: var(--shadow-md);
      font-weight: 600;
      color: var(--color-primary);
      transition: all var(--transition-base);
    }

    .vehicle-type-badge svg {
      color: var(--color-secondary);
    }

    .vehicle-type-badge:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
      background: var(--color-primary);
      color: var(--color-white);
    }

    .vehicle-type-badge:hover svg {
      color: var(--color-white);
    }

    .rentals-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: var(--spacing-2xl);
    }

    .rental-card {
      background: var(--color-white);
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-lg);
      transition: all var(--transition-base);
      display: flex;
      flex-direction: column;
    }

    .rental-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-xl);
    }

    .rental-image {
      position: relative;
      height: 250px;
    }

    .rental-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .rental-category {
      position: absolute;
      top: var(--spacing-lg);
      right: var(--spacing-lg);
      background: var(--color-accent);
      color: var(--color-white);
      padding: var(--spacing-sm) var(--spacing-lg);
      border-radius: var(--radius-full);
      font-size: 0.875rem;
      font-weight: 600;
      box-shadow: var(--shadow-md);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .rental-content {
      padding: var(--spacing-xl);
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }

    .rental-content h3 {
      margin-bottom: var(--spacing-md);
      color: var(--color-primary);
    }

    .rental-description {
      color: var(--color-text-light);
      line-height: 1.7;
      margin-bottom: var(--spacing-lg);
    }

    .rental-features {
      margin-bottom: var(--spacing-xl);
      flex-grow: 1;
    }

    .rental-features h4 {
      font-size: 0.9rem;
      font-family: var(--font-body);
      font-weight: 600;
      color: var(--color-secondary);
      margin-bottom: var(--spacing-sm);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .rental-features ul {
      list-style: none;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .rental-features li {
      position: relative;
      padding-left: var(--spacing-lg);
      font-size: 0.95rem;
      color: var(--color-text);
    }

    .rental-features li::before {
      content: '';
      position: absolute;
      left: 0;
      top: 8px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--color-accent);
    }

    .rental-footer {
      padding-top: var(--spacing-lg);
      border-top: 1px solid rgba(61, 43, 31, 0.1);
    }

    .rental-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--spacing-lg);
    }

    .rental-capacity {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      color: var(--color-text);
      font-size: 0.95rem;
      font-weight: 500;
    }

    .rental-capacity svg {
      color: var(--color-secondary);
    }

    .rental-price {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .price-value {
      font-family: var(--font-heading);
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-primary);
    }

    .price-note {
      font-size: 0.75rem;
      color: var(--color-text-light);
    }

    .rental-footer .btn {
      width: 100%;
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
      margin-bottom: var(--spacing-md);
    }

    .cta-content p {
      color: var(--color-white);
      opacity: 0.95;
      font-size: 1.125rem;
      margin-bottom: var(--spacing-xl);
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    @media (max-width: 992px) {
      .rentals-grid {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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

    .empty-state {
      text-align: center;
      padding: var(--spacing-4xl) var(--spacing-xl);
      background: var(--color-white);
      border-radius: var(--radius-xl);
      color: var(--color-text-light);
    }

    @media (max-width: 768px) {
      .vehicle-types {
        gap: var(--spacing-md);
      }

      .vehicle-type-badge {
        padding: var(--spacing-sm) var(--spacing-lg);
        font-size: 0.9rem;
      }

      .vehicle-type-badge svg {
        width: 20px;
        height: 20px;
      }

      .section-icon {
        width: 64px;
        height: 64px;
      }

      .section-icon svg {
        width: 36px;
        height: 36px;
      }
    }

    @media (max-width: 480px) {
      .rentals-grid {
        grid-template-columns: 1fr;
      }

      .vehicle-types {
        flex-direction: column;
        align-items: stretch;
      }

      .vehicle-type-badge {
        justify-content: center;
      }
    }
  `]
})
export class RentalsComponent implements OnInit {
  lang = inject(LanguageService);
  rentalService = inject(RentalService);

  vehicles = signal<Rental[]>([]);
  incentives = signal<Rental[]>([]);
  boats = signal<Rental[]>([]);

  isLoadingVehicles = signal(true);
  isLoadingIncentives = signal(true);
  isLoadingBoats = signal(true);

  ngOnInit(): void {
    this.loadRentals();
  }

  async loadRentals(): Promise<void> {
    this.loadVehicles();
    this.loadIncentives();
    this.loadBoats();
  }

  async loadVehicles(): Promise<void> {
    this.isLoadingVehicles.set(true);
    const data = await this.rentalService.loadRentalsByType('vehicle');
    this.vehicles.set(data);
    this.isLoadingVehicles.set(false);
  }

  async loadIncentives(): Promise<void> {
    this.isLoadingIncentives.set(true);
    const data = await this.rentalService.loadRentalsByType('incentive');
    this.incentives.set(data);
    this.isLoadingIncentives.set(false);
  }

  async loadBoats(): Promise<void> {
    this.isLoadingBoats.set(true);
    const data = await this.rentalService.loadRentalsByType('boat');
    this.boats.set(data);
    this.isLoadingBoats.set(false);
  }

  getName(rental: Rental): string {
    return this.lang.language() === 'fr' ? rental.name_fr : rental.name_en;
  }

  getDescription(rental: Rental): string {
    return this.lang.language() === 'fr' ? rental.description_fr : rental.description_en;
  }

  getFeatures(rental: Rental): string[] {
    return this.lang.language() === 'fr' ? rental.features_fr : rental.features_en;
  }

  getPriceNote(rental: Rental): string {
    return this.lang.language() === 'fr' ? rental.price_note_fr : rental.price_note_en;
  }
}
