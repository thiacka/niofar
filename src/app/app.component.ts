import { Component, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { EditModeBannerComponent } from './shared/components/edit-mode-banner/edit-mode-banner.component';
import { LanguageService } from './core/services/language.service';
import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, EditModeBannerComponent],
  template: `
    @if (!isAdminRoute()) {
      <app-edit-mode-banner />
      <app-header />
    }
    <main>
      <router-outlet />
    </main>
    @if (!isAdminRoute()) {
      <app-footer />
      <a
        [href]="whatsappUrl()"
        target="_blank"
        rel="noopener noreferrer"
        class="whatsapp-fab"
        [attr.aria-label]="lang.language() === 'fr' ? 'Nous contacter sur WhatsApp' : 'Contact us on WhatsApp'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span class="whatsapp-fab-label">
          {{ lang.language() === 'fr' ? 'Discutons !' : 'Chat with us!' }}
        </span>
      </a>
    }
  `,
  styles: [`
    main {
      min-height: 100vh;
    }

    .whatsapp-fab {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 900;
      display: flex;
      align-items: center;
      gap: 10px;
      background: #25D366;
      color: white;
      border-radius: 50px;
      padding: 14px 20px 14px 16px;
      box-shadow: 0 4px 20px rgba(37, 211, 102, 0.45);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.25s ease;
      max-width: 56px;
      overflow: hidden;
      white-space: nowrap;
    }

    .whatsapp-fab:hover {
      max-width: 200px;
      background: #128C7E;
      box-shadow: 0 6px 24px rgba(18, 140, 126, 0.5);
      transform: translateY(-3px);
    }

    .whatsapp-fab svg {
      flex-shrink: 0;
    }

    .whatsapp-fab-label {
      overflow: hidden;
      opacity: 0;
      max-width: 0;
      transition: opacity 0.2s ease 0.05s, max-width 0.25s ease;
    }

    .whatsapp-fab:hover .whatsapp-fab-label {
      opacity: 1;
      max-width: 160px;
    }

    @media (max-width: 480px) {
      .whatsapp-fab {
        bottom: 20px;
        right: 16px;
        padding: 14px;
        max-width: 56px;
      }

      .whatsapp-fab:hover {
        max-width: 56px;
      }

      .whatsapp-fab-label {
        display: none;
      }
    }
  `]
})
export class AppComponent {
  private router = inject(Router);
  lang = inject(LanguageService);

  isAdminRoute = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.router.url.startsWith('/admin'))
    ),
    { initialValue: this.router.url.startsWith('/admin') }
  );

  whatsappUrl(): string {
    const message = this.lang.language() === 'fr'
      ? 'Bonjour NIO FAR ! Je suis intéressé par vos services.'
      : 'Hello NIO FAR! I am interested in your services.';
    return `https://wa.me/221711525436?text=${encodeURIComponent(message)}`;
  }
}
