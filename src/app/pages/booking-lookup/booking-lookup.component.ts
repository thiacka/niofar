import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';
import { BookingService } from '../../core/services/booking.service';

@Component({
  selector: 'app-booking-lookup',
  standalone: true,
  imports: [FormsModule, DatePipe, DecimalPipe],
  template: `
    <section class="page-hero">
      <div class="hero-overlay"></div>
      <div class="hero-content container">
        <h1>{{ lang.t('bookingLookup.title') }}</h1>
        <p>{{ lang.t('bookingLookup.subtitle') }}</p>
      </div>
    </section>

    <section class="booking-lookup section">
      <div class="container">
        @if (!booking()) {
          <div class="lookup-form-wrapper">
            <form (ngSubmit)="searchBooking()" #lookupForm="ngForm" class="lookup-form">
              <div class="form-group">
                <label for="referenceNumber">{{ lang.t('bookingLookup.referenceNumber') }}</label>
                <input
                  type="text"
                  id="referenceNumber"
                  name="referenceNumber"
                  [(ngModel)]="referenceNumber"
                  [placeholder]="lang.t('bookingLookup.referencePlaceholder')"
                  required
                  [disabled]="isSearching()"
                />
                <p class="help-text">{{ lang.t('bookingLookup.referenceHelp') }}</p>
              </div>

              @if (notFound()) {
                <div class="alert alert-error">
                  {{ lang.t('bookingLookup.notFound') }}
                </div>
              }

              @if (searchError()) {
                <div class="alert alert-error">
                  {{ lang.t('bookingLookup.error') }}
                </div>
              }

              <button
                type="submit"
                class="btn btn-primary btn-large"
                [disabled]="!lookupForm.valid || isSearching()"
              >
                @if (isSearching()) {
                  <span class="spinner"></span>
                } @else {
                  {{ lang.t('bookingLookup.search') }}
                }
              </button>
            </form>
          </div>
        } @else {
          <div class="booking-details">
            <div class="booking-header">
              <div>
                <h2>{{ lang.t('bookingLookup.bookingDetails') }}</h2>
                <span class="reference">{{ booking()!.reference_number }}</span>
              </div>
              <span class="status-badge" [class]="'status-' + booking()!.status">
                {{ lang.t('admin.status.' + booking()!.status) }}
              </span>
            </div>

            <div class="booking-grid">
              <div class="booking-card">
                <h3>{{ lang.t('bookingLookup.circuitInfo') }}</h3>
                <div class="info-item">
                  <span class="label">{{ lang.t('bookingLookup.circuit') }}</span>
                  <span class="value">{{ booking()!.excursion_title }}</span>
                </div>
                <div class="info-item">
                  <span class="label">{{ lang.t('bookingLookup.startDate') }}</span>
                  <span class="value">{{ booking()!.start_date | date:'dd/MM/yyyy' }}</span>
                </div>
                @if (booking()!.end_date) {
                  <div class="info-item">
                    <span class="label">{{ lang.t('bookingLookup.endDate') }}</span>
                    <span class="value">{{ booking()!.end_date | date:'dd/MM/yyyy' }}</span>
                  </div>
                }
                <div class="info-item">
                  <span class="label">{{ lang.t('bookingLookup.travelers') }}</span>
                  <span class="value">
                    {{ booking()!.adults }} {{ lang.t('admin.adults') }}
                    @if (booking()!.children > 0) {
                      + {{ booking()!.children }} {{ lang.t('admin.children') }}
                    }
                  </span>
                </div>
              </div>

              <div class="booking-card">
                <h3>{{ lang.t('bookingLookup.personalInfo') }}</h3>
                <div class="info-item">
                  <span class="label">{{ lang.t('bookingLookup.name') }}</span>
                  <span class="value">{{ booking()!.first_name }} {{ booking()!.last_name }}</span>
                </div>
                <div class="info-item">
                  <span class="label">{{ lang.t('contact.email') }}</span>
                  <span class="value">{{ booking()!.email }}</span>
                </div>
                @if (booking()!.phone) {
                  <div class="info-item">
                    <span class="label">{{ lang.t('booking.phone') }}</span>
                    <span class="value">{{ booking()!.phone }}</span>
                  </div>
                }
                <div class="info-item">
                  <span class="label">{{ lang.t('contact.country') }}</span>
                  <span class="value">{{ booking()!.country }}</span>
                </div>
              </div>

              <div class="booking-card">
                <h3>{{ lang.t('bookingLookup.bookingInfo') }}</h3>
                <div class="info-item">
                  <span class="label">{{ lang.t('bookingLookup.bookingDate') }}</span>
                  <span class="value">{{ booking()!.created_at | date:'dd/MM/yyyy HH:mm' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">{{ lang.t('booking.estimatedTotal') }}</span>
                  <span class="value total">{{ booking()!.estimated_total | number }} FCFA</span>
                </div>
                <div class="info-item">
                  <span class="label">{{ lang.t('bookingLookup.status') }}</span>
                  <span class="status-badge" [class]="'status-' + booking()!.status">
                    {{ lang.t('admin.status.' + booking()!.status) }}
                  </span>
                </div>
              </div>

              @if (booking()!.special_requests) {
                <div class="booking-card full-width">
                  <h3>{{ lang.t('admin.specialRequests') }}</h3>
                  <p class="special-requests">{{ booking()!.special_requests }}</p>
                </div>
              }
            </div>

            <div class="actions">
              <button class="btn btn-outline" (click)="reset()">
                {{ lang.t('bookingLookup.searchAnother') }}
              </button>
              <a href="mailto:contact@niofar.com" class="btn btn-primary">
                {{ lang.t('bookingLookup.contactUs') }}
              </a>
            </div>
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
      background: url('https://images.pexels.com/photos/6271172/pexels-photo-6271172.jpeg?auto=compress&cs=tinysrgb&w=1920') center/cover no-repeat;
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
      font-size: 3rem;
      margin-bottom: var(--spacing-md);
    }

    .hero-content p {
      font-size: 1.25rem;
      opacity: 0.95;
    }

    .booking-lookup {
      padding: var(--spacing-4xl) 0;
    }

    .lookup-form-wrapper {
      max-width: 600px;
      margin: 0 auto;
      background: var(--color-white);
      border-radius: var(--radius-xl);
      padding: var(--spacing-2xl);
      box-shadow: var(--shadow-lg);
    }

    .lookup-form .form-group {
      margin-bottom: var(--spacing-lg);
    }

    .lookup-form label {
      display: block;
      margin-bottom: var(--spacing-sm);
      font-weight: 600;
      color: var(--color-text);
    }

    .lookup-form input {
      width: 100%;
      padding: var(--spacing-md);
      border: 2px solid rgba(61, 43, 31, 0.15);
      border-radius: var(--radius-md);
      font-size: 1rem;
      text-transform: uppercase;
      font-family: monospace;
      letter-spacing: 1px;
    }

    .lookup-form input:focus {
      outline: none;
      border-color: var(--color-primary);
    }

    .help-text {
      margin-top: var(--spacing-sm);
      font-size: 0.85rem;
      color: var(--color-text-light);
    }

    .booking-details {
      max-width: 1200px;
      margin: 0 auto;
    }

    .booking-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-2xl);
      padding-bottom: var(--spacing-lg);
      border-bottom: 2px solid rgba(61, 43, 31, 0.1);
    }

    .booking-header h2 {
      color: var(--color-text);
      margin-bottom: var(--spacing-sm);
    }

    .reference {
      display: inline-block;
      font-family: monospace;
      font-weight: 600;
      color: var(--color-primary);
      background: var(--color-background);
      padding: 6px 12px;
      border-radius: var(--radius-md);
      font-size: 1rem;
      letter-spacing: 1px;
    }

    .status-badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: var(--radius-full);
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-pending {
      background: rgba(196, 159, 74, 0.15);
      color: #b8860b;
    }

    .status-confirmed {
      background: rgba(74, 155, 109, 0.15);
      color: var(--color-success);
    }

    .status-cancelled {
      background: rgba(196, 91, 74, 0.15);
      color: var(--color-error);
    }

    .booking-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-2xl);
    }

    .booking-card {
      background: var(--color-white);
      border-radius: var(--radius-xl);
      padding: var(--spacing-xl);
      box-shadow: var(--shadow-md);
    }

    .booking-card.full-width {
      grid-column: 1 / -1;
    }

    .booking-card h3 {
      color: var(--color-primary);
      margin-bottom: var(--spacing-lg);
      font-size: 1.25rem;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: var(--spacing-md) 0;
      border-bottom: 1px solid rgba(61, 43, 31, 0.08);
    }

    .info-item:last-child {
      border-bottom: none;
    }

    .info-item .label {
      color: var(--color-text-light);
      font-size: 0.9rem;
      flex-shrink: 0;
      margin-right: var(--spacing-md);
    }

    .info-item .value {
      color: var(--color-text);
      font-weight: 500;
      text-align: right;
    }

    .info-item .total {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--color-primary);
    }

    .special-requests {
      color: var(--color-text);
      line-height: 1.6;
      white-space: pre-wrap;
    }

    .actions {
      display: flex;
      gap: var(--spacing-md);
      justify-content: center;
      flex-wrap: wrap;
    }

    .alert {
      padding: var(--spacing-md);
      border-radius: var(--radius-md);
      margin-bottom: var(--spacing-lg);
    }

    .alert-error {
      background: rgba(196, 91, 74, 0.15);
      color: var(--color-error);
      border: 1px solid var(--color-error);
    }

    .spinner {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .hero-content h1 {
        font-size: 2rem;
      }

      .booking-header {
        flex-direction: column;
        gap: var(--spacing-md);
      }

      .booking-grid {
        grid-template-columns: 1fr;
      }

      .actions {
        flex-direction: column;
      }

      .actions .btn {
        width: 100%;
      }
    }
  `]
})
export class BookingLookupComponent {
  lang = inject(LanguageService);
  private bookingService = inject(BookingService);

  referenceNumber = '';
  booking = signal<any | null>(null);
  isSearching = signal(false);
  notFound = signal(false);
  searchError = signal(false);

  async searchBooking(): Promise<void> {
    const ref = this.referenceNumber.trim().toUpperCase();
    if (!ref) return;

    this.isSearching.set(true);
    this.notFound.set(false);
    this.searchError.set(false);

    const result = await this.bookingService.getBookingByReference(ref);

    this.isSearching.set(false);

    if (result) {
      this.booking.set(result);
    } else {
      this.notFound.set(true);
    }
  }

  reset(): void {
    this.booking.set(null);
    this.referenceNumber = '';
    this.notFound.set(false);
    this.searchError.set(false);
  }
}
