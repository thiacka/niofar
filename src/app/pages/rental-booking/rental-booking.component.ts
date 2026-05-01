import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';
import { BookingService, RentalBookingRequest } from '../../core/services/booking.service';
import { PhoneInputComponent } from '../../shared/components/phone-input/phone-input.component';
import { CountrySelectComponent } from '../../shared/components/phone-input/country-select.component';
import { RentalService, Rental } from '../../core/services/rental.service';

const DRIVER_FEE_PER_DAY = 15000;

@Component({
  selector: 'app-rental-booking',
  standalone: true,
  imports: [FormsModule, RouterLink, DecimalPipe, PhoneInputComponent, CountrySelectComponent],
  template: `
    <section class="page-hero">
      <div class="hero-overlay"></div>
      <div class="hero-content container">
        <h1>{{ lang.t('rentalBooking.title') }}</h1>
        <p>{{ lang.t('rentalBooking.subtitle') }}</p>
      </div>
    </section>

    <section class="rental-booking-section section">
      <div class="container">
        @if (isLoading()) {
          <div class="loading"><div class="spinner"></div></div>
        } @else if (!rental()) {
          <div class="not-found">
            <h2>{{ lang.t('rentalBooking.rentalNotFound') }}</h2>
            <a routerLink="/rentals" class="btn btn-primary">{{ lang.t('rentalBooking.browseRentals') }}</a>
          </div>
        } @else {
          <div class="booking-layout">
            <div class="booking-form-col">
              <a routerLink="/rentals" class="back-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                {{ lang.t('rentalBooking.backToRentals') }}
              </a>

              @if (successMessage()) {
                <div class="alert alert-success">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  {{ lang.t('rentalBooking.success') }}
                </div>
              }

              @if (errorMessage()) {
                <div class="alert alert-error">{{ lang.t('rentalBooking.error') }}</div>
              }

              <form (ngSubmit)="onSubmit()" #bookingForm="ngForm">
                <div class="form-card">
                  <h3>{{ lang.t('booking.details') }}</h3>
                  <div class="form-grid">
                    <div class="form-group">
                      <label>{{ lang.t('booking.firstName') }} *</label>
                      <input type="text" name="firstName" [(ngModel)]="formData.firstName" required />
                    </div>
                    <div class="form-group">
                      <label>{{ lang.t('booking.lastName') }} *</label>
                      <input type="text" name="lastName" [(ngModel)]="formData.lastName" required />
                    </div>
                    <div class="form-group">
                      <label>{{ lang.t('contact.email') }} *</label>
                      <input type="email" name="email" [(ngModel)]="formData.email" required />
                    </div>
                    <div class="form-group">
                      <app-phone-input
                        [country]="formData.country"
                        [(phone)]="formData.phone"
                        [required]="true"
                        label="{{ lang.t('booking.phone') }}"
                      />
                    </div>
                    <div class="form-group">
                      <app-country-select
                        [(value)]="formData.country"
                        [required]="true"
                        label="{{ lang.t('contact.country') }}"
                        placeholder="{{ lang.t('booking.selectCountry') }}"
                      />
                    </div>
                  </div>
                </div>

                <div class="form-card">
                  <h3>{{ lang.t('booking.tripDetails') }}</h3>
                  <div class="form-grid">
                    <div class="form-group">
                      <label>{{ lang.t('rentalBooking.startDate') }} *</label>
                      <input type="date" name="startDate" [(ngModel)]="formData.startDate" [min]="minDate" required />
                    </div>
                    <div class="form-group">
                      <label>{{ lang.t('rentalBooking.days') }} *</label>
                      <input type="number" name="days" [(ngModel)]="formData.days" min="1" max="90" required />
                    </div>
                    <div class="form-group full-width">
                      <label>{{ lang.t('rentalBooking.withDriver') }}</label>
                      <div class="radio-group">
                        <label class="radio-label">
                          <input type="radio" name="withDriver" [value]="true" [(ngModel)]="formData.withDriver" />
                          {{ lang.t('rentalBooking.withDriverYes') }}
                        </label>
                        <label class="radio-label">
                          <input type="radio" name="withDriver" [value]="false" [(ngModel)]="formData.withDriver" />
                          {{ lang.t('rentalBooking.withDriverNo') }}
                        </label>
                      </div>
                    </div>
                    <div class="form-group full-width">
                      <label>{{ lang.t('rentalBooking.pickupLocation') }}</label>
                      <input type="text" name="pickupLocation" [(ngModel)]="formData.pickupLocation" [placeholder]="lang.t('rentalBooking.pickupLocationPlaceholder')" />
                    </div>
                    <div class="form-group full-width">
                      <label>{{ lang.t('rentalBooking.specialRequests') }}</label>
                      <textarea name="specialRequests" [(ngModel)]="formData.specialRequests" rows="3" [placeholder]="lang.t('rentalBooking.specialRequestsPlaceholder')"></textarea>
                    </div>
                  </div>
                </div>

                <button type="submit" class="btn btn-primary btn-submit" [disabled]="isSubmitting() || !bookingForm.valid">
                  @if (isSubmitting()) {
                    <span class="spinner-small"></span>
                  }
                  {{ lang.t('rentalBooking.submit') }}
                </button>
              </form>
            </div>

            <div class="booking-sidebar">
              <div class="rental-preview-card">
                @if (rental()!.image_url) {
                  <img [src]="rental()!.image_url" [alt]="getRentalName()" class="rental-preview-img" />
                }
                <div class="rental-preview-body">
                  <div class="rental-category-badge">{{ rental()!.category }}</div>
                  <h3>{{ getRentalName() }}</h3>
                  <p>{{ getRentalDescription() }}</p>
                </div>
              </div>

              <div class="summary-card">
                <h4>{{ lang.t('rentalBooking.summary') }}</h4>
                <div class="summary-row">
                  <span>{{ lang.t('rentalBooking.pricePerDay') }}</span>
                  <span>{{ rental()!.price_per_day | number }} FCFA</span>
                </div>
                <div class="summary-row">
                  <span>{{ lang.t('rentalBooking.days') }}</span>
                  <span>× {{ formData.days }}</span>
                </div>
                @if (formData.withDriver) {
                  <div class="summary-row driver-row">
                    <span>{{ lang.t('rentalBooking.driverFee') }}</span>
                    <span>{{ driverFeePerDay | number }} FCFA × {{ formData.days }}</span>
                  </div>
                }
                <div class="summary-row total-row">
                  <span>{{ lang.t('rentalBooking.estimatedTotal') }}</span>
                  <span>{{ estimatedTotal() | number }} FCFA</span>
                </div>
                <p class="estimate-note">{{ lang.t('booking.estimateNote') }}</p>
              </div>

              <div class="contact-card">
                <h4>{{ lang.t('booking.needHelp') }}</h4>
                <p>{{ lang.t('booking.helpText') }}</p>
                <a href="https://wa.me/221756518350" target="_blank" class="whatsapp-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.528 5.845L0 24l6.335-1.502A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.787 9.787 0 0 1-5.032-1.388l-.361-.214-3.741.887.938-3.64-.235-.374A9.778 9.778 0 0 1 2.182 12C2.182 6.566 6.566 2.182 12 2.182S21.818 6.566 21.818 12 17.434 21.818 12 21.818z"/>
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        }
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
    .hero-content p { opacity: 0.9; }

    .loading { display: flex; justify-content: center; padding: var(--spacing-4xl); }
    .spinner { width: 40px; height: 40px; border: 3px solid rgba(61,43,31,0.1); border-top-color: var(--color-primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .not-found { text-align: center; padding: var(--spacing-4xl); }
    .not-found h2 { margin-bottom: var(--spacing-xl); color: var(--color-text-light); }

    .booking-layout {
      display: grid;
      grid-template-columns: 1fr 360px;
      gap: var(--spacing-2xl);
      align-items: start;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-xs);
      color: var(--color-text-light);
      text-decoration: none;
      font-size: 0.9rem;
      margin-bottom: var(--spacing-xl);
      transition: color 0.2s;
    }
    .back-link:hover { color: var(--color-primary); }

    .alert {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-md) var(--spacing-lg);
      border-radius: var(--radius-md);
      margin-bottom: var(--spacing-xl);
      font-weight: 500;
    }
    .alert-success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
    .alert-error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }

    .form-card {
      background: var(--color-white);
      border-radius: var(--radius-xl);
      padding: var(--spacing-2xl);
      box-shadow: var(--shadow-md);
      margin-bottom: var(--spacing-xl);
    }
    .form-card h3 {
      margin-bottom: var(--spacing-xl);
      padding-bottom: var(--spacing-md);
      border-bottom: 2px solid var(--color-primary);
      display: inline-block;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-lg);
    }
    .form-group { display: flex; flex-direction: column; gap: var(--spacing-xs); }
    .form-group.full-width { grid-column: 1 / -1; }
    .form-group label { font-weight: 500; font-size: 0.9rem; color: var(--color-text); }
    .form-group input,
    .form-group textarea {
      padding: var(--spacing-sm) var(--spacing-md);
      border: 1px solid rgba(61,43,31,0.2);
      border-radius: var(--radius-md);
      font-size: 0.95rem;
      transition: border-color 0.2s;
      background: var(--color-white);
    }
    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(196,104,43,0.1);
    }

    .radio-group { display: flex; flex-direction: column; gap: var(--spacing-sm); }
    .radio-label {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      cursor: pointer;
      padding: var(--spacing-sm) var(--spacing-md);
      border: 1px solid rgba(61,43,31,0.2);
      border-radius: var(--radius-md);
      font-size: 0.9rem;
      transition: all 0.2s;
    }
    .radio-label:has(input:checked) {
      border-color: var(--color-primary);
      background: rgba(196,104,43,0.05);
      color: var(--color-primary);
      font-weight: 500;
    }
    .radio-label input { accent-color: var(--color-primary); }

    .country-input-wrapper { position: relative; }
    .country-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--color-white);
      border: 1px solid rgba(61,43,31,0.2);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      max-height: 240px;
      overflow-y: auto;
      z-index: 100;
    }
    .country-group-label {
      padding: var(--spacing-xs) var(--spacing-md);
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--color-text-light);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      background: var(--color-background-alt);
      border-top: 1px solid rgba(61,43,31,0.1);
    }
    .country-option {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-md);
      cursor: pointer;
      font-size: 0.9rem;
      transition: background 0.15s;
    }
    .country-option:hover { background: rgba(196,104,43,0.07); }
    .country-flag { font-size: 1.1rem; }

    .btn-submit {
      width: 100%;
      padding: var(--spacing-md);
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
    }
    .btn-submit:disabled { opacity: 0.65; cursor: not-allowed; }
    .spinner-small {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255,255,255,0.4);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    .rental-preview-card {
      background: var(--color-white);
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-md);
      margin-bottom: var(--spacing-lg);
    }
    .rental-preview-img { width: 100%; height: 180px; object-fit: cover; }
    .rental-preview-body { padding: var(--spacing-lg); }
    .rental-category-badge {
      display: inline-block;
      background: var(--color-primary);
      color: var(--color-white);
      font-size: 0.75rem;
      font-weight: 700;
      padding: 2px 10px;
      border-radius: 20px;
      margin-bottom: var(--spacing-sm);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .rental-preview-body h3 { margin-bottom: var(--spacing-xs); font-size: 1.1rem; }
    .rental-preview-body p { font-size: 0.9rem; color: var(--color-text-light); line-height: 1.5; }

    .summary-card {
      background: var(--color-white);
      border-radius: var(--radius-xl);
      padding: var(--spacing-xl);
      box-shadow: var(--shadow-md);
      margin-bottom: var(--spacing-lg);
    }
    .summary-card h4 {
      margin-bottom: var(--spacing-lg);
      padding-bottom: var(--spacing-sm);
      border-bottom: 2px solid var(--color-primary);
      display: inline-block;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: var(--spacing-sm) 0;
      font-size: 0.9rem;
      border-bottom: 1px solid rgba(61,43,31,0.08);
    }
    .summary-row:last-of-type { border-bottom: none; }
    .driver-row { color: var(--color-secondary); }
    .total-row {
      font-weight: 700;
      font-size: 1.05rem;
      color: var(--color-primary);
      margin-top: var(--spacing-sm);
      padding-top: var(--spacing-sm);
      border-top: 2px solid var(--color-primary) !important;
      border-bottom: none !important;
    }
    .estimate-note {
      font-size: 0.8rem;
      color: var(--color-text-light);
      margin-top: var(--spacing-md);
      line-height: 1.4;
    }

    .contact-card {
      background: var(--color-primary);
      border-radius: var(--radius-xl);
      padding: var(--spacing-xl);
      color: var(--color-white);
    }
    .contact-card h4 { color: var(--color-white); margin-bottom: var(--spacing-sm); }
    .contact-card p { font-size: 0.9rem; opacity: 0.9; margin-bottom: var(--spacing-md); }
    .whatsapp-btn {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-sm);
      background: #25D366;
      color: white;
      padding: var(--spacing-sm) var(--spacing-lg);
      border-radius: var(--radius-md);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      transition: background 0.2s;
    }
    .whatsapp-btn:hover { background: #128C7E; }

    @media (max-width: 900px) {
      .booking-layout { grid-template-columns: 1fr; }
      .booking-sidebar { order: -1; }
    }
    @media (max-width: 600px) {
      .form-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class RentalBookingComponent implements OnInit {
  lang = inject(LanguageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookingService = inject(BookingService);
  private rentalService = inject(RentalService);

  rental = signal<Rental | null>(null);
  isLoading = signal(true);
  isSubmitting = signal(false);
  successMessage = signal(false);
  errorMessage = signal(false);

  readonly driverFeePerDay = DRIVER_FEE_PER_DAY;
  minDate = new Date().toISOString().split('T')[0];

  formData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    startDate: '',
    days: 1,
    withDriver: false,
    pickupLocation: '',
    specialRequests: ''
  };

  estimatedTotal = computed(() => {
    const r = this.rental();
    if (!r) return 0;
    const base = r.price_per_day * this.formData.days;
    const driver = this.formData.withDriver ? DRIVER_FEE_PER_DAY * this.formData.days : 0;
    return base + driver;
  });

  // Country and phone are handled by app-phone-input component

  getRentalName(): string {
    const r = this.rental();
    if (!r) return '';
    return this.lang.language() === 'fr' ? r.name_fr : r.name_en;
  }

  getRentalDescription(): string {
    const r = this.rental();
    if (!r) return '';
    return this.lang.language() === 'fr' ? r.description_fr : r.description_en;
  }

  async onSubmit(): Promise<void> {
    const r = this.rental();
    if (!r || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(false);

    const request: RentalBookingRequest = {
      rental_id: r.id,
      rental_title: this.getRentalName(),
      rental_type: r.type,
      first_name: this.formData.firstName,
      last_name: this.formData.lastName,
      email: this.formData.email,
      phone: this.formData.phone || null,
      country: this.formData.country,
      start_date: this.formData.startDate,
      days: this.formData.days,
      with_driver: this.formData.withDriver,
      pickup_location: this.formData.pickupLocation || null,
      special_requests: this.formData.specialRequests || null,
      estimated_total: this.estimatedTotal()
    };

    const result = await this.bookingService.createRentalBooking(request);
    this.isSubmitting.set(false);

    if (result.success && result.reference) {
      this.router.navigate(['/payment', result.reference]);
    } else {
      this.errorMessage.set(true);
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(async params => {
      const slug = params.get('rentalSlug');
      if (slug) {
        const data = await this.rentalService.getRentalBySlug(slug);
        this.rental.set(data);
      }
      this.isLoading.set(false);
    });
  }
}
