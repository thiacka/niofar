import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';
import { BookingService } from '../../core/services/booking.service';
import { CircuitService, Circuit } from '../../core/services/circuit.service';
import { ScrollAnimateDirective } from '../../shared/directives/scroll-animate.directive';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [FormsModule, RouterLink, DecimalPipe, ScrollAnimateDirective],
  template: `
    <section class="page-hero">
      <div class="hero-overlay"></div>
      <div class="hero-content container">
        <h1>{{ lang.t('booking.title') }}</h1>
        <p>{{ lang.t('booking.subtitle') }}</p>
      </div>
    </section>

    <section class="booking section">
      <div class="container">
        @if (isLoadingCircuit()) {
          <div class="loading">
            <div class="spinner-large"></div>
          </div>
        } @else if (circuit()) {
          <div class="booking-grid">
            <div class="booking-form-wrapper" appScrollAnimate animationType="fade-right">
              <div class="selected-circuit">
                <img [src]="circuit()!.image_url" [alt]="getTitle()" />
                <div class="circuit-info">
                  <h3>{{ getTitle() }}</h3>
                  <span class="duration">{{ getDuration() }}</span>
                  <div class="price">
                    <span class="price-value">{{ circuit()!.price | number }} FCFA</span>
                    <span class="price-note">{{ getPriceNote() }}</span>
                  </div>
                </div>
              </div>

              <form class="booking-form" (ngSubmit)="onSubmit()" #bookingForm="ngForm">
                <h3>{{ lang.t('booking.details') }}</h3>

                <div class="form-row">
                  <div class="form-group">
                    <label for="firstName">{{ lang.t('booking.firstName') }} *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      [(ngModel)]="formData.firstName"
                      required
                      [disabled]="isSubmitting()"
                    />
                  </div>
                  <div class="form-group">
                    <label for="lastName">{{ lang.t('booking.lastName') }} *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      [(ngModel)]="formData.lastName"
                      required
                      [disabled]="isSubmitting()"
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="email">{{ lang.t('contact.email') }} *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      [(ngModel)]="formData.email"
                      required
                      [disabled]="isSubmitting()"
                    />
                  </div>
                  <div class="form-group">
                    <label for="phone">{{ lang.t('booking.phone') }}</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      [(ngModel)]="formData.phone"
                      [disabled]="isSubmitting()"
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label for="country">{{ lang.t('contact.country') }} *</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    [(ngModel)]="formData.country"
                    required
                    [disabled]="isSubmitting()"
                  />
                </div>

                <h3>{{ lang.t('booking.tripDetails') }}</h3>

                <div class="form-row">
                  <div class="form-group">
                    <label for="startDate">{{ lang.t('booking.startDate') }} *</label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      [(ngModel)]="formData.startDate"
                      required
                      [min]="minDate"
                      [disabled]="isSubmitting()"
                    />
                  </div>
                  <div class="form-group">
                    <label for="endDate">{{ lang.t('booking.endDate') }}</label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      [(ngModel)]="formData.endDate"
                      [min]="formData.startDate || minDate"
                      [disabled]="isSubmitting()"
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="adults">{{ lang.t('booking.adults') }} *</label>
                    <select
                      id="adults"
                      name="adults"
                      [(ngModel)]="formData.adults"
                      required
                      [disabled]="isSubmitting()"
                    >
                      @for (n of [1,2,3,4,5,6,7,8,9,10]; track n) {
                        <option [value]="n">{{ n }}</option>
                      }
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="children">{{ lang.t('booking.children') }}</label>
                    <select
                      id="children"
                      name="children"
                      [(ngModel)]="formData.children"
                      [disabled]="isSubmitting()"
                    >
                      @for (n of [0,1,2,3,4,5,6]; track n) {
                        <option [value]="n">{{ n }}</option>
                      }
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label for="specialRequests">{{ lang.t('booking.specialRequests') }}</label>
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    rows="4"
                    [(ngModel)]="formData.specialRequests"
                    [placeholder]="lang.t('booking.specialRequestsPlaceholder')"
                    [disabled]="isSubmitting()"
                  ></textarea>
                </div>

                <div class="estimate-box">
                  <div class="estimate-header">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 16v-4"/>
                      <path d="M12 8h.01"/>
                    </svg>
                    <span>{{ lang.t('booking.estimateNote') }}</span>
                  </div>
                  <div class="estimate-total">
                    <span>{{ lang.t('booking.estimatedTotal') }}</span>
                    <span class="total-value">{{ estimatedTotal() | number }} FCFA</span>
                  </div>
                </div>

                @if (dateError()) {
                  <div class="alert alert-error">
                    {{ lang.t('booking.dateError') }}
                  </div>
                }

                @if (successMessage()) {
                  <div class="alert alert-success">
                    {{ lang.t('booking.success') }}
                  </div>
                }

                @if (errorMessage()) {
                  <div class="alert alert-error">
                    {{ lang.t('booking.error') }}
                  </div>
                }

                <button
                  type="submit"
                  class="btn btn-primary btn-large"
                  [disabled]="!bookingForm.valid || isSubmitting()"
                >
                  @if (isSubmitting()) {
                    <span class="spinner"></span>
                  } @else {
                    {{ lang.t('booking.submit') }}
                  }
                </button>

                <p class="form-note">{{ lang.t('booking.note') }}</p>
              </form>
            </div>

            <div class="booking-sidebar" appScrollAnimate animationType="fade-left" [animationDelay]="200">
              <div class="help-card">
                <h4>{{ lang.t('booking.needHelp') }}</h4>
                <p>{{ lang.t('booking.helpText') }}</p>
                <div class="contact-options">
                  <a href="mailto:contact@niofar.com" class="contact-option">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <span>contact&#64;niofar.com</span>
                  </a>
                  <a href="tel:+221XXXXXXXX" class="contact-option">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    <span>+221 XX XXX XX XX</span>
                  </a>
                </div>
              </div>

              <div class="info-card">
                <h4>{{ lang.t('booking.included') }}</h4>
                <ul>
                  <li>{{ lang.t('booking.includedGuide') }}</li>
                  <li>{{ lang.t('booking.includedTransport') }}</li>
                  <li>{{ lang.t('booking.includedEntrance') }}</li>
                </ul>
              </div>

              <a routerLink="/circuits" class="back-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 12H5"/>
                  <polyline points="12 19 5 12 12 5"/>
                </svg>
                {{ lang.t('booking.backToCircuits') }}
              </a>
            </div>
          </div>
        } @else {
          <div class="not-found">
            <h2>{{ lang.t('booking.notFound') }}</h2>
            <a routerLink="/circuits" class="btn btn-primary">{{ lang.t('booking.browseCircuits') }}</a>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .page-hero {
      position: relative;
      height: 40vh;
      min-height: 300px;
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
      margin-bottom: var(--spacing-sm);
    }

    .hero-content p {
      font-size: 1.125rem;
      opacity: 0.95;
    }

    .booking-grid {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: var(--spacing-2xl);
      align-items: start;
    }

    .booking-form-wrapper {
      background: var(--color-white);
      border-radius: var(--radius-xl);
      padding: var(--spacing-2xl);
      box-shadow: var(--shadow-lg);
    }

    .selected-circuit {
      display: flex;
      gap: var(--spacing-lg);
      padding-bottom: var(--spacing-xl);
      margin-bottom: var(--spacing-xl);
      border-bottom: 1px solid rgba(61, 43, 31, 0.1);
    }

    .selected-circuit img {
      width: 150px;
      height: 100px;
      object-fit: cover;
      border-radius: var(--radius-md);
    }

    .circuit-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .circuit-info h3 {
      font-size: 1.25rem;
      margin-bottom: var(--spacing-xs);
      color: var(--color-primary);
    }

    .circuit-info .duration {
      font-size: 0.9rem;
      color: var(--color-text-light);
      margin-bottom: var(--spacing-sm);
    }

    .circuit-info .price {
      display: flex;
      flex-direction: column;
    }

    .circuit-info .price-value {
      font-family: var(--font-heading);
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-text);
    }

    .circuit-info .price-note {
      font-size: 0.8rem;
      color: var(--color-text-light);
    }

    .booking-form h3 {
      font-size: 1.1rem;
      margin-bottom: var(--spacing-lg);
      padding-bottom: var(--spacing-sm);
      border-bottom: 2px solid var(--color-primary);
      display: inline-block;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-lg);
    }

    .form-group {
      margin-bottom: var(--spacing-lg);
    }

    .form-group label {
      display: block;
      margin-bottom: var(--spacing-sm);
      font-weight: 600;
      color: var(--color-text);
      font-size: 0.95rem;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: var(--spacing-md);
      border: 2px solid rgba(61, 43, 31, 0.15);
      border-radius: var(--radius-md);
      background: var(--color-background);
      transition: all var(--transition-fast);
      font-size: 1rem;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: var(--color-primary);
      background: var(--color-white);
    }

    .form-group input:disabled,
    .form-group select:disabled,
    .form-group textarea:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .form-group textarea {
      resize: vertical;
      min-height: 100px;
    }

    .estimate-box {
      background: var(--color-background-alt);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
      margin-bottom: var(--spacing-xl);
    }

    .estimate-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      color: var(--color-text-light);
      font-size: 0.9rem;
      margin-bottom: var(--spacing-md);
    }

    .estimate-header svg {
      color: var(--color-secondary);
    }

    .estimate-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
    }

    .total-value {
      font-family: var(--font-heading);
      font-size: 1.5rem;
      color: var(--color-primary);
    }

    .alert {
      padding: var(--spacing-md);
      border-radius: var(--radius-md);
      margin-bottom: var(--spacing-lg);
    }

    .alert-success {
      background: rgba(74, 155, 109, 0.15);
      color: var(--color-success);
      border: 1px solid var(--color-success);
    }

    .alert-error {
      background: rgba(196, 91, 74, 0.15);
      color: var(--color-error);
      border: 1px solid var(--color-error);
    }

    .btn-large {
      width: 100%;
      padding: var(--spacing-lg) var(--spacing-xl);
      font-size: 1.1rem;
    }

    .spinner {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .form-note {
      text-align: center;
      font-size: 0.85rem;
      color: var(--color-text-light);
      margin-top: var(--spacing-md);
    }

    .booking-sidebar {
      position: sticky;
      top: calc(var(--header-height) + var(--spacing-lg));
    }

    .help-card,
    .info-card {
      background: var(--color-white);
      border-radius: var(--radius-xl);
      padding: var(--spacing-xl);
      box-shadow: var(--shadow-md);
      margin-bottom: var(--spacing-lg);
    }

    .help-card h4,
    .info-card h4 {
      margin-bottom: var(--spacing-md);
      color: var(--color-text);
    }

    .help-card p {
      color: var(--color-text-light);
      font-size: 0.95rem;
      margin-bottom: var(--spacing-lg);
    }

    .contact-options {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .contact-option {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      color: var(--color-text);
      font-size: 0.9rem;
      padding: var(--spacing-sm);
      border-radius: var(--radius-md);
      transition: background var(--transition-fast);
    }

    .contact-option:hover {
      background: var(--color-background);
    }

    .contact-option svg {
      color: var(--color-primary);
    }

    .info-card ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .info-card li {
      position: relative;
      padding-left: var(--spacing-lg);
      margin-bottom: var(--spacing-sm);
      color: var(--color-text);
      font-size: 0.95rem;
    }

    .info-card li::before {
      content: '';
      position: absolute;
      left: 0;
      top: 8px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--color-success);
    }

    .back-link {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      color: var(--color-text-light);
      font-size: 0.95rem;
      transition: color var(--transition-fast);
    }

    .back-link:hover {
      color: var(--color-primary);
    }

    .not-found {
      text-align: center;
      padding: var(--spacing-4xl);
    }

    .not-found h2 {
      margin-bottom: var(--spacing-xl);
      color: var(--color-text-light);
    }

    .loading {
      display: flex;
      justify-content: center;
      padding: var(--spacing-4xl);
    }

    .spinner-large {
      width: 50px;
      height: 50px;
      border: 3px solid rgba(61, 43, 31, 0.1);
      border-top-color: var(--color-primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @media (max-width: 992px) {
      .booking-grid {
        grid-template-columns: 1fr;
      }

      .booking-sidebar {
        position: static;
        order: -1;
      }
    }

    @media (max-width: 600px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .selected-circuit {
        flex-direction: column;
      }

      .selected-circuit img {
        width: 100%;
        height: 150px;
      }
    }
  `]
})
export class BookingComponent implements OnInit {
  lang = inject(LanguageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookingService = inject(BookingService);
  private circuitService = inject(CircuitService);

  circuit = signal<Circuit | null>(null);
  isLoadingCircuit = signal(true);
  isSubmitting = signal(false);
  successMessage = signal(false);
  errorMessage = signal(false);
  dateError = signal(false);

  minDate = new Date().toISOString().split('T')[0];

  formData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    startDate: '',
    endDate: '',
    adults: 1,
    children: 0,
    specialRequests: ''
  };

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const circuitSlug = params.get('circuitId');
      if (circuitSlug) {
        this.loadCircuit(circuitSlug);
      } else {
        this.isLoadingCircuit.set(false);
      }
    });
  }

  async loadCircuit(slug: string): Promise<void> {
    this.isLoadingCircuit.set(true);
    const found = await this.circuitService.getCircuitBySlug(slug);
    this.circuit.set(found);
    this.isLoadingCircuit.set(false);
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

  getPriceNote(): string {
    const c = this.circuit();
    if (!c) return '';
    return this.lang.language() === 'fr' ? c.price_note_fr : c.price_note_en;
  }

  estimatedTotal(): number {
    const c = this.circuit();
    if (!c) return 0;
    const totalPersons = this.formData.adults + Math.ceil(this.formData.children * 0.5);
    return c.price * totalPersons;
  }

  validateDates(): boolean {
    if (this.formData.endDate && this.formData.startDate) {
      return new Date(this.formData.endDate) >= new Date(this.formData.startDate);
    }
    return true;
  }

  async onSubmit(): Promise<void> {
    const c = this.circuit();
    if (!c) return;

    if (!this.validateDates()) {
      this.dateError.set(true);
      return;
    }

    this.isSubmitting.set(true);
    this.successMessage.set(false);
    this.errorMessage.set(false);
    this.dateError.set(false);

    const result = await this.bookingService.createBooking({
      circuit_id: c.slug,
      circuit_title: this.getTitle(),
      first_name: this.formData.firstName,
      last_name: this.formData.lastName,
      email: this.formData.email,
      phone: this.formData.phone || null,
      country: this.formData.country,
      start_date: this.formData.startDate,
      end_date: this.formData.endDate || null,
      adults: this.formData.adults,
      children: this.formData.children,
      special_requests: this.formData.specialRequests || null,
      estimated_total: this.estimatedTotal()
    });

    this.isSubmitting.set(false);

    if (result.success && result.data) {
      this.router.navigate(['/confirmation', result.data.reference_number]);
    } else {
      this.errorMessage.set(true);
    }
  }
}
