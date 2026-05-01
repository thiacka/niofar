import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';
import { PaymentService } from '../../core/services/payment.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  template: `
    <section class="page-hero">
      <div class="hero-overlay"></div>
      <div class="hero-content container">
        <div class="lock-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <h1>{{ lang.t('payment.title') }}</h1>
        <p>{{ lang.t('payment.subtitle') }}</p>
      </div>
    </section>

    <section class="payment-section section">
      <div class="container">
        @if (isLoading()) {
          <div class="loading"><div class="spinner"></div></div>
        } @else if (!summary()) {
          <div class="not-found">
            <h2>{{ lang.t('payment.notFound') }}</h2>
            <a routerLink="/circuits" class="btn btn-primary">{{ lang.t('booking.browseCircuits') }}</a>
          </div>
        } @else {
          <div class="payment-layout">

            <!-- Récapitulatif commande -->
            <div class="order-summary">
              <div class="summary-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <h3>{{ lang.t('confirmation.details') }}</h3>
              </div>
              <div class="summary-row">
                <span>{{ lang.t('payment.reference') }}</span>
                <span class="mono">{{ reference() }}</span>
              </div>
              <div class="summary-row">
                <span>{{ lang.language() === 'fr' ? 'Prestation' : 'Service' }}</span>
                <span>{{ summary()!.title }}</span>
              </div>
              <div class="summary-row total">
                <span>{{ lang.t('payment.amount') }}</span>
                <span>{{ summary()!.amount | number }} FCFA</span>
              </div>
            </div>

            <!-- Méthodes de paiement -->
            <div class="payment-methods">
              @if (errorMessage()) {
                <div class="alert-error">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {{ lang.t('payment.error') }}
                </div>
              }

              @if (processing()) {
                <div class="processing-overlay">
                  <div class="spinner"></div>
                  <p>{{ lang.t('payment.redirecting') }}</p>
                </div>
              }

              <!-- PayTech (local) -->
              <div class="method-card" [class.selected]="selectedMethod() === 'paytech'" (click)="selectedMethod.set('paytech')">
                <div class="method-radio">
                  <div class="radio-circle" [class.checked]="selectedMethod() === 'paytech'"></div>
                </div>
                <div class="method-icon paytech-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                </div>
                <div class="method-info">
                  <span class="method-title">{{ lang.t('payment.local.title') }}</span>
                  <span class="method-subtitle">{{ lang.t('payment.local.subtitle') }}</span>
                  <div class="method-logos">
                    <span class="logo-badge orange">Orange Money</span>
                    <span class="logo-badge wave">Wave</span>
                    <span class="logo-badge card">Carte locale</span>
                  </div>
                </div>
              </div>

              <!-- Stripe (international) -->
              <div class="method-card" [class.selected]="selectedMethod() === 'stripe'" (click)="selectedMethod.set('stripe')">
                <div class="method-radio">
                  <div class="radio-circle" [class.checked]="selectedMethod() === 'stripe'"></div>
                </div>
                <div class="method-icon stripe-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                </div>
                <div class="method-info">
                  <span class="method-title">{{ lang.t('payment.intl.title') }}</span>
                  <span class="method-subtitle">{{ lang.t('payment.intl.subtitle') }}</span>
                  <div class="method-logos">
                    <span class="logo-badge visa">VISA</span>
                    <span class="logo-badge mc">Mastercard</span>
                    <span class="logo-badge amex">Amex</span>
                  </div>
                </div>
              </div>

              <!-- PayPal -->
              <div class="method-card" [class.selected]="selectedMethod() === 'paypal'" (click)="selectedMethod.set('paypal')">
                <div class="method-radio">
                  <div class="radio-circle" [class.checked]="selectedMethod() === 'paypal'"></div>
                </div>
                <div class="method-icon paypal-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="M12 12h.01"/>
                    <path d="M8 12h.01"/>
                    <path d="M16 12h.01"/>
                  </svg>
                </div>
                <div class="method-info">
                  <span class="method-title">{{ lang.t('payment.paypal.title') }}</span>
                  <span class="method-subtitle">{{ lang.t('payment.paypal.subtitle') }}</span>
                  <div class="method-logos">
                    <span class="logo-badge paypal">PayPal</span>
                    <span class="logo-badge pp-card">Carte</span>
                  </div>
                </div>
              </div>

              <!-- Payer plus tard -->
              <div class="method-card" [class.selected]="selectedMethod() === 'later'" (click)="selectedMethod.set('later')">
                <div class="method-radio">
                  <div class="radio-circle" [class.checked]="selectedMethod() === 'later'"></div>
                </div>
                <div class="method-icon later-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div class="method-info">
                  <span class="method-title">{{ lang.t('payment.later.title') }}</span>
                  <span class="method-subtitle">{{ lang.t('payment.later.subtitle') }}</span>
                </div>
              </div>

              <button
                class="btn btn-primary btn-pay"
                [disabled]="!selectedMethod() || processing()"
                (click)="pay()"
              >
                @if (processing()) {
                  <span class="spinner-small"></span>
                  {{ lang.t('payment.processing') }}
                } @else if (selectedMethod() === 'paytech') {
                  {{ lang.t('payment.local.btn') }}
                } @else if (selectedMethod() === 'stripe') {
                  {{ lang.t('payment.intl.btn') }}
                } @else if (selectedMethod() === 'paypal') {
                  {{ lang.t('payment.paypal.btn') }}
                } @else {
                  {{ lang.t('payment.later.btn') }}
                }
              </button>

              <div class="secure-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                {{ lang.t('payment.secure') }}
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
      height: 30vh;
      min-height: 220px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a1a2e 0%, var(--color-primary) 100%);
    }
    .hero-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.25); }
    .hero-content {
      position: relative;
      text-align: center;
      color: var(--color-white);
      padding-top: var(--header-height);
    }
    .lock-icon { margin-bottom: var(--spacing-md); color: rgba(255,255,255,0.9); }
    .hero-content h1 { color: var(--color-white); margin-bottom: var(--spacing-xs); font-size: 1.8rem; }
    .hero-content p { opacity: 0.85; font-size: 0.95rem; }

    .loading { display: flex; justify-content: center; padding: var(--spacing-4xl); }
    .spinner {
      width: 40px; height: 40px;
      border: 3px solid rgba(61,43,31,0.1);
      border-top-color: var(--color-primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .not-found { text-align: center; padding: var(--spacing-4xl); }
    .not-found h2 { margin-bottom: var(--spacing-xl); color: var(--color-text-light); }

    .payment-layout {
      max-width: 640px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xl);
    }

    .order-summary {
      background: var(--color-white);
      border-radius: var(--radius-xl);
      padding: var(--spacing-xl);
      box-shadow: var(--shadow-md);
      border: 1px solid rgba(61,43,31,0.08);
    }
    .summary-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-lg);
      padding-bottom: var(--spacing-md);
      border-bottom: 2px solid var(--color-primary);
    }
    .summary-header svg { color: var(--color-primary); }
    .summary-header h3 { margin: 0; font-size: 1rem; }
    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-sm) 0;
      font-size: 0.9rem;
      border-bottom: 1px solid rgba(61,43,31,0.07);
    }
    .summary-row:last-child { border-bottom: none; }
    .summary-row.total {
      font-weight: 700;
      font-size: 1.1rem;
      color: var(--color-primary);
      padding-top: var(--spacing-md);
      border-top: 2px solid var(--color-primary);
      border-bottom: none;
      margin-top: var(--spacing-sm);
    }
    .mono { font-family: monospace; font-size: 0.85rem; letter-spacing: 1px; }

    .payment-methods {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
      position: relative;
    }

    .alert-error {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
      border-radius: var(--radius-md);
      padding: var(--spacing-md) var(--spacing-lg);
      font-size: 0.9rem;
    }

    .processing-overlay {
      position: absolute;
      inset: 0;
      background: rgba(255,255,255,0.9);
      border-radius: var(--radius-xl);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-lg);
      z-index: 10;
    }
    .processing-overlay p { font-weight: 600; color: var(--color-text); }

    .method-card {
      display: flex;
      align-items: center;
      gap: var(--spacing-lg);
      background: var(--color-white);
      border: 2px solid rgba(61,43,31,0.12);
      border-radius: var(--radius-xl);
      padding: var(--spacing-lg) var(--spacing-xl);
      cursor: pointer;
      transition: all 0.2s;
    }
    .method-card:hover { border-color: var(--color-primary); box-shadow: var(--shadow-md); }
    .method-card.selected {
      border-color: var(--color-primary);
      background: rgba(196,104,43,0.03);
      box-shadow: var(--shadow-md);
    }

    .method-radio { flex-shrink: 0; }
    .radio-circle {
      width: 20px; height: 20px;
      border-radius: 50%;
      border: 2px solid rgba(61,43,31,0.25);
      transition: all 0.2s;
      position: relative;
    }
    .radio-circle.checked {
      border-color: var(--color-primary);
      background: var(--color-primary);
    }
    .radio-circle.checked::after {
      content: '';
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 8px; height: 8px;
      border-radius: 50%;
      background: white;
    }

    .method-icon {
      width: 48px; height: 48px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .paytech-icon { background: rgba(255,102,0,0.1); color: #ff6600; }
    .stripe-icon  { background: rgba(99,91,255,0.1); color: #635bff; }
    .paypal-icon  { background: rgba(0,48,135,0.1); color: #003087; }
    .later-icon   { background: rgba(43,138,138,0.1); color: var(--color-secondary); }

    .method-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }
    .method-title { font-weight: 700; font-size: 1rem; color: var(--color-text); }
    .method-subtitle { font-size: 0.82rem; color: var(--color-text-light); }

    .method-logos {
      display: flex;
      gap: var(--spacing-xs);
      flex-wrap: wrap;
      margin-top: 4px;
    }
    .logo-badge {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
      letter-spacing: 0.02em;
    }
    .logo-badge.orange  { background: #ff6600; color: white; }
    .logo-badge.wave    { background: #1d1d5e; color: white; }
    .logo-badge.card    { background: #eee; color: #555; }
    .logo-badge.visa    { background: #1a1f71; color: white; }
    .logo-badge.mc      { background: #eb001b; color: white; }
    .logo-badge.amex    { background: #2e77bc; color: white; }
    .logo-badge.paypal  { background: #003087; color: white; }
    .logo-badge.pp-card { background: #eee; color: #555; }

    .btn-pay {
      width: 100%;
      padding: var(--spacing-md);
      font-size: 1.05rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
      margin-top: var(--spacing-sm);
    }
    .btn-pay:disabled { opacity: 0.5; cursor: not-allowed; }

    .spinner-small {
      width: 18px; height: 18px;
      border: 2px solid rgba(255,255,255,0.4);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    .secure-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-xs);
      font-size: 0.78rem;
      color: var(--color-text-light);
    }
    .secure-badge svg { color: #16a34a; }
  `]
})
export class PaymentComponent implements OnInit {
  lang = inject(LanguageService);
  private route = inject(ActivatedRoute);
  private paymentService = inject(PaymentService);

  reference = signal('');
  summary = signal<{ title: string; email: string; amount: number } | null>(null);
  isLoading = signal(true);
  selectedMethod = signal<'paytech' | 'stripe' | 'paypal' | 'later' | null>(null);
  processing = signal(false);
  errorMessage = signal(false);

  async pay(): Promise<void> {
    const method = this.selectedMethod();
    const ref = this.reference();
    const s = this.summary();
    if (!method || !s) return;

    this.processing.set(true);
    this.errorMessage.set(false);

    if (method === 'paytech') {
      const result = await this.paymentService.initiatePayTech(ref, s.amount, s.title, s.email);
      if ('url' in result) {
        window.location.href = result.url;
      } else {
        this.processing.set(false);
        this.errorMessage.set(true);
      }
    } else if (method === 'stripe') {
      const result = await this.paymentService.initiateStripe(ref, s.amount, s.title, s.email);
      if ('url' in result) {
        window.location.href = result.url;
      } else {
        this.processing.set(false);
        this.errorMessage.set(true);
      }
    } else if (method === 'paypal') {
      const result = await this.paymentService.initiatePayPal(ref, s.amount, s.title, s.email);
      if ('url' in result) {
        window.location.href = result.url;
      } else {
        this.processing.set(false);
        this.errorMessage.set(true);
      }
    } else {
      const table = this.paymentService.resolveTable(ref);
      await this.paymentService.confirmLater(ref, table);
      window.location.href = `/confirmation/${ref}`;
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(async params => {
      const ref = params.get('reference') ?? '';
      this.reference.set(ref);
      if (ref) {
        const data = await this.paymentService.getBookingSummary(ref);
        this.summary.set(data);
      }
      this.isLoading.set(false);
    });
  }
}
