import { Component, inject, signal, OnInit, output } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';

const STORAGE_KEY = 'niofar_cookie_consent';

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  template: `
    @if (visible()) {
      <div class="cookie-banner" role="dialog" aria-live="polite" aria-label="Cookie consent">
        <div class="cookie-content">
          <div class="cookie-icon">🍪</div>
          <p class="cookie-message">{{ lang.t('cookie.message') }}</p>
          <div class="cookie-actions">
            <button class="btn-cookie btn-decline" (click)="decline()">
              {{ lang.t('cookie.decline') }}
            </button>
            <button class="btn-cookie btn-accept" (click)="accept()">
              {{ lang.t('cookie.accept') }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .cookie-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 9999;
      background: var(--color-text);
      color: var(--color-white);
      padding: var(--spacing-lg) var(--spacing-xl);
      box-shadow: 0 -4px 20px rgba(0,0,0,0.25);
      animation: slideUp 0.35s ease-out;
    }

    @keyframes slideUp {
      from { transform: translateY(100%); opacity: 0; }
      to   { transform: translateY(0);   opacity: 1; }
    }

    .cookie-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: var(--spacing-lg);
      flex-wrap: wrap;
    }

    .cookie-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .cookie-message {
      flex: 1;
      font-size: 0.9rem;
      line-height: 1.5;
      color: rgba(255,255,255,0.9);
      min-width: 200px;
    }

    .cookie-actions {
      display: flex;
      gap: var(--spacing-sm);
      flex-shrink: 0;
    }

    .btn-cookie {
      padding: var(--spacing-sm) var(--spacing-xl);
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
      white-space: nowrap;
    }

    .btn-decline {
      background: transparent;
      color: rgba(255,255,255,0.7);
      border: 1px solid rgba(255,255,255,0.3);
    }
    .btn-decline:hover {
      background: rgba(255,255,255,0.1);
      color: var(--color-white);
    }

    .btn-accept {
      background: var(--color-primary);
      color: var(--color-white);
    }
    .btn-accept:hover {
      background: var(--color-primary-light);
    }

    @media (max-width: 600px) {
      .cookie-content {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-md);
      }
      .cookie-actions {
        width: 100%;
        justify-content: flex-end;
      }
    }
  `]
})
export class CookieBannerComponent implements OnInit {
  lang = inject(LanguageService);

  visible = signal(false);
  consentGiven = output<boolean>();

  ngOnInit(): void {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null) {
      // Aucun choix encore — afficher après un court délai
      setTimeout(() => this.visible.set(true), 1500);
    } else if (stored === 'true') {
      this.enableAnalytics();
    }
  }

  accept(): void {
    localStorage.setItem(STORAGE_KEY, 'true');
    this.visible.set(false);
    this.enableAnalytics();
    this.consentGiven.emit(true);
  }

  decline(): void {
    localStorage.setItem(STORAGE_KEY, 'false');
    this.visible.set(false);
    this.consentGiven.emit(false);
  }

  private enableAnalytics(): void {
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'granted'
      });
    }
  }
}
