import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { BookingService, TransferBookingRequest } from '../../core/services/booking.service';

@Component({
  selector: 'app-transfer-booking',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <section class="page-hero">
      <div class="hero-overlay"></div>
      <div class="hero-content container">
        <div class="hero-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/>
            <circle cx="6.5" cy="16.5" r="2.5"/>
            <circle cx="16.5" cy="16.5" r="2.5"/>
          </svg>
        </div>
        <h1>{{ lang.t('transferBooking.title') }}</h1>
        <p>{{ lang.t('transferBooking.subtitle') }}</p>
      </div>
    </section>

    <section class="transfer-booking-section section">
      <div class="container">
        <div class="booking-layout">
          <div class="booking-form-col">
            <a routerLink="/services" class="back-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              {{ lang.t('nav.services') }}
            </a>

            @if (errorMessage()) {
              <div class="alert alert-error">{{ lang.t('transferBooking.error') }}</div>
            }

            <form (ngSubmit)="onSubmit()" #transferForm="ngForm">
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
                    <label>{{ lang.t('booking.phone') }}</label>
                    <input type="tel" name="phone" [(ngModel)]="formData.phone" placeholder="+221 XX XXX XX XX" />
                  </div>
                  <div class="form-group country-group">
                    <label>{{ lang.t('booking.selectCountry') }} *</label>
                    <div class="country-input-wrapper">
                      <input
                        type="text"
                        name="country"
                        [(ngModel)]="formData.country"
                        [placeholder]="lang.t('booking.selectCountry')"
                        (focus)="showCountryDropdown.set(true)"
                        (blur)="onCountryBlur()"
                        autocomplete="off"
                        required
                      />
                      @if (showCountryDropdown() && filteredCountryGroups().length > 0) {
                        <div class="country-dropdown">
                          @for (group of filteredCountryGroups(); track group.name) {
                            <div class="country-group-block">
                              <div class="country-group-label">{{ group.name }}</div>
                              @for (country of group.countries; track country.name) {
                                <div class="country-option" (mousedown)="selectCountry(country.name)">
                                  <span>{{ country.flag }}</span>
                                  <span>{{ country.name }}</span>
                                </div>
                              }
                            </div>
                          }
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>

              <div class="form-card">
                <h3>{{ lang.t('transferBooking.title') }}</h3>
                <div class="form-grid">
                  <div class="form-group full-width">
                    <label>{{ lang.t('transferBooking.direction') }} *</label>
                    <div class="direction-toggle">
                      <label class="direction-option" [class.active]="formData.direction === 'airport_to_hotel'">
                        <input type="radio" name="direction" value="airport_to_hotel" [(ngModel)]="formData.direction" required />
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 21 4s-2 0-3.5 1.5L14 9 5.8 7.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 3.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
                        </svg>
                        {{ lang.t('transferBooking.airportToHotel') }}
                      </label>
                      <label class="direction-option" [class.active]="formData.direction === 'hotel_to_airport'">
                        <input type="radio" name="direction" value="hotel_to_airport" [(ngModel)]="formData.direction" required />
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                          <polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                        {{ lang.t('transferBooking.hotelToAirport') }}
                      </label>
                    </div>
                  </div>

                  <div class="form-group">
                    <label>{{ lang.t('transferBooking.flightDate') }} *</label>
                    <input type="date" name="flightDate" [(ngModel)]="formData.flightDate" [min]="minDate" required />
                  </div>
                  <div class="form-group">
                    <label>{{ lang.t('transferBooking.flightTime') }} *</label>
                    <input type="time" name="flightTime" [(ngModel)]="formData.flightTime" required />
                  </div>
                  <div class="form-group">
                    <label>{{ lang.t('transferBooking.flightNumber') }}</label>
                    <input type="text" name="flightNumber" [(ngModel)]="formData.flightNumber" [placeholder]="lang.t('transferBooking.flightNumberPlaceholder')" />
                  </div>
                  <div class="form-group">
                    <label>{{ lang.t('transferBooking.hotelName') }} *</label>
                    <input type="text" name="hotelName" [(ngModel)]="formData.hotelName" [placeholder]="lang.t('transferBooking.hotelNamePlaceholder')" required />
                  </div>

                  <div class="form-group">
                    <label>{{ lang.t('transferBooking.passengers') }} *</label>
                    <input type="number" name="passengers" [(ngModel)]="formData.passengers" min="1" max="50" required />
                  </div>
                  <div class="form-group">
                    <label>{{ lang.t('transferBooking.luggage') }}</label>
                    <input type="number" name="luggage" [(ngModel)]="formData.luggage" min="0" max="99" />
                  </div>

                  <div class="form-group full-width">
                    <label>{{ lang.t('transferBooking.vehicleType') }}</label>
                    <select name="vehicleType" [(ngModel)]="formData.vehicleType">
                      <option value="">{{ lang.t('transferBooking.vehicleAny') }}</option>
                      <option value="sedan">{{ lang.t('transferBooking.vehicleSedan') }}</option>
                      <option value="4x4">{{ lang.t('transferBooking.vehicle4x4') }}</option>
                      <option value="minibus">{{ lang.t('transferBooking.vehicleMinibus') }}</option>
                      <option value="bus">{{ lang.t('transferBooking.vehicleBus') }}</option>
                    </select>
                  </div>

                  <div class="form-group full-width">
                    <label>{{ lang.t('transferBooking.specialRequests') }}</label>
                    <textarea name="specialRequests" [(ngModel)]="formData.specialRequests" rows="3" [placeholder]="lang.t('transferBooking.specialRequestsPlaceholder')"></textarea>
                  </div>
                </div>
              </div>

              <button type="submit" class="btn btn-primary btn-submit" [disabled]="isSubmitting() || !transferForm.valid">
                @if (isSubmitting()) {
                  <span class="spinner-small"></span>
                }
                {{ lang.t('transferBooking.submit') }}
              </button>
            </form>
          </div>

          <div class="booking-sidebar">
            <div class="info-card">
              <div class="info-card-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <h4>{{ lang.t('services.transfers.feature4') }}</h4>
              </div>
              <ul class="info-list">
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  {{ lang.t('services.transfers.feature1') }}
                </li>
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  {{ lang.t('services.transfers.feature2') }}
                </li>
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  {{ lang.t('services.transfers.feature3') }}
                </li>
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  {{ lang.t('services.transfers.feature4') }}
                </li>
              </ul>
            </div>

            <div class="summary-card">
              <h4>{{ lang.t('transferBooking.summary') }}</h4>
              <div class="summary-row">
                <span>{{ lang.t('transferBooking.from') }}</span>
                <span>{{ formData.direction === 'airport_to_hotel' ? lang.t('transferBooking.aibd') : formData.hotelName || '—' }}</span>
              </div>
              <div class="summary-row">
                <span>{{ lang.t('transferBooking.to') }}</span>
                <span>{{ formData.direction === 'hotel_to_airport' ? lang.t('transferBooking.aibd') : formData.hotelName || '—' }}</span>
              </div>
              <div class="summary-row">
                <span>{{ lang.t('transferBooking.passengers') }}</span>
                <span>{{ formData.passengers }}</span>
              </div>
              @if (formData.flightDate) {
                <div class="summary-row">
                  <span>{{ lang.t('transferBooking.flightDate') }}</span>
                  <span>{{ formData.flightDate }}</span>
                </div>
              }
              @if (formData.flightTime) {
                <div class="summary-row">
                  <span>{{ lang.t('transferBooking.flightTime') }}</span>
                  <span>{{ formData.flightTime }}</span>
                </div>
              }
              <p class="quote-note">{{ lang.t('booking.estimateNote') }}</p>
            </div>

            <div class="contact-card">
              <h4>{{ lang.t('booking.needHelp') }}</h4>
              <p>{{ lang.t('booking.helpText') }}</p>
              <a href="https://wa.me/221711525436" target="_blank" class="whatsapp-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.528 5.845L0 24l6.335-1.502A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.787 9.787 0 0 1-5.032-1.388l-.361-.214-3.741.887.938-3.64-.235-.374A9.778 9.778 0 0 1 2.182 12C2.182 6.566 6.566 2.182 12 2.182S21.818 6.566 21.818 12 17.434 21.818 12 21.818z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .page-hero {
      position: relative;
      height: 35vh;
      min-height: 280px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%);
    }
    .hero-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.2); }
    .hero-content {
      position: relative;
      text-align: center;
      color: var(--color-white);
      padding-top: var(--header-height);
    }
    .hero-icon { margin-bottom: var(--spacing-md); }
    .hero-icon svg { color: rgba(255,255,255,0.9); }
    .hero-content h1 { color: var(--color-white); text-shadow: 0 2px 4px rgba(0,0,0,0.3); margin-bottom: var(--spacing-sm); }
    .hero-content p { opacity: 0.9; font-size: 1.05rem; }

    .booking-layout {
      display: grid;
      grid-template-columns: 1fr 340px;
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
      align-items: flex-start;
      gap: var(--spacing-sm);
      padding: var(--spacing-md) var(--spacing-lg);
      border-radius: var(--radius-md);
      margin-bottom: var(--spacing-xl);
      font-weight: 500;
    }
    .alert svg { flex-shrink: 0; margin-top: 2px; }
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
      border-bottom: 2px solid var(--color-secondary);
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
    .form-group select,
    .form-group textarea {
      padding: var(--spacing-sm) var(--spacing-md);
      border: 1px solid rgba(61,43,31,0.2);
      border-radius: var(--radius-md);
      font-size: 0.95rem;
      transition: border-color 0.2s;
      background: var(--color-white);
    }
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: var(--color-secondary);
      box-shadow: 0 0 0 3px rgba(43,138,138,0.1);
    }

    .direction-toggle {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-md);
    }
    .direction-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-lg);
      border: 2px solid rgba(61,43,31,0.15);
      border-radius: var(--radius-lg);
      cursor: pointer;
      text-align: center;
      font-size: 0.85rem;
      transition: all 0.2s;
    }
    .direction-option input { display: none; }
    .direction-option.active {
      border-color: var(--color-secondary);
      background: rgba(43,138,138,0.06);
      color: var(--color-secondary);
      font-weight: 600;
    }

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
    .country-option:hover { background: rgba(43,138,138,0.07); }

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
    @keyframes spin { to { transform: rotate(360deg); } }

    .info-card {
      background: var(--color-white);
      border-radius: var(--radius-xl);
      padding: var(--spacing-xl);
      box-shadow: var(--shadow-md);
      margin-bottom: var(--spacing-lg);
    }
    .info-card-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-lg);
      color: var(--color-secondary);
    }
    .info-card-header svg { color: var(--color-secondary); }
    .info-card-header h4 { margin: 0; color: var(--color-text); }
    .info-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: var(--spacing-sm); }
    .info-list li { display: flex; align-items: center; gap: var(--spacing-sm); font-size: 0.9rem; }
    .info-list li svg { color: var(--color-secondary); flex-shrink: 0; }

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
      border-bottom: 2px solid var(--color-secondary);
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
    .summary-row span:last-child { font-weight: 600; max-width: 60%; text-align: right; word-break: break-word; }
    .quote-note { font-size: 0.8rem; color: var(--color-text-light); margin-top: var(--spacing-md); line-height: 1.4; }

    .contact-card {
      background: var(--color-secondary);
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
      .direction-toggle { grid-template-columns: 1fr; }
    }
  `]
})
export class TransferBookingComponent {
  lang = inject(LanguageService);
  private bookingService = inject(BookingService);

  isSubmitting = signal(false);
  errorMessage = signal(false);

  minDate = new Date().toISOString().split('T')[0];

  formData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    direction: 'airport_to_hotel' as 'airport_to_hotel' | 'hotel_to_airport',
    flightDate: '',
    flightTime: '',
    flightNumber: '',
    hotelName: '',
    passengers: 1,
    luggage: 1,
    vehicleType: '',
    specialRequests: ''
  };

  countryGroups = [
    { name: 'Afrique / Africa', countries: [
      { name: 'Senegal', flag: '🇸🇳' }, { name: 'Algeria', flag: '🇩🇿' }, { name: 'Benin', flag: '🇧🇯' },
      { name: 'Burkina Faso', flag: '🇧🇫' }, { name: 'Cameroon', flag: '🇨🇲' }, { name: 'Cape Verde', flag: '🇨🇻' },
      { name: 'Ivory Coast', flag: '🇨🇮' }, { name: 'Gabon', flag: '🇬🇦' }, { name: 'Gambia', flag: '🇬🇲' },
      { name: 'Ghana', flag: '🇬🇭' }, { name: 'Guinea', flag: '🇬🇳' }, { name: 'Mali', flag: '🇲🇱' },
      { name: 'Mauritania', flag: '🇲🇷' }, { name: 'Morocco', flag: '🇲🇦' }, { name: 'Niger', flag: '🇳🇪' },
      { name: 'Nigeria', flag: '🇳🇬' }, { name: 'South Africa', flag: '🇿🇦' }, { name: 'Togo', flag: '🇹🇬' },
      { name: 'Tunisia', flag: '🇹🇳' }
    ]},
    { name: 'Europe', countries: [
      { name: 'Belgium', flag: '🇧🇪' }, { name: 'France', flag: '🇫🇷' }, { name: 'Germany', flag: '🇩🇪' },
      { name: 'Italy', flag: '🇮🇹' }, { name: 'Netherlands', flag: '🇳🇱' }, { name: 'Portugal', flag: '🇵🇹' },
      { name: 'Spain', flag: '🇪🇸' }, { name: 'Switzerland', flag: '🇨🇭' }, { name: 'United Kingdom', flag: '🇬🇧' }
    ]},
    { name: 'Amerique / Americas', countries: [
      { name: 'Brazil', flag: '🇧🇷' }, { name: 'Canada', flag: '🇨🇦' }, { name: 'United States', flag: '🇺🇸' }
    ]},
    { name: 'Asie / Asia', countries: [
      { name: 'China', flag: '🇨🇳' }, { name: 'India', flag: '🇮🇳' }, { name: 'Japan', flag: '🇯🇵' }
    ]},
    { name: 'Moyen-Orient / Middle East', countries: [
      { name: 'Saudi Arabia', flag: '🇸🇦' }, { name: 'United Arab Emirates', flag: '🇦🇪' },
      { name: 'Qatar', flag: '🇶🇦' }
    ]},
    { name: 'Autre / Other', countries: [{ name: 'Other', flag: '🌍' }] }
  ];

  showCountryDropdown = signal(false);

  filteredCountryGroups = computed(() => {
    const term = this.formData.country.toLowerCase().trim();
    if (!term) return this.countryGroups;
    return this.countryGroups
      .map(g => ({ ...g, countries: g.countries.filter(c => c.name.toLowerCase().includes(term)) }))
      .filter(g => g.countries.length > 0);
  });

  selectCountry(name: string): void {
    this.formData.country = name;
    this.showCountryDropdown.set(false);
  }

  onCountryBlur(): void {
    setTimeout(() => this.showCountryDropdown.set(false), 200);
  }

  async onSubmit(): Promise<void> {
    if (this.isSubmitting()) return;
    this.isSubmitting.set(true);
    this.errorMessage.set(false);

    const request: TransferBookingRequest = {
      first_name: this.formData.firstName,
      last_name: this.formData.lastName,
      email: this.formData.email,
      phone: this.formData.phone || null,
      country: this.formData.country,
      direction: this.formData.direction,
      flight_date: this.formData.flightDate,
      flight_time: this.formData.flightTime,
      flight_number: this.formData.flightNumber || null,
      hotel_name: this.formData.hotelName,
      passengers: this.formData.passengers,
      luggage: this.formData.luggage,
      vehicle_type: this.formData.vehicleType || 'any',
      special_requests: this.formData.specialRequests || null
    };

    const result = await this.bookingService.createTransferBooking(request);
    this.isSubmitting.set(false);

    if (result.success && result.reference) {
      window.location.href = `/payment/${result.reference}`;
    } else {
      this.errorMessage.set(true);
    }
  }
}
