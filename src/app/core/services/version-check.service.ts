import { Injectable, signal, OnDestroy } from '@angular/core';

interface VersionData {
  version:   string;
  buildTime: string;
  sha:       string;
}

@Injectable({ providedIn: 'root' })
export class VersionCheckService implements OnDestroy {
  /** true quand une nouvelle version est disponible */
  readonly hasUpdate = signal(false);

  private currentVersion: string | null = null;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  /** À appeler une seule fois au démarrage de l'app (APP_INITIALIZER). */
  async init(): Promise<void> {
    const data = await this.fetchVersion();
    if (data) {
      this.currentVersion = data.version;
    }
    // Vérifier toutes les 5 minutes
    this.intervalId = setInterval(() => this.check(), 5 * 60 * 1000);
  }

  /** Effectue une vérification immédiate (peut être appelée manuellement). */
  async check(): Promise<void> {
    const data = await this.fetchVersion();
    if (
      data &&
      this.currentVersion !== null &&
      data.version !== this.currentVersion
    ) {
      this.hasUpdate.set(true);
    }
  }

  /** Recharge la page en vidant le cache du navigateur. */
  applyUpdate(): void {
    // Forcer le rechargement sans cache
    window.location.reload();
  }

  /** Masque la bannière sans recharger (l'utilisateur décide plus tard). */
  dismiss(): void {
    this.hasUpdate.set(false);
  }

  private async fetchVersion(): Promise<VersionData | null> {
    try {
      // Cache-busting via timestamp pour toujours obtenir la version fraîche
      const res = await fetch(`/version.json?t=${Date.now()}`, {
        cache: 'no-store'
      });
      if (!res.ok) return null;
      return (await res.json()) as VersionData;
    } catch {
      return null;
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
    }
  }
}
