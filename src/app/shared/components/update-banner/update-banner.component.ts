import { Component, inject } from '@angular/core';
import { VersionCheckService } from '../../../core/services/version-check.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-update-banner',
  standalone: true,
  template: `
    <!-- Téléchargement en cours (discret, non bloquant) -->
    @if (version.isDownloading()) {
      <div class="update-banner downloading" role="status" aria-live="polite">
        <div class="spinner-ring"></div>
        <span class="dl-text">
          {{ lang.language() === 'fr'
            ? 'Mise à jour en cours de téléchargement…'
            : 'Downloading update…' }}
        </span>
      </div>
    }

    <!-- Nouvelle version prête -->
    @if (version.hasUpdate()) {
      <div class="update-banner ready" role="alert" aria-live="assertive">

        <div class="update-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
               viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
        </div>

        <div class="update-text">
          <strong>
            {{ lang.language() === 'fr'
              ? 'Nouvelle version disponible'
              : 'New version available' }}
          </strong>
          <span>
            {{ lang.language() === 'fr'
              ? 'Une mise à jour est prête. Rechargez pour en profiter.'
              : 'An update is ready. Reload the page to apply it.' }}
          </span>
        </div>

        <div class="update-actions">
          <button class="btn-reload" (click)="version.applyUpdate()">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"
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
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17"
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
    /* ─── Base ───────────────────────────────────────────────────── */
    .update-banner {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 14px;
      border-radius: 14px;
      padding: 13px 18px;
      max-width: min(580px, calc(100vw - 32px));
      width: max-content;
      box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.3),
        0 2px 8px rgba(0, 0, 0, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
      animation: slide-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    }

    @keyframes slide-up {
      from { opacity: 0; transform: translateX(-50%) translateY(18px); }
      to   { opacity: 1; transform: translateX(-50%) translateY(0); }
    }

    /* ─── Variante téléchargement ────────────────────────────────── */
    .update-banner.downloading {
      background: #1a2b2b;
      color: rgba(255, 255, 255, 0.75);
      font-size: 0.82rem;
      padding: 10px 16px;
      gap: 10px;
    }

    .spinner-ring {
      flex-shrink: 0;
      width: 18px;
      height: 18px;
      border: 2px solid rgba(196, 159, 74, 0.3);
      border-top-color: #c49f4a;
      border-radius: 50%;
      animation: spin 0.75s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .dl-text {
      white-space: nowrap;
      color: rgba(255, 255, 255, 0.65);
    }

    /* ─── Variante prête ─────────────────────────────────────────── */
    .update-banner.ready {
      background: #1a2b2b;
      color: #ffffff;
    }

    .update-icon {
      flex-shrink: 0;
      width: 38px;
      height: 38px;
      background: rgba(196, 159, 74, 0.18);
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
      font-size: 0.88rem;
      font-weight: 700;
      color: #ffffff;
      line-height: 1.3;
    }

    .update-text span {
      font-size: 0.78rem;
      color: rgba(255, 255, 255, 0.6);
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
      padding: 9px 15px;
      font-weight: 700;
      font-size: 0.84rem;
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.18s, transform 0.15s;
    }

    .btn-reload:hover  { background: #d4af5a; transform: translateY(-1px); }
    .btn-reload:active { transform: translateY(0); }

    .btn-dismiss {
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.4);
      padding: 8px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.18s, background 0.18s;
    }

    .btn-dismiss:hover {
      color: rgba(255, 255, 255, 0.9);
      background: rgba(255, 255, 255, 0.08);
    }

    /* ─── Mobile ─────────────────────────────────────────────────── */
    @media (max-width: 600px) {
      .update-banner {
        bottom: 16px;
        padding: 11px 13px;
        gap: 10px;
        border-radius: 12px;
      }

      .update-banner.downloading {
        padding: 9px 13px;
      }

      .update-icon { width: 34px; height: 34px; }
      .update-text span { display: none; }

      .btn-reload { padding: 8px 12px; font-size: 0.8rem; }
    }
  `]
})
export class UpdateBannerComponent {
  version = inject(VersionCheckService);
  lang    = inject(LanguageService);
}
