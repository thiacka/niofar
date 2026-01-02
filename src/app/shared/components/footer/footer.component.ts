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
            <div class="social-links">
              <a href="https://wa.me/221338226699" target="_blank" rel="noopener noreferrer" class="social-link whatsapp" aria-label="WhatsApp">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              <a href="https://instagram.com/niofar" target="_blank" rel="noopener noreferrer" class="social-link instagram" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="https://facebook.com/niofar" target="_blank" rel="noopener noreferrer" class="social-link facebook" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://tripadvisor.com/niofar" target="_blank" rel="noopener noreferrer" class="social-link tripadvisor" aria-label="TripAdvisor">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.006 4.295c-2.67 0-5.338.784-7.645 2.353H0l1.963 2.135a5.997 5.997 0 0 0 4.04 10.43 5.976 5.976 0 0 0 4.075-1.6L12 19.705l1.922-2.09a5.972 5.972 0 0 0 4.072 1.598 6 6 0 0 0 6-5.998 5.982 5.982 0 0 0-1.957-4.432L24 6.648h-4.35a13.573 13.573 0 0 0-7.644-2.353zM6.003 17.213a4.002 4.002 0 1 1 0-8.003 4.002 4.002 0 0 1 0 8.003zm11.994 0a4.002 4.002 0 1 1 0-8.003 4.002 4.002 0 0 1 0 8.003zM6.003 11.21a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm11.994 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                </svg>
              </a>
            </div>
          </div>

          <div class="footer-links">
            <h4>Navigation</h4>
            <nav>
              <a routerLink="/">{{ lang.t('nav.home') }}</a>
              <a routerLink="/services">{{ lang.t('nav.services') }}</a>
              <a routerLink="/experiences">{{ lang.t('nav.experiences') }}</a>
              <a routerLink="/circuits">{{ lang.t('nav.circuits') }}</a>
              <a routerLink="/why-nio-far">{{ lang.t('nav.why') }}</a>
              <a routerLink="/contact">{{ lang.t('nav.contact') }}</a>
            </nav>
          </div>

          <div class="footer-contact">
            <h4>Contact</h4>
            <a href="tel:+221338226699" class="contact-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <span>+221 33 822 66 99</span>
            </a>
            <a href="mailto:contact@niofar.com" class="contact-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span>contact&#64;niofar.com</span>
            </a>
            <div class="contact-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>Dakar, Senegal</span>
            </div>
            <a href="https://wa.me/221338226699" target="_blank" rel="noopener noreferrer" class="whatsapp-cta">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {{ lang.t('contact.whatsapp') }}
            </a>
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
      margin-bottom: var(--spacing-lg);
    }

    .social-links {
      display: flex;
      gap: var(--spacing-md);
    }

    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.8);
      transition: all var(--transition-base);
    }

    .social-link:hover {
      transform: translateY(-3px);
    }

    .social-link.whatsapp:hover {
      background: #25D366;
      color: white;
    }

    .social-link.instagram:hover {
      background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
      color: white;
    }

    .social-link.facebook:hover {
      background: #1877F2;
      color: white;
    }

    .social-link.tripadvisor:hover {
      background: #00AF87;
      color: white;
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
      text-decoration: none;
      transition: color var(--transition-fast);
    }

    a.contact-item:hover {
      color: var(--color-accent);
    }

    .contact-item svg {
      color: var(--color-accent);
      flex-shrink: 0;
    }

    .whatsapp-cta {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-sm);
      margin-top: var(--spacing-md);
      padding: var(--spacing-sm) var(--spacing-lg);
      background: #25D366;
      color: white;
      border-radius: var(--radius-full);
      font-weight: 600;
      font-size: 0.9rem;
      transition: all var(--transition-base);
    }

    .whatsapp-cta:hover {
      background: #128C7E;
      transform: translateY(-2px);
      color: white;
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

      .social-links {
        justify-content: center;
      }

      .footer-links nav {
        align-items: center;
      }

      .contact-item {
        justify-content: center;
      }

      .whatsapp-cta {
        display: inline-flex;
        justify-content: center;
      }
    }
  `]
})
export class FooterComponent {
  lang = inject(LanguageService);
  currentYear = new Date().getFullYear();
}
