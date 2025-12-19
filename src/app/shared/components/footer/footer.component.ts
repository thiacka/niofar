import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="footer-logo">
              <span class="logo-text">NIO FAR</span>
              <span class="logo-tagline">Travel Services</span>
            </div>
            <p class="footer-tagline">{{ lang.t('footer.tagline') }}</p>
            <p class="footer-meaning">"We are together" - Wolof</p>
          </div>

          <div class="footer-links">
            <h4>Navigation</h4>
            <nav>
              <a routerLink="/">{{ lang.t('nav.home') }}</a>
              <a routerLink="/about">{{ lang.t('nav.about') }}</a>
              <a routerLink="/services">{{ lang.t('nav.services') }}</a>
              <a routerLink="/experiences">{{ lang.t('nav.experiences') }}</a>
              <a routerLink="/why-nio-far">{{ lang.t('nav.why') }}</a>
              <a routerLink="/contact">{{ lang.t('nav.contact') }}</a>
            </nav>
          </div>

          <div class="footer-contact">
            <h4>Contact</h4>
            <div class="contact-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <span>+221 XX XXX XX XX</span>
            </div>
            <div class="contact-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span>contact&#64;niofar.com</span>
            </div>
            <div class="contact-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>Dakar, Senegal</span>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; {{ currentYear }} NIO FAR. {{ lang.t('footer.rights') }}.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--color-text);
      color: var(--color-white);
      padding: var(--spacing-4xl) 0 var(--spacing-xl);
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: var(--spacing-3xl);
      margin-bottom: var(--spacing-3xl);
    }

    .footer-logo {
      display: flex;
      flex-direction: column;
      margin-bottom: var(--spacing-md);
    }

    .logo-text {
      font-family: var(--font-heading);
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--color-accent);
      line-height: 1;
    }

    .logo-tagline {
      font-size: 0.7rem;
      color: var(--color-secondary-light);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .footer-tagline {
      color: rgba(255,255,255,0.9);
      margin-bottom: var(--spacing-sm);
    }

    .footer-meaning {
      font-style: italic;
      color: rgba(255,255,255,0.6);
      font-size: 0.9rem;
    }

    .footer-links h4,
    .footer-contact h4 {
      color: var(--color-accent);
      font-size: 1rem;
      margin-bottom: var(--spacing-lg);
      font-family: var(--font-body);
      font-weight: 600;
    }

    .footer-links nav {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .footer-links a {
      color: rgba(255,255,255,0.8);
      font-size: 0.95rem;
      transition: color var(--transition-fast);
    }

    .footer-links a:hover {
      color: var(--color-accent);
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-md);
      color: rgba(255,255,255,0.8);
    }

    .contact-item svg {
      color: var(--color-accent);
      flex-shrink: 0;
    }

    .footer-bottom {
      padding-top: var(--spacing-xl);
      border-top: 1px solid rgba(255,255,255,0.1);
      text-align: center;
    }

    .footer-bottom p {
      color: rgba(255,255,255,0.5);
      font-size: 0.875rem;
      margin: 0;
    }

    @media (max-width: 768px) {
      .footer-grid {
        grid-template-columns: 1fr;
        gap: var(--spacing-2xl);
        text-align: center;
      }

      .footer-links nav {
        align-items: center;
      }

      .contact-item {
        justify-content: center;
      }
    }
  `]
})
export class FooterComponent {
  lang = inject(LanguageService);
  currentYear = new Date().getFullYear();
}
