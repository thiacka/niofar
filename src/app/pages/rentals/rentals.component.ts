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
      background: url('https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=1920') center/cover no-repeat;
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

    .section-header h2 {
      margin-bottom: var(--spacing-md);
    }

    .section-header p {
      color: var(--color-text-light);
      font-size: 1.125rem;
      max-width: 700px;
      margin: 0 auto;
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

    @media (max-width: 480px) {
      .rentals-grid {
        grid-template-columns: 1fr;
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
