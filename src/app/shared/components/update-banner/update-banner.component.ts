import { Component, inject } from '@angular/core';
import { VersionCheckService } from '../../../core/services/version-check.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-update-banner',
  standalone: true,
  template: `
    @if (version.hasUpdate()) {
      <div class="update-banner" role="alert" aria-live="polite">

        <div class="update-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
               viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 4 23 10 17 10"/>
            <polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10
                     M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
        </div>

        <div class="update-text">
          <strong>{{ lang.language() === 'fr'
            ? 'Nouvelle version disponible'
            : 'New version available' }}</strong>
          <span>{{ lang.language() === 'fr'
            ? 'Une mise à jour a été déployée. Rechargez la page pour en profiter.'
            : 'An update has been deployed. Reload the page to get it.' }}</span>
        </div>

        <div class="update-actions">
          <button class="btn-reload" (click)="version.applyUpdate()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                 viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            {{ lang.language() === 'fr' ? 'Actualiser' : 'Refresh' }}
          </button>
          <button class="btn-dismiss"
                  [attr.aria-label]="lang.language() === 'fr' ? 'Ignorer' : 'Dismiss'"
                  (click)="version.dismiss()">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

      </div>
    }
  `,
  styles: [`
    .update-banner {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;

      display: flex;
      align-items: center;
      gap: 16px;

      background: #1a2b2b;
      color: #ffffff;
      border-radius: 14px;
      padding: 14px 20px;
      box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.35),
        0 2px 8px rgba(0, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);

      max-width: min(600px, calc(100vw - 32px));
      width: max-content;

      animation: slide-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    }

    @keyframes slide-up {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }

    .update-icon {
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      background: rgba(196, 159, 74, 0.2);
      border: 1px solid rgba(196, 159, 74, 0.35);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #c49f4a;
    }

    .update-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex: 1;
      min-width: 0;
    }

    .update-text strong {
      font-size: 0.9rem;
      font-weight: 700;
      color: #ffffff;
      line-height: 1.3;
    }

    .update-text span {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.65);
      line-height: 1.4;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .update-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }

    .btn-reload {
      display: flex;
      align-items: center;
      gap: 7px;
      background: #c49f4a;
      color: #1a2b2b;
      border: none;
      border-radius: 8px;
      padding: 9px 16px;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      transition: background 0.2s, transform 0.15s;
      white-space: nowrap;
    }

    .btn-reload:hover {
      background: #d4af5a;
      transform: translateY(-1px);
    }

    .btn-reload:active {
      transform: translateY(0);
    }

    .btn-dismiss {
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.45);
      padding: 8px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s, background 0.2s;
    }

    .btn-dismiss:hover {
      color: rgba(255, 255, 255, 0.9);
      background: rgba(255, 255, 255, 0.08);
    }

    /* Tablette et mobile */
    @media (max-width: 600px) {
      .update-banner {
        bottom: 16px;
        padding: 12px 14px;
        gap: 12px;
        border-radius: 12px;
      }

      .update-icon {
        width: 36px;
        height: 36px;
      }

      .update-text span {
        display: none;
      }

      .btn-reload {
        padding: 8px 12px;
        font-size: 0.8rem;
      }
    }
  `]
})
export class UpdateBannerComponent {
  version = inject(VersionCheckService);
  lang    = inject(LanguageService);
}
