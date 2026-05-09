import { inject, Injectable, OnDestroy, signal } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

interface VersionData {
  version: string;
  buildTime: string;
  sha: string;
}

const DISMISS_TTL_MS = 2 * 60 * 60 * 1000;
const POLL_INTERVAL_MS = 3 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class VersionCheckService implements OnDestroy {
  private swUpdate = inject(SwUpdate, { optional: true });

  readonly hasUpdate = signal(false);
  readonly isDownloading = signal(false);

  private currentVersion: string | null = null;
  private pollTimerId: ReturnType<typeof setInterval> | null = null;
  private visibilityHandler: (() => void) | null = null;

  async init(): Promise<void> {
    const data = await this.fetchVersion();
    if (data) {
      this.currentVersion = data.version;
    }

    if (this.swUpdate?.isEnabled) {
      this.initServiceWorkerListeners();
    }

    this.startPolling();
    this.listenVisibilityChange();
  }

  applyUpdate(): void {
    if (this.swUpdate?.isEnabled) {
      this.swUpdate
        .activateUpdate()
        .then(() => this.hardReload())
        .catch(() => this.hardReload());
    } else {
      this.hardReload();
    }
  }

  dismiss(): void {
    this.hasUpdate.set(false);
    sessionStorage.setItem('update-dismissed', String(Date.now()));
  }

  ngOnDestroy(): void {
    if (this.pollTimerId !== null) {
      clearInterval(this.pollTimerId);
    }
    if (this.visibilityHandler) {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
    }
  }

  private initServiceWorkerListeners(): void {
    const sw = this.swUpdate!;

    sw.versionUpdates.subscribe((evt) => {
      switch (evt.type) {
        case 'VERSION_DETECTED':
          this.isDownloading.set(true);
          break;
        case 'VERSION_READY':
          this.isDownloading.set(false);
          this.showUpdateIfNotDismissed();
          break;
        case 'VERSION_INSTALLATION_FAILED':
          this.isDownloading.set(false);
          break;
      }
    });

    sw.unrecoverable.subscribe(() => {
      this.hardReload();
    });

    sw.checkForUpdate().catch(() => {});
  }

  private startPolling(): void {
    this.pollTimerId = setInterval(() => this.checkVersion(), POLL_INTERVAL_MS);
  }

  private listenVisibilityChange(): void {
    this.visibilityHandler = () => {
      if (document.visibilityState === 'visible') {
        this.checkVersion();
      }
    };
    document.addEventListener('visibilitychange', this.visibilityHandler);
  }

  private async checkVersion(): Promise<void> {
    if (this.swUpdate?.isEnabled) {
      this.swUpdate.checkForUpdate().catch(() => {});
    }

    const data = await this.fetchVersion();
    if (
      data &&
      this.currentVersion !== null &&
      data.version !== this.currentVersion
    ) {
      this.showUpdateIfNotDismissed();
    }
  }

  private showUpdateIfNotDismissed(): void {
    if (!this.wasDismissedRecently()) {
      this.hasUpdate.set(true);
    }
  }

  private async fetchVersion(): Promise<VersionData | null> {
    try {
      const res = await fetch(`/version.json?_=${Date.now()}`, {
        cache: 'no-store',
        headers: { Pragma: 'no-cache', 'Cache-Control': 'no-cache' },
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

  private hardReload(): void {
    const hasCaches = typeof caches !== 'undefined';
    if (hasCaches) {
      caches.keys().then((names) => {
        for (const name of names) {
          caches.delete(name);
        }
        location.reload();
      });
    } else {
      location.reload();
    }
  }
}
