import { Component, inject, signal, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { ExcursionService, Excursion, ExcursionFormData } from '../../core/services/excursion.service';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-admin-excursions',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  template: `
    <div class="section-header">
      <h2>{{ lang.t('admin.excursionsManagement') }}</h2>
      <button class="btn btn-primary" (click)="openCreateForm()">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        {{ lang.t('admin.addExcursion') }}
      </button>
    </div>

    @if (isLoading()) {
      <div class="loading">
        <div class="spinner"></div>
      </div>
    } @else {
      <div class="excursions-grid">
        @for (excursion of excursions(); track excursion.id) {
          <div class="excursion-card" [class.inactive]="!excursion.is_active">
            <div class="excursion-image">
              <img [src]="excursion.image_url" [alt]="excursion.title_fr" />
              @if (!excursion.is_active) {
                <span class="status-badge inactive">{{ lang.t('admin.inactive') }}</span>
              }
            </div>
            <div class="excursion-info">
              <h3>{{ excursion.title_fr }}</h3>
              <p class="excursion-duration">{{ excursion.duration_fr }}</p>
              <p class="excursion-price">{{ excursion.price | number }} FCFA</p>
            </div>
            <div class="excursion-actions">
              <button class="btn-icon" [title]="lang.t('admin.edit')" (click)="openEditForm(excursion)">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button class="btn-icon" [title]="lang.t('admin.toggleStatus')" (click)="toggleStatus(excursion)">
                @if (excursion.is_active) {
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                }
              </button>
              <button class="btn-icon danger" [title]="lang.t('admin.delete')" (click)="deleteExcursion(excursion)">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        }
      </div>
    }

    @if (showForm()) {
      <div class="modal-overlay" (click)="closeForm()">
        <div class="modal large" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ isEditing() ? lang.t('admin.editExcursion') : lang.t('admin.addExcursion') }}</h3>
            <button class="btn-close" (click)="closeForm()">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <form (ngSubmit)="saveExcursion()">
              <div class="form-row">
                <div class="form-group">
                  <label>Slug (URL)</label>
                  <input type="text" [(ngModel)]="formData.slug" name="slug" required [disabled]="isEditing()" />
                </div>
                <div class="form-group">
                  <label>{{ lang.t('admin.price') }} (FCFA)</label>
                  <input type="number" [(ngModel)]="formData.price" name="price" required />
                </div>
              </div>

              <div class="form-group">
                <label>{{ lang.t('admin.imageUrl') }}</label>
                <input type="url" [(ngModel)]="formData.image_url" name="image_url" required />
              </div>

              <div class="form-section">
                <h4>Francais</h4>
                <div class="form-row">
                  <div class="form-group">
                    <label>{{ lang.t('admin.titleFr') }}</label>
                    <input type="text" [(ngModel)]="formData.title_fr" name="title_fr" required />
                  </div>
                  <div class="form-group">
                    <label>{{ lang.t('admin.durationFr') }}</label>
                    <input type="text" [(ngModel)]="formData.duration_fr" name="duration_fr" required />
                  </div>
                </div>
                <div class="form-group">
                  <label>{{ lang.t('admin.descriptionFr') }}</label>
                  <textarea [(ngModel)]="formData.description_fr" name="description_fr" rows="3" required></textarea>
                </div>
                <div class="form-group">
                  <label>{{ lang.t('admin.highlightsFr') }}</label>
                  <input type="text" [(ngModel)]="highlightsFrText" name="highlights_fr" [placeholder]="lang.t('admin.highlightsPlaceholder')" />
                </div>
                <div class="form-group">
                  <label>{{ lang.t('admin.priceNoteFr') }}</label>
                  <input type="text" [(ngModel)]="formData.price_note_fr" name="price_note_fr" />
                </div>
              </div>

              <div class="form-section">
                <h4>English</h4>
                <div class="form-row">
                  <div class="form-group">
                    <label>{{ lang.t('admin.titleEn') }}</label>
                    <input type="text" [(ngModel)]="formData.title_en" name="title_en" required />
                  </div>
                  <div class="form-group">
                    <label>{{ lang.t('admin.durationEn') }}</label>
                    <input type="text" [(ngModel)]="formData.duration_en" name="duration_en" required />
                  </div>
                </div>
                <div class="form-group">
                  <label>{{ lang.t('admin.descriptionEn') }}</label>
                  <textarea [(ngModel)]="formData.description_en" name="description_en" rows="3" required></textarea>
                </div>
                <div class="form-group">
                  <label>{{ lang.t('admin.highlightsEn') }}</label>
                  <input type="text" [(ngModel)]="highlightsEnText" name="highlights_en" [placeholder]="lang.t('admin.highlightsPlaceholder')" />
                </div>
                <div class="form-group">
                  <label>{{ lang.t('admin.priceNoteEn') }}</label>
                  <input type="text" [(ngModel)]="formData.price_note_en" name="price_note_en" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>{{ lang.t('admin.displayOrder') }}</label>
                  <input type="number" [(ngModel)]="formData.display_order" name="display_order" />
                </div>
                <div class="form-group checkbox-group">
                  <label>
                    <input type="checkbox" [(ngModel)]="formData.is_active" name="is_active" />
                    {{ lang.t('admin.active') }}
                  </label>
                </div>
              </div>

              <div class="form-actions">
                <button type="button" class="btn btn-outline" (click)="closeForm()">{{ lang.t('admin.cancel') }}</button>
                <button type="submit" class="btn btn-primary" [disabled]="isSaving()">
                  @if (isSaving()) {
                    <span class="spinner-small"></span>
                  }
                  {{ lang.t('admin.save') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-xl);
    }

    .section-header h2 {
      margin: 0;
      color: var(--color-text);
    }

    .section-header .btn {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .excursions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--spacing-lg);
    }

    .excursion-card {
      background: var(--color-white);
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-md);
      transition: all var(--transition-fast);
    }

    .excursion-card.inactive {
      opacity: 0.6;
    }

    .excursion-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .excursion-image {
      position: relative;
      height: 180px;
    }

    .excursion-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .status-badge {
      position: absolute;
      top: var(--spacing-sm);
      right: var(--spacing-sm);
      padding: 4px 12px;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge.inactive {
      background: rgba(196, 91, 74, 0.9);
      color: white;
    }

    .excursion-info {
      padding: var(--spacing-lg);
    }

    .excursion-info h3 {
      margin: 0 0 var(--spacing-sm);
      font-size: 1.1rem;
      color: var(--color-text);
    }

    .excursion-duration {
      font-size: 0.9rem;
      color: var(--color-text-light);
      margin-bottom: var(--spacing-xs);
    }

    .excursion-price {
      font-weight: 700;
      color: var(--color-primary);
      font-size: 1.1rem;
    }

    .excursion-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-sm);
      padding: var(--spacing-md) var(--spacing-lg);
      border-top: 1px solid rgba(61, 43, 31, 0.1);
    }

    .btn-icon {
      background: transparent;
      border: none;
      padding: var(--spacing-sm);
      cursor: pointer;
      color: var(--color-text-light);
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
    }

    .btn-icon:hover {
      background: var(--color-background);
      color: var(--color-primary);
    }

    .btn-icon.danger:hover {
      background: rgba(196, 91, 74, 0.1);
      color: var(--color-error);
    }

    .loading {
      display: flex;
      justify-content: center;
      padding: var(--spacing-4xl);
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(61, 43, 31, 0.1);
      border-top-color: var(--color-primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .spinner-small {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: var(--spacing-xl);
    }

    .modal {
      background: var(--color-white);
      border-radius: var(--radius-xl);
      width: 100%;
      max-width: 500px;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .modal.large {
      max-width: 700px;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-lg) var(--spacing-xl);
      border-bottom: 1px solid rgba(61, 43, 31, 0.1);
      flex-shrink: 0;
    }

    .modal-header h3 {
      margin: 0;
      color: var(--color-text);
    }

    .btn-close {
      background: transparent;
      border: none;
      cursor: pointer;
      color: var(--color-text-light);
      padding: var(--spacing-sm);
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
    }

    .btn-close:hover {
      background: var(--color-background);
      color: var(--color-text);
    }

    .modal-body {
      padding: var(--spacing-xl);
      overflow-y: auto;
      flex-grow: 1;
    }

    .form-section {
      background: var(--color-background);
      padding: var(--spacing-lg);
      border-radius: var(--radius-lg);
      margin-bottom: var(--spacing-lg);
    }

    .form-section h4 {
      margin: 0 0 var(--spacing-md);
      color: var(--color-text);
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-md);
    }

    .form-group {
      margin-bottom: var(--spacing-md);
    }

    .form-group label {
      display: block;
      margin-bottom: var(--spacing-xs);
      font-weight: 600;
      color: var(--color-text);
      font-size: 0.9rem;
    }

    .form-group input,
    .form-group textarea,
    .form-group select {
      width: 100%;
      padding: var(--spacing-sm) var(--spacing-md);
      border: 2px solid rgba(61, 43, 31, 0.15);
      border-radius: var(--radius-md);
      font-size: 0.95rem;
      transition: border-color var(--transition-fast);
    }

    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
      outline: none;
      border-color: var(--color-primary);
    }

    .form-group input:disabled {
      background: var(--color-background);
      cursor: not-allowed;
    }

    .checkbox-group {
      display: flex;
      align-items: center;
    }

    .checkbox-group label {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      cursor: pointer;
      margin-bottom: 0;
    }

    .checkbox-group input[type="checkbox"] {
      width: auto;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-md);
      margin-top: var(--spacing-xl);
      padding-top: var(--spacing-lg);
      border-top: 1px solid rgba(61, 43, 31, 0.1);
    }

    .btn {
      padding: var(--spacing-sm) var(--spacing-xl);
      border-radius: var(--radius-md);
      font-weight: 600;
      cursor: pointer;
      transition: all var(--transition-fast);
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .btn-primary {
      background: var(--color-primary);
      color: var(--color-white);
      border: none;
    }

    .btn-primary:hover:not(:disabled) {
      background: var(--color-primary-dark);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-outline {
      background: transparent;
      border: 2px solid var(--color-primary);
      color: var(--color-primary);
    }

    .btn-outline:hover {
      background: var(--color-primary);
      color: var(--color-white);
    }

    @media (max-width: 600px) {
      .section-header {
        flex-direction: column;
        gap: var(--spacing-md);
        align-items: flex-start;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .excursions-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminExcursionsComponent implements OnInit {
  lang = inject(LanguageService);
  excursionService = inject(ExcursionService);

  excursions = signal<Excursion[]>([]);
  isLoading = signal(false);
  showForm = signal(false);
  isEditing = signal(false);
  isSaving = signal(false);
  editingExcursionId = signal<string | null>(null);

  formData: ExcursionFormData = this.getEmptyFormData();
  highlightsFrText = '';
  highlightsEnText = '';

  ngOnInit(): void {
    this.loadExcursions();
  }

  async loadExcursions(): Promise<void> {
    this.isLoading.set(true);
    const data = await this.excursionService.loadAllExcursions();
    this.excursions.set(data);
    this.isLoading.set(false);
  }

  getEmptyFormData(): ExcursionFormData {
    return {
      slug: '',
      image_url: '',
      duration_en: '',
      duration_fr: '',
      title_en: '',
      title_fr: '',
      description_en: '',
      description_fr: '',
      highlights_en: [],
      highlights_fr: [],
      price: 0,
      price_note_en: 'per person',
      price_note_fr: 'par personne',
      is_active: true,
      display_order: 0
    };
  }

  openCreateForm(): void {
    this.formData = this.getEmptyFormData();
    this.highlightsFrText = '';
    this.highlightsEnText = '';
    this.isEditing.set(false);
    this.editingExcursionId.set(null);
    this.showForm.set(true);
  }

  openEditForm(excursion: Excursion): void {
    this.formData = {
      slug: excursion.slug,
      image_url: excursion.image_url,
      duration_en: excursion.duration_en,
      duration_fr: excursion.duration_fr,
      title_en: excursion.title_en,
      title_fr: excursion.title_fr,
      description_en: excursion.description_en,
      description_fr: excursion.description_fr,
      highlights_en: excursion.highlights_en,
      highlights_fr: excursion.highlights_fr,
      price: excursion.price,
      price_note_en: excursion.price_note_en,
      price_note_fr: excursion.price_note_fr,
      is_active: excursion.is_active,
      display_order: excursion.display_order
    };
    this.highlightsFrText = excursion.highlights_fr.join(', ');
    this.highlightsEnText = excursion.highlights_en.join(', ');
    this.isEditing.set(true);
    this.editingExcursionId.set(excursion.id);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.formData = this.getEmptyFormData();
  }

  async saveExcursion(): Promise<void> {
    this.isSaving.set(true);

    this.formData.highlights_fr = this.highlightsFrText.split(',').map(s => s.trim()).filter(s => s);
    this.formData.highlights_en = this.highlightsEnText.split(',').map(s => s.trim()).filter(s => s);

    let success = false;
    if (this.isEditing() && this.editingExcursionId()) {
      success = await this.excursionService.updateExcursion(this.editingExcursionId()!, this.formData);
    } else {
      const created = await this.excursionService.createExcursion(this.formData);
      success = !!created;
    }

    this.isSaving.set(false);

    if (success) {
      this.closeForm();
      await this.loadExcursions();
    }
  }

  async toggleStatus(excursion: Excursion): Promise<void> {
    const success = await this.excursionService.updateExcursion(excursion.id, { is_active: !excursion.is_active });
    if (success) {
      await this.loadExcursions();
    }
  }

  async deleteExcursion(excursion: Excursion): Promise<void> {
    if (confirm(this.lang.t('admin.confirmDeleteExcursion'))) {
      const success = await this.excursionService.deleteExcursion(excursion.id);
      if (success) {
        await this.loadExcursions();
      }
    }
  }
}
