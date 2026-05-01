import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';
import { BookingService, BookingResponse } from '../../core/services/booking.service';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [RouterLink, DatePipe, DecimalPipe],
  template: `
    <section class="confirmation-hero">
      <div class="hero-overlay"></div>
      <div class="hero-content container">
        @if (booking()) {
          <div class="success-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h1>{{ lang.t('confirmation.title') }}</h1>
          <p>{{ lang.t('confirmation.subtitle') }}</p>
        }
      </div>
    </section>

    <section class="confirmation section">
      <div class="container">
        @if (isLoading()) {
          <div class="loading">
            <div class="spinner"></div>
          </div>
        } @else if (booking()) {
          <div class="confirmation-grid">
            <div class="reference-card">
              <span class="reference-label">{{ lang.t('confirmation.reference') }}</span>
              <span class="reference-number">{{ booking()!.reference_number }}</span>
              <p class="reference-note">{{ lang.t('booking.note') }}</p>
            </div>

            <div class="details-card">
              <h3>{{ lang.t('confirmation.details') }}</h3>
              <div class="details-grid">
                <div class="detail-item">
                  <span class="detail-label">Excursion</span>
                  <span class="detail-value">{{ booking()!.excursion_title }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">{{ lang.t('booking.firstName') }}</span>
                  <span class="detail-value">{{ booking()!.first_name }} {{ booking()!.last_name }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">{{ lang.t('contact.email') }}</span>
                  <span class="detail-value">{{ booking()!.email }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">{{ lang.t('booking.startDate') }}</span>
                  <span class="detail-value">{{ booking()!.start_date | date:'dd MMMM yyyy' }}</span>
                </div>
                @if (booking()!.end_date) {
                  <div class="detail-item">
                    <span class="detail-label">{{ lang.t('booking.endDate') }}</span>
                    <span class="detail-value">{{ booking()!.end_date | date:'dd MMMM yyyy' }}</span>
                  </div>
                }
                <div class="detail-item">
                  <span class="detail-label">{{ lang.t('admin.travelers') }}</span>
                  <span class="detail-value">
                    {{ booking()!.adults }} {{ lang.t('admin.adults') }}
                    @if (booking()!.children > 0) {
                      , {{ booking()!.children }} {{ lang.t('admin.children') }}
                    }
                  </span>
                </div>
                <div class="detail-item total">
                  <span class="detail-label">{{ lang.t('booking.estimatedTotal') }}</span>
                  <span class="detail-value">{{ booking()!.estimated_total | number }} FCFA</span>
                </div>
              </div>
            </div>

            <div class="next-steps-card">
              <h3>{{ lang.t('confirmation.next') }}</h3>
              <div class="steps">
                <div class="step">
                  <div class="step-number">1</div>
                  <p>{{ lang.t('confirmation.step1') }}</p>
                </div>
                <div class="step">
                  <div class="step-number">2</div>
                  <p>{{ lang.t('confirmation.step2') }}</p>
                </div>
                <div class="step">
                  <div class="step-number">3</div>
                  <p>{{ lang.t('confirmation.step3') }}</p>
                </div>
              </div>
            </div>

            <div class="actions">
              <a routerLink="/" class="btn btn-outline">{{ lang.t('confirmation.backHome') }}</a>
              <button class="btn btn-calendar" (click)="downloadIcs()">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                {{ lang.t('confirmation.addCalendar') }}
              </button>
              <a routerLink="/circuits" class="btn btn-primary">{{ lang.t('confirmation.viewCircuits') }}</a>
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
    .confirmation-hero {
      position: relative;
      height: 40vh;
      min-height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--color-success) 0%, var(--color-secondary) 100%);
    }

    .hero-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.1);
    }

    .hero-content {
      position: relative;
      text-align: center;
      color: var(--color-white);
      padding-top: var(--header-height);
    }

    .success-icon {
      margin-bottom: var(--spacing-lg);
      animation: scaleIn 0.5s ease-out;
    }

    .success-icon svg {
      color: var(--color-white);
    }

    @keyframes scaleIn {
      0% { transform: scale(0); opacity: 0; }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); opacity: 1; }
    }

    .hero-content h1 {
      color: var(--color-white);
      text-shadow: 0 2px 4px rgba(0,0,0,0.2);
      margin-bottom: var(--spacing-sm);
    }

    .hero-content p {
      font-size: 1.125rem;
      opacity: 0.95;
    }

    .confirmation-grid {
      max-width: 700px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xl);
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

    .reference-card {
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
      border-radius: var(--radius-xl);
      padding: var(--spacing-2xl);
      text-align: center;
      color: var(--color-white);
      box-shadow: var(--shadow-lg);
    }

    .reference-label {
      display: block;
      font-size: 0.9rem;
      opacity: 0.9;
      margin-bottom: var(--spacing-sm);
    }

    .reference-number {
      display: block;
      font-family: monospace;
      font-size: 2rem;
      font-weight: 700;
      letter-spacing: 2px;
      margin-bottom: var(--spacing-md);
    }

    .reference-note {
      font-size: 0.85rem;
      opacity: 0.8;
      margin: 0;
    }

    .details-card,
    .next-steps-card {
      background: var(--color-white);
      border-radius: var(--radius-xl);
      padding: var(--spacing-2xl);
      box-shadow: var(--shadow-md);
    }

    .details-card h3,
    .next-steps-card h3 {
      margin-bottom: var(--spacing-xl);
      padding-bottom: var(--spacing-md);
      border-bottom: 2px solid var(--color-primary);
      display: inline-block;
    }

    .details-grid {
      display: grid;
      gap: var(--spacing-md);
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      padding: var(--spacing-sm) 0;
      border-bottom: 1px solid rgba(61, 43, 31, 0.1);
    }

    .detail-item:last-child {
      border-bottom: none;
    }

    .detail-item.total {
      margin-top: var(--spacing-md);
      padding-top: var(--spacing-md);
      border-top: 2px solid var(--color-primary);
      border-bottom: none;
    }

    .detail-label {
      color: var(--color-text-light);
      font-size: 0.95rem;
    }

    .detail-value {
      font-weight: 600;
      color: var(--color-text);
    }

    .detail-item.total .detail-value {
      font-size: 1.25rem;
      color: var(--color-primary);
    }

    .steps {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }

    .step {
      display: flex;
      align-items: center;
      gap: var(--spacing-lg);
    }

    .step-number {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--color-primary);
      color: var(--color-white);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      flex-shrink: 0;
    }

    .step p {
      margin: 0;
      color: var(--color-text);
      line-height: 1.5;
    }

    .actions {
      display: flex;
      gap: var(--spacing-md);
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn-calendar {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--color-background-alt);
      border: 2px solid var(--color-secondary);
      color: var(--color-secondary);
      cursor: pointer;
    }

    .btn-calendar:hover {
      background: var(--color-secondary);
      color: var(--color-white);
    }

    .btn-outline {
      background: transparent;
      border: 2px solid var(--color-primary);
      color: var(--color-primary);
    }

    .btn-outline:hover {
      background: var(--color-primary);
      color: var(--color-white);
    }

    .not-found {
      text-align: center;
      padding: var(--spacing-4xl);
    }

    .not-found h2 {
      margin-bottom: var(--spacing-xl);
      color: var(--color-text-light);
    }

    @media (max-width: 600px) {
      .reference-number {
        font-size: 1.5rem;
      }

      .detail-item {
        flex-direction: column;
        gap: var(--spacing-xs);
      }

      .actions {
        flex-direction: column;
      }

      .actions .btn {
        width: 100%;
        text-align: center;
      }
    }
  `]
})
export class ConfirmationComponent implements OnInit {
  lang = inject(LanguageService);
  private route = inject(ActivatedRoute);
  private bookingService = inject(BookingService);

  booking = signal<BookingResponse | null>(null);
  isLoading = signal(true);

  downloadIcs(): void {
    const b = this.booking();
    if (!b) return;

    const formatIcsDate = (dateStr: string): string =>
      dateStr.replace(/-/g, '').slice(0, 8);

    const start = formatIcsDate(b.start_date);
    const end = b.end_date ? formatIcsDate(b.end_date) : start;
    const isFr = this.lang.language() === 'fr';
    const summary = isFr
      ? `Voyage NIO FAR — ${b.excursion_title}`
      : `NIO FAR Trip — ${b.excursion_title}`;
    const description = isFr
      ? `Référence\\: ${b.reference_number}\\nContact\\: +221 75 651 83 50`
      : `Reference\\: ${b.reference_number}\\nContact\\: +221 75 651 83 50`;

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//NIO FAR Tourisme//FR',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `DTSTART;VALUE=DATE:${start}`,
      `DTEND;VALUE=DATE:${end}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      'LOCATION:Saly Portudal\\, M\'bour\\, Sénégal',
      'ORGANIZER;CN=NIO FAR Tourisme:mailto:contact@niofartourisme.com',
      `UID:${b.reference_number}@niofartourisme.com`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `niofar-${b.reference_number}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(async params => {
      const reference = params.get('reference');
      if (reference) {
        const data = await this.bookingService.getBookingByReference(reference);
        this.booking.set(data);
      }
      this.isLoading.set(false);
    });
  }
}
