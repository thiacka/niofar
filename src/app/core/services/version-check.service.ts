import { inject, Injectable, OnDestroy, signal } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

interface VersionData {
  version:   string;
  buildTime: string;
  sha:       string;
}

// Durée pendant laquelle le banner ne réapparaît pas après "Ignorer" (2h)
const DISMISS_TTL_MS = 2 * 60 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class VersionCheckService implements OnDestroy {

  /** Injection optionnelle : null en mode dev (SW désactivé) */
  private swUpdate = inject(SwUpdate, { optional: true });

  /** true quand une nouvelle version est prête à être activée */
  readonly hasUpdate = signal(false);

  /** true pendant que le SW télécharge la nouvelle version */
  readonly isDownloading = signal(false);

  private currentVersion: string | null = null;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  /**
   * À appeler une seule fois au démarrage de l'app.
   * Utilise SwUpdate si le service worker est actif,
   * sinon bascule sur le polling version.json (dev / browsers sans SW).
   */
  async init(): Promise<void> {
    if (this.swUpdate?.isEnabled) {
      this.initWithServiceWorker();
    } else {
      await this.initWithPolling();
    }
  }

  /**
   * Applique la mise à jour et recharge la page.
   * Avec SW : active d'abord la nouvelle version pour ne pas recharger
   * sur l'ancienne version cachée.
   */
  applyUpdate(): void {
    if (this.swUpdate?.isEnabled) {
      this.swUpdate
        .activateUpdate()
        .then(() => window.location.reload())
        .catch(() => window.location.reload());
    } else {
      window.location.reload();
    }
  }

  /** Ferme le banner et mémorise le refus pendant DISMISS_TTL_MS. */
  dismiss(): void {
    this.hasUpdate.set(false);
    sessionStorage.setItem('update-dismissed', String(Date.now()));
  }

  ngOnDestroy(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
    }
  }

  // ─── Méthodes privées ────────────────────────────────────────────────────────

  private initWithServiceWorker(): void {
    const sw = this.swUpdate!;

    // Écoute les mises à jour du SW
    sw.versionUpdates.subscribe(evt => {
      switch (evt.type) {
        case 'VERSION_DETECTED':
          // Une nouvelle version a été détectée, téléchargement en cours
          this.isDownloading.set(true);
          break;

        case 'VERSION_READY':
          // Nouvelle version téléchargée et prête — on montre le banner
          this.isDownloading.set(false);
          if (!this.wasDismissedRecently()) {
            this.hasUpdate.set(true);
          }
          break;

        case 'VERSION_INSTALLATION_FAILED':
          this.isDownloading.set(false);
          break;
      }
    });

    // Quand le SW entre en état irrécupérable : rechargement forcé
    sw.unrecoverable.subscribe(() => {
      window.location.reload();
    });

    // Vérification immédiate au démarrage
    sw.checkForUpdate().catch(() => {});

    // Vérification périodique toutes les 5 minutes
    this.intervalId = setInterval(() => {
      sw.checkForUpdate().catch(() => {});
    }, 5 * 60 * 1000);
  }

  private async initWithPolling(): Promise<void> {
    const data = await this.fetchVersion();
    if (data) {
      this.currentVersion = data.version;
    }
    // Polling toutes les 5 minutes
    this.intervalId = setInterval(() => this.checkViaPolling(), 5 * 60 * 1000);
  }

  private async checkViaPolling(): Promise<void> {
    const data = await this.fetchVersion();
    if (
      data &&
      this.currentVersion !== null &&
      data.version !== this.currentVersion &&
      !this.wasDismissedRecently()
    ) {
      this.hasUpdate.set(true);
    }
  }

  private async fetchVersion(): Promise<VersionData | null> {
    try {
      // ?t= pour contourner tout cache HTTP résiduel
      const res = await fetch(`/version.json?t=${Date.now()}`, {
        cache: 'no-store'
      });
      if (!res.ok) return null;
      return (await res.json()) as VersionData;
    } catch {
      return null;
    }
  }

  private wasDismissedRecently(): boolean {
    const dismissed = sessionStorage.getItem('update-dismissed');
    if (!dismissed) return false;
    return Date.now() - parseInt(dismissed, 10) < DISMISS_TTL_MS;
  }
}
