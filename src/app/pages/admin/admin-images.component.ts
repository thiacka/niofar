import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageImageService, PageImage, PageName } from '../../core/services/page-image.service';
import { LanguageService } from '../../core/services/language.service';

interface ImageForm {
  page: PageName;
  section: string;
  image_url: string;
  alt_text_en: string;
  alt_text_fr: string;
  display_order: number;
  is_active: boolean;
}

@Component({
  selector: 'app-admin-images',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="images-manager">
      <div class="toolbar">
        <div class="filters">
          <select [(ngModel)]="selectedPage" (change)="filterImages()">
            <option value="">{{ lang.t('images.allPages') }}</option>
            <option value="home">{{ lang.t('images.pageHome') }}</option>
            <option value="services">{{ lang.t('images.pageServices') }}</option>
            <option value="experiences">{{ lang.t('images.pageExperiences') }}</option>
            <option value="why-nio-far">{{ lang.t('images.pageWhyNioFar') }}</option>
          </select>
        </div>
        <button class="btn btn-primary" (click)="openAddModal()">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          {{ lang.t('images.addImage') }}
        </button>
      </div>

      @if (isLoading()) {
        <div class="loading">
          <div class="spinner"></div>
        </div>
      } @else if (filteredImages().length === 0) {
        <div class="empty-state">
          <p>{{ lang.t('images.noImages') }}</p>
        </div>
      } @else {
        <div class="images-grid">
          @for (image of filteredImages(); track image.id) {
            <div class="image-card" [class.inactive]="!image.is_active">
              <div class="image-preview">
                <img [src]="image.image_url" [alt]="lang.language() === 'fr' ? image.alt_text_fr : image.alt_text_en" loading="lazy" />
                @if (!image.is_active) {
                  <div class="inactive-badge">{{ lang.t('images.inactive') }}</div>
                }
              </div>
              <div class="image-info">
                <div class="image-meta">
                  <span class="page-badge">{{ getPageLabel(image.page) }}</span>
                  <span class="section-badge">{{ image.section }}</span>
                </div>
                <div class="image-alt">
                  {{ lang.language() === 'fr' ? image.alt_text_fr : image.alt_text_en }}
                </div>
              </div>
              <div class="image-actions">
                <button class="btn-icon" [title]="lang.t('images.edit')" (click)="openEditModal(image)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button class="btn-icon" [title]="lang.t('images.toggleActive')" (click)="toggleActive(image)">
                  @if (image.is_active) {
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
                <button class="btn-icon danger" [title]="lang.t('images.delete')" (click)="deleteImage(image)">
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
    </div>

    @if (showModal()) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ isEditing() ? lang.t('images.editImage') : lang.t('images.addImage') }}</h3>
            <button class="btn-close" (click)="closeModal()">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <form (ngSubmit)="saveImage()">
              <div class="form-row">
                <div class="form-group">
                  <label>{{ lang.t('images.page') }}</label>
                  <select [(ngModel)]="formData.page" name="page" required>
                    <option value="home">{{ lang.t('images.pageHome') }}</option>
                    <option value="services">{{ lang.t('images.pageServices') }}</option>
                    <option value="experiences">{{ lang.t('images.pageExperiences') }}</option>
                    <option value="why-nio-far">{{ lang.t('images.pageWhyNioFar') }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>{{ lang.t('images.section') }}</label>
                  <select [(ngModel)]="formData.section" name="section" required>
                    @for (section of getSectionsForPage(formData.page); track section.value) {
                      <option [value]="section.value">{{ section.label }}</option>
                    }
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label>{{ lang.t('images.imageUrl') }}</label>
                <input
                  type="url"
                  [(ngModel)]="formData.image_url"
                  name="image_url"
                  [placeholder]="lang.t('images.imageUrlPlaceholder')"
                  required
                />
              </div>

              @if (formData.image_url) {
                <div class="preview-container">
                  <label>{{ lang.t('images.preview') }}</label>
                  <div class="image-preview-large">
                    <img [src]="formData.image_url" alt="Preview" />
                  </div>
                </div>
              }

              <div class="form-row">
                <div class="form-group">
                  <label>{{ lang.t('images.altTextEn') }}</label>
                  <input
                    type="text"
                    [(ngModel)]="formData.alt_text_en"
                    name="alt_text_en"
                    [placeholder]="lang.t('images.altTextPlaceholder')"
                  />
                </div>
                <div class="form-group">
                  <label>{{ lang.t('images.altTextFr') }}</label>
                  <input
                    type="text"
                    [(ngModel)]="formData.alt_text_fr"
                    name="alt_text_fr"
                    [placeholder]="lang.t('images.altTextPlaceholder')"
                  />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>{{ lang.t('images.displayOrder') }}</label>
                  <input
                    type="number"
                    [(ngModel)]="formData.display_order"
                    name="display_order"
                    min="0"
                  />
                </div>
                <div class="form-group checkbox-group">
                  <label class="checkbox-label">
                    <input
                      type="checkbox"
                      [(ngModel)]="formData.is_active"
                      name="is_active"
                    />
                    <span>{{ lang.t('images.isActive') }}</span>
                  </label>
                </div>
              </div>

              <div class="modal-actions">
                <button type="button" class="btn btn-outline" (click)="closeModal()">
                  {{ lang.t('admin.cancel') }}
                </button>
                <button type="submit" class="btn btn-primary" [disabled]="isSaving()">
                  {{ isSaving() ? lang.t('admin.saving') : lang.t('admin.save') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .images-manager {
      padding: var(--spacing-md) 0;
    }

    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-xl);
      gap: var(--spacing-md);
    }

    .filters select {
      padding: var(--spacing-sm) var(--spacing-md);
      border: 1px solid rgba(61, 43, 31, 0.2);
      border-radius: var(--radius-md);
      font-size: 0.9rem;
      min-width: 180px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-lg);
      border-radius: var(--radius-md);
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast);
      border: none;
    }

    .btn-primary {
      background: var(--color-primary);
      color: var(--color-white);
    }

    .btn-primary:hover {
      background: var(--color-primary-dark);
    }

    .btn-outline {
      background: transparent;
      border: 1px solid var(--color-primary);
      color: var(--color-primary);
    }

    .btn-outline:hover {
      background: var(--color-primary);
      color: var(--color-white);
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

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .empty-state {
      text-align: center;
      padding: var(--spacing-4xl);
      color: var(--color-text-light);
      background: var(--color-white);
      border-radius: var(--radius-xl);
    }

    .images-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--spacing-lg);
    }

    .image-card {
      background: var(--color-white);
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-md);
      transition: all var(--transition-fast);
    }

    .image-card:hover {
      box-shadow: var(--shadow-lg);
    }

    .image-card.inactive {
      opacity: 0.7;
    }

    .image-preview {
      position: relative;
      height: 180px;
      overflow: hidden;
    }

    .image-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .inactive-badge {
      position: absolute;
      top: var(--spacing-sm);
      right: var(--spacing-sm);
      background: rgba(0, 0, 0, 0.7);
      color: var(--color-white);
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: var(--radius-full);
    }

    .image-info {
      padding: var(--spacing-md);
    }

    .image-meta {
      display: flex;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-sm);
    }

    .page-badge,
    .section-badge {
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: var(--radius-full);
      text-transform: capitalize;
    }

    .page-badge {
      background: rgba(61, 43, 31, 0.1);
      color: var(--color-primary);
    }

    .section-badge {
      background: rgba(43, 138, 138, 0.1);
      color: var(--color-secondary);
    }

    .image-alt {
      font-size: 0.9rem;
      color: var(--color-text-light);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .image-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-sm);
      padding: var(--spacing-md);
      border-top: 1px solid rgba(61, 43, 31, 0.1);
    }

    .btn-icon {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: var(--color-background);
      border-radius: var(--radius-md);
      color: var(--color-text);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .btn-icon:hover {
      background: var(--color-primary);
      color: var(--color-white);
    }

    .btn-icon.danger:hover {
      background: var(--color-error);
    }

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: var(--spacing-lg);
    }

    .modal {
      background: var(--color-white);
      border-radius: var(--radius-xl);
      width: 100%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-lg) var(--spacing-xl);
      border-bottom: 1px solid rgba(61, 43, 31, 0.1);
    }

    .modal-header h3 {
      margin: 0;
      font-size: 1.25rem;
    }

    .btn-close {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--color-text-light);
      padding: var(--spacing-xs);
    }

    .btn-close:hover {
      color: var(--color-text);
    }

    .modal-body {
      padding: var(--spacing-xl);
    }

    .form-group {
      margin-bottom: var(--spacing-lg);
    }

    .form-group label {
      display: block;
      margin-bottom: var(--spacing-xs);
      font-weight: 500;
      color: var(--color-text);
    }

    .form-group input,
    .form-group select {
      width: 100%;
      padding: var(--spacing-sm) var(--spacing-md);
      border: 1px solid rgba(61, 43, 31, 0.2);
      border-radius: var(--radius-md);
      font-size: 1rem;
    }

    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: var(--color-primary);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-lg);
    }

    .checkbox-group {
      display: flex;
      align-items: center;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      cursor: pointer;
    }

    .checkbox-label input {
      width: auto;
    }

    .preview-container {
      margin-bottom: var(--spacing-lg);
    }

    .image-preview-large {
      border: 1px solid rgba(61, 43, 31, 0.1);
      border-radius: var(--radius-md);
      overflow: hidden;
      max-height: 200px;
    }

    .image-preview-large img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-md);
      margin-top: var(--spacing-xl);
      padding-top: var(--spacing-lg);
      border-top: 1px solid rgba(61, 43, 31, 0.1);
    }

    @media (max-width: 768px) {
      .toolbar {
        flex-direction: column;
        align-items: stretch;
      }

      .filters select {
        width: 100%;
      }

      .images-grid {
        grid-template-columns: 1fr;
      }

      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminImagesComponent implements OnInit {
  lang = inject(LanguageService);
  private imageService = inject(PageImageService);

  isLoading = signal(true);
  isSaving = signal(false);
  showModal = signal(false);
  isEditing = signal(false);
  images = signal<PageImage[]>([]);
  filteredImages = signal<PageImage[]>([]);
  selectedPage = '';
  editingImageId = '';

  formData: ImageForm = {
    page: 'home',
    section: 'hero',
    image_url: '',
    alt_text_en: '',
    alt_text_fr: '',
    display_order: 0,
    is_active: true
  };

  private pageSections: Record<PageName, { value: string; label: string }[]> = {
    'home': [
      { value: 'hero', label: 'Hero Slider' },
      { value: 'discover', label: 'Discover Section' }
    ],
    'services': [
      { value: 'hero', label: 'Hero' },
      { value: 'transport', label: 'Transport' },
      { value: 'accommodation', label: 'Accommodation' },
      { value: 'guide', label: 'Guide' },
      { value: 'activities', label: 'Activities' }
    ],
    'experiences': [
      { value: 'hero', label: 'Hero' },
      { value: 'culture', label: 'Culture' },
      { value: 'nature', label: 'Nature' },
      { value: 'gastronomy', label: 'Gastronomy' }
    ],
    'why-nio-far': [
      { value: 'hero', label: 'Hero' },
      { value: 'team', label: 'Team' },
      { value: 'values', label: 'Values' }
    ]
  };

  ngOnInit(): void {
    this.loadImages();
  }

  async loadImages(): Promise<void> {
    this.isLoading.set(true);
    const data = await this.imageService.getAllImages();
    this.images.set(data);
    this.filterImages();
    this.isLoading.set(false);
  }

  filterImages(): void {
    if (!this.selectedPage) {
      this.filteredImages.set(this.images());
    } else {
      this.filteredImages.set(
        this.images().filter(img => img.page === this.selectedPage)
      );
    }
  }

  getPageLabel(page: string): string {
    const labels: Record<string, string> = {
      'home': this.lang.t('images.pageHome'),
      'services': this.lang.t('images.pageServices'),
      'experiences': this.lang.t('images.pageExperiences'),
      'why-nio-far': this.lang.t('images.pageWhyNioFar')
    };
    return labels[page] || page;
  }

  getSectionsForPage(page: PageName): { value: string; label: string }[] {
    return this.pageSections[page] || [];
  }

  openAddModal(): void {
    this.isEditing.set(false);
    this.editingImageId = '';
    this.formData = {
      page: 'home',
      section: 'hero',
      image_url: '',
      alt_text_en: '',
      alt_text_fr: '',
      display_order: 0,
      is_active: true
    };
    this.showModal.set(true);
  }

  openEditModal(image: PageImage): void {
    this.isEditing.set(true);
    this.editingImageId = image.id;
    this.formData = {
      page: image.page,
      section: image.section,
      image_url: image.image_url,
      alt_text_en: image.alt_text_en,
      alt_text_fr: image.alt_text_fr,
      display_order: image.display_order,
      is_active: image.is_active
    };
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  async saveImage(): Promise<void> {
    if (!this.formData.image_url) return;

    this.isSaving.set(true);

    let success: boolean;
    if (this.isEditing()) {
      success = await this.imageService.updateImage(this.editingImageId, this.formData);
    } else {
      const result = await this.imageService.createImage(this.formData);
      success = result !== null;
    }

    if (success) {
      await this.loadImages();
      this.closeModal();
    }

    this.isSaving.set(false);
  }

  async toggleActive(image: PageImage): Promise<void> {
    await this.imageService.updateImage(image.id, { is_active: !image.is_active });
    await this.loadImages();
  }

  async deleteImage(image: PageImage): Promise<void> {
    if (confirm(this.lang.t('images.confirmDelete'))) {
      await this.imageService.deleteImage(image.id);
      await this.loadImages();
    }
  }
}
