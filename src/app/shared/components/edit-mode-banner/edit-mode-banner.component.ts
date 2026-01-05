import { Component, inject } from '@angular/core';
import { EditModeService } from '../../../core/services/edit-mode.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-mode-banner',
  standalone: true,
  imports: [],
  template: `
    @if (editMode.isEditMode()) {
      <div class="edit-banner">
        <div class="banner-content">
          <div class="banner-left">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            <span><strong>Mode Edition Actif</strong> - Cliquez sur les textes pour les modifier</span>
          </div>
          <div class="banner-actions">
            <button class="btn-back" (click)="goToAdmin()">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Admin
            </button>
            <button class="btn-disable" (click)="editMode.toggleEditMode()">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Desactiver
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .edit-banner {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: var(--color-accent);
      color: var(--color-white);
      z-index: 10000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }

    .banner-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-sm) var(--spacing-xl);
      gap: var(--spacing-md);
    }

    .banner-left {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .banner-left svg {
      flex-shrink: 0;
    }

    .banner-left span {
      font-size: 0.9rem;
    }

    .banner-actions {
      display: flex;
      gap: var(--spacing-sm);
    }

    .btn-back,
    .btn-disable {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-xs) var(--spacing-md);
      border: 1px solid rgba(255, 255, 255, 0.3);
      background: rgba(255, 255, 255, 0.1);
      color: var(--color-white);
      border-radius: var(--radius-md);
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 600;
      transition: all var(--transition-fast);
    }

    .btn-back:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.5);
    }

    .btn-disable:hover {
      background: rgba(196, 91, 74, 0.3);
      border-color: var(--color-error);
    }

    @media (max-width: 768px) {
      .banner-content {
        flex-direction: column;
        align-items: stretch;
        padding: var(--spacing-sm);
      }

      .banner-left {
        justify-content: center;
      }

      .banner-actions {
        justify-content: center;
      }

      .banner-left span {
        font-size: 0.8rem;
      }
    }
  `]
})
export class EditModeBannerComponent {
  editMode = inject(EditModeService);
  private router = inject(Router);

  goToAdmin(): void {
    this.router.navigate(['/admin']);
  }
}
