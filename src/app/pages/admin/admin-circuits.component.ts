import { Component, inject, signal, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { CircuitService, Circuit, CircuitFormData } from '../../core/services/circuit.service';
import { CircuitStageService, CircuitStage, CircuitStageFormData } from '../../core/services/circuit-stage.service';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-admin-circuits',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  template: `
    <div class="section-header">
      <h2>{{ lang.t('admin.circuitsManagement') }}</h2>
      <button class="btn btn-primary" (click)="openCreateForm()">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        {{ lang.t('admin.addCircuit') }}
      </button>
    </div>

    @if (isLoading()) {
      <div class="loading">
        <div class="spinner"></div>
      </div>
    } @else {
      <div class="circuits-grid">
        @for (circuit of circuits(); track circuit.id) {
          <div class="circuit-card" [class.inactive]="!circuit.is_active">
            <div class="circuit-image">
              <img [src]="circuit.image_url" [alt]="circuit.title_fr" />
              @if (!circuit.is_active) {
                <span class="status-badge inactive">{{ lang.t('admin.inactive') }}</span>
              }
            </div>
            <div class="circuit-info">
              <h3>{{ circuit.title_fr }}</h3>
              <p class="circuit-duration">{{ circuit.duration_fr }}</p>
              <p class="circuit-price">{{ circuit.price | number }} FCFA</p>
            </div>
            <div class="circuit-actions">
              <button class="btn-icon" [title]="lang.t('admin.manageStages')" (click)="openStagesManager(circuit)">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="8" y1="6" x2="21" y2="6"/>
                  <line x1="8" y1="12" x2="21" y2="12"/>
                  <line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/>
                  <line x1="3" y1="12" x2="3.01" y2="12"/>
                  <line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
              </button>
              <button class="btn-icon" [title]="lang.t('admin.edit')" (click)="openEditForm(circuit)">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button class="btn-icon" [title]="lang.t('admin.toggleStatus')" (click)="toggleStatus(circuit)">
                @if (circuit.is_active) {
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
              <button class="btn-icon danger" [title]="lang.t('admin.delete')" (click)="deleteCircuit(circuit)">
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
            <h3>{{ isEditing() ? lang.t('admin.editCircuit') : lang.t('admin.addCircuit') }}</h3>
            <button class="btn-close" (click)="closeForm()">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <form (ngSubmit)="saveCircuit()">
              <div class="form-row">
                <div class="form-group">
                  <label>Slug (URL)</label>
                  <input type="text" [(ngModel)]="formData.slug" name="slug" required [disabled]="isEditing()" />
                </div>
                <div class="form-group">
                  <label>{{ lang.t('admin.durationDays') }}</label>
                  <input type="number" [(ngModel)]="formData.duration_days" name="duration_days" min="1" required />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>{{ lang.t('admin.price') }} (FCFA)</label>
                  <input type="number" [(ngModel)]="formData.price" name="price" required />
                </div>
                <div class="form-group">
                  <label>{{ lang.t('admin.minParticipants') }}</label>
                  <input type="number" [(ngModel)]="formData.min_participants" name="min_participants" min="1" required />
                </div>
                <div class="form-group">
                  <label>{{ lang.t('admin.maxParticipants') }}</label>
                  <input type="number" [(ngModel)]="formData.max_participants" name="max_participants" min="1" required />
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
                  <label>{{ lang.t('admin.includedServicesFr') }}</label>
                  <input type="text" [(ngModel)]="includedServicesFrText" name="included_services_fr" [placeholder]="lang.t('admin.highlightsPlaceholder')" />
                </div>
                <div class="form-group">
                  <label>{{ lang.t('admin.accommodationTypeFr') }}</label>
                  <input type="text" [(ngModel)]="formData.accommodation_type_fr" name="accommodation_type_fr" [placeholder]="lang.t('admin.accommodationTypePlaceholder')" />
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
                  <label>{{ lang.t('admin.includedServicesEn') }}</label>
                  <input type="text" [(ngModel)]="includedServicesEnText" name="included_services_en" [placeholder]="lang.t('admin.highlightsPlaceholder')" />
                </div>
                <div class="form-group">
                  <label>{{ lang.t('admin.accommodationTypeEn') }}</label>
                  <input type="text" [(ngModel)]="formData.accommodation_type_en" name="accommodation_type_en" [placeholder]="lang.t('admin.accommodationTypePlaceholder')" />
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

    @if (showStagesManager()) {
      <div class="modal-overlay" (click)="closeStagesManager()">
        <div class="modal xlarge" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ lang.t('admin.manageStages') }} - {{ currentCircuit()?.title_fr }}</h3>
            <button class="btn-close" (click)="closeStagesManager()">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="stages-header">
              <button class="btn btn-primary" (click)="openStageForm()">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                {{ lang.t('admin.addStage') }}
              </button>
            </div>

            @if (loadingStages()) {
              <div class="loading">
                <div class="spinner"></div>
              </div>
            } @else if (stages().length === 0) {
              <div class="empty-state">
                <p>{{ lang.t('admin.noStages') }}</p>
              </div>
            } @else {
              <div class="stages-list">
                @for (stage of stages(); track stage.id) {
                  <div class="stage-item">
                    <div class="stage-badge">
                      {{ lang.t('admin.day') }} {{ stage.day_number }} - {{ lang.t('admin.stage') }} {{ stage.stage_number }}
                    </div>
                    <div class="stage-info">
                      <h4>{{ stage.title_fr }}</h4>
                      <p class="stage-location">{{ stage.location_fr }}</p>
                      <p class="stage-times">
                        @if (stage.start_time) {
                          {{ formatTime(stage.start_time) }}
                          @if (stage.end_time) {
                            - {{ formatTime(stage.end_time) }}
                          }
                        }
                        @if (stage.duration_minutes > 0) {
                          <span class="duration-badge">{{ formatDuration(stage.duration_minutes) }}</span>
                        }
                      </p>
                      @if (stage.images && stage.images.length > 0) {
                        <div class="stage-images-preview">
                          @for (img of stage.images.slice(0, 3); track img) {
                            <img [src]="img" [alt]="stage.title_fr" />
                          }
                          @if (stage.images.length > 3) {
                            <span class="more-images">+{{ stage.images.length - 3 }}</span>
                          }
                        </div>
                      }
                    </div>
                    <div class="stage-actions">
                      <button class="btn-icon" (click)="editStage(stage)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button class="btn-icon danger" (click)="deleteStage(stage)">
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
        </div>
      </div>
    }

    @if (showStageForm()) {
      <div class="modal-overlay" (click)="closeStageForm()">
        <div class="modal large" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ editingStage() ? lang.t('admin.editStage') : lang.t('admin.addStage') }}</h3>
            <button class="btn-close" (click)="closeStageForm()">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <form (ngSubmit)="saveStage()">
              <div class="form-row">
                <div class="form-group">
                  <label>{{ lang.t('admin.dayNumber') }}</label>
                  <input type="number" [(ngModel)]="stageFormData.day_number" name="day_number" min="1" required />
                </div>
                <div class="form-group">
                  <label>{{ lang.t('admin.stageNumber') }}</label>
                  <input type="number" [(ngModel)]="stageFormData.stage_number" name="stage_number" min="1" required />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>{{ lang.t('admin.startTime') }}</label>
                  <input type="time" [(ngModel)]="stageFormData.start_time" name="start_time" />
                </div>
                <div class="form-group">
                  <label>{{ lang.t('admin.endTime') }}</label>
                  <input type="time" [(ngModel)]="stageFormData.end_time" name="end_time" />
                </div>
                <div class="form-group">
                  <label>{{ lang.t('admin.durationMinutes') }}</label>
                  <input type="number" [(ngModel)]="stageFormData.duration_minutes" name="duration_minutes" min="0" />
                </div>
              </div>

              <div class="form-section">
                <h4>Francais</h4>
                <div class="form-group">
                  <label>{{ lang.t('admin.titleFr') }}</label>
                  <input type="text" [(ngModel)]="stageFormData.title_fr" name="title_fr" required />
                </div>
                <div class="form-group">
                  <label>{{ lang.t('admin.locationFr') }}</label>
                  <input type="text" [(ngModel)]="stageFormData.location_fr" name="location_fr" />
                </div>
                <div class="form-group">
                  <label>{{ lang.t('admin.descriptionFr') }}</label>
                  <textarea [(ngModel)]="stageFormData.description_fr" name="description_fr" rows="4" required></textarea>
                </div>
              </div>

              <div class="form-section">
                <h4>English</h4>
                <div class="form-group">
                  <label>{{ lang.t('admin.titleEn') }}</label>
                  <input type="text" [(ngModel)]="stageFormData.title_en" name="title_en" required />
                </div>
                <div class="form-group">
                  <label>{{ lang.t('admin.locationEn') }}</label>
                  <input type="text" [(ngModel)]="stageFormData.location_en" name="location_en" />
                </div>
                <div class="form-group">
                  <label>{{ lang.t('admin.descriptionEn') }}</label>
                  <textarea [(ngModel)]="stageFormData.description_en" name="description_en" rows="4" required></textarea>
                </div>
              </div>

              <div class="form-group">
                <label>{{ lang.t('admin.imagesUrls') }}</label>
                <input type="text" [(ngModel)]="stageImagesText" name="images" [placeholder]="lang.t('admin.imagesPlaceholder')" />
                <small>{{ lang.t('admin.imagesHint') }}</small>
              </div>

              <div class="form-actions">
                <button type="button" class="btn btn-outline" (click)="closeStageForm()">{{ lang.t('admin.cancel') }}</button>
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

    .circuits-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--spacing-lg);
    }

    .circuit-card {
      background: var(--color-white);
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-md);
      transition: all var(--transition-fast);
    }

    .circuit-card.inactive {
      opacity: 0.6;
    }

    .circuit-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .circuit-image {
      position: relative;
      height: 180px;
    }

    .circuit-image img {
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

    .circuit-info {
      padding: var(--spacing-lg);
    }

    .circuit-info h3 {
      margin: 0 0 var(--spacing-sm);
      font-size: 1.1rem;
      color: var(--color-text);
    }

    .circuit-duration {
      font-size: 0.9rem;
      color: var(--color-text-light);
      margin-bottom: var(--spacing-xs);
    }

    .circuit-price {
      font-weight: 700;
      color: var(--color-primary);
      font-size: 1.1rem;
    }

    .circuit-actions {
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

    .modal.xlarge {
      max-width: 900px;
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

    .stages-header {
      margin-bottom: var(--spacing-xl);
    }

    .stages-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .stage-item {
      background: var(--color-background-alt);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
      display: flex;
      gap: var(--spacing-lg);
      align-items: start;
    }

    .stage-badge {
      background: var(--color-secondary);
      color: var(--color-white);
      padding: var(--spacing-xs) var(--spacing-md);
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 700;
      white-space: nowrap;
      text-transform: uppercase;
    }

    .stage-info {
      flex-grow: 1;
    }

    .stage-info h4 {
      margin: 0 0 var(--spacing-xs);
      color: var(--color-text);
    }

    .stage-location {
      font-size: 0.85rem;
      color: var(--color-text-light);
      margin: 0 0 var(--spacing-xs);
    }

    .stage-times {
      font-size: 0.85rem;
      color: var(--color-text-light);
      margin: 0 0 var(--spacing-sm);
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .duration-badge {
      background: var(--color-accent);
      color: var(--color-white);
      padding: 2px 8px;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
    }

    .stage-images-preview {
      display: flex;
      gap: var(--spacing-xs);
      margin-top: var(--spacing-sm);
      align-items: center;
    }

    .stage-images-preview img {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: var(--radius-md);
    }

    .more-images {
      font-size: 0.85rem;
      color: var(--color-text-light);
      font-weight: 600;
    }

    .stage-actions {
      display: flex;
      gap: var(--spacing-xs);
    }

    .empty-state {
      text-align: center;
      padding: var(--spacing-4xl);
      color: var(--color-text-light);
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

      .circuits-grid {
        grid-template-columns: 1fr;
      }

      .stage-item {
        flex-direction: column;
      }

      .stage-actions {
        width: 100%;
        justify-content: flex-end;
      }
    }
  `]
})
export class AdminCircuitsComponent implements OnInit {
  lang = inject(LanguageService);
  circuitService = inject(CircuitService);
  stageService = inject(CircuitStageService);

  circuits = signal<Circuit[]>([]);
  isLoading = signal(false);
  showForm = signal(false);
  isEditing = signal(false);
  isSaving = signal(false);
  editingCircuitId = signal<string | null>(null);

  formData: CircuitFormData = this.getEmptyFormData();
  highlightsFrText = '';
  highlightsEnText = '';
  includedServicesFrText = '';
  includedServicesEnText = '';

  showStagesManager = signal(false);
  showStageForm = signal(false);
  stages = signal<CircuitStage[]>([]);
  loadingStages = signal(false);
  currentCircuit = signal<Circuit | null>(null);
  editingStage = signal(false);
  editingStageId = signal<string | null>(null);
  stageFormData: CircuitStageFormData = this.getEmptyStageFormData();
  stageImagesText = '';

  ngOnInit(): void {
    this.loadCircuits();
  }

  async loadCircuits(): Promise<void> {
    this.isLoading.set(true);
    const data = await this.circuitService.loadAllCircuits();
    this.circuits.set(data);
    this.isLoading.set(false);
  }

  getEmptyFormData(): CircuitFormData {
    return {
      slug: '',
      image_url: '',
      duration_en: '',
      duration_fr: '',
      duration_days: 1,
      title_en: '',
      title_fr: '',
      description_en: '',
      description_fr: '',
      highlights_en: [],
      highlights_fr: [],
      itinerary: [],
      included_services_fr: [],
      included_services_en: [],
      accommodation_type_fr: null,
      accommodation_type_en: null,
      min_participants: 2,
      max_participants: 12,
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
    this.includedServicesFrText = '';
    this.includedServicesEnText = '';
    this.isEditing.set(false);
    this.editingCircuitId.set(null);
    this.showForm.set(true);
  }

  openEditForm(circuit: Circuit): void {
    this.formData = {
      slug: circuit.slug,
      image_url: circuit.image_url,
      duration_en: circuit.duration_en,
      duration_fr: circuit.duration_fr,
      duration_days: circuit.duration_days,
      title_en: circuit.title_en,
      title_fr: circuit.title_fr,
      description_en: circuit.description_en,
      description_fr: circuit.description_fr,
      highlights_en: circuit.highlights_en,
      highlights_fr: circuit.highlights_fr,
      itinerary: circuit.itinerary,
      included_services_fr: circuit.included_services_fr,
      included_services_en: circuit.included_services_en,
      accommodation_type_fr: circuit.accommodation_type_fr,
      accommodation_type_en: circuit.accommodation_type_en,
      min_participants: circuit.min_participants,
      max_participants: circuit.max_participants,
      price: circuit.price,
      price_note_en: circuit.price_note_en,
      price_note_fr: circuit.price_note_fr,
      is_active: circuit.is_active,
      display_order: circuit.display_order
    };
    this.highlightsFrText = circuit.highlights_fr.join(', ');
    this.highlightsEnText = circuit.highlights_en.join(', ');
    this.includedServicesFrText = circuit.included_services_fr.join(', ');
    this.includedServicesEnText = circuit.included_services_en.join(', ');
    this.isEditing.set(true);
    this.editingCircuitId.set(circuit.id);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.formData = this.getEmptyFormData();
  }

  async saveCircuit(): Promise<void> {
    this.isSaving.set(true);

    this.formData.highlights_fr = this.highlightsFrText.split(',').map(s => s.trim()).filter(s => s);
    this.formData.highlights_en = this.highlightsEnText.split(',').map(s => s.trim()).filter(s => s);
    this.formData.included_services_fr = this.includedServicesFrText.split(',').map(s => s.trim()).filter(s => s);
    this.formData.included_services_en = this.includedServicesEnText.split(',').map(s => s.trim()).filter(s => s);

    let success = false;
    if (this.isEditing() && this.editingCircuitId()) {
      success = await this.circuitService.updateCircuit(this.editingCircuitId()!, this.formData);
    } else {
      const created = await this.circuitService.createCircuit(this.formData);
      success = !!created;
    }

    this.isSaving.set(false);

    if (success) {
      this.closeForm();
      await this.loadCircuits();
    }
  }

  async toggleStatus(circuit: Circuit): Promise<void> {
    const success = await this.circuitService.updateCircuit(circuit.id, { is_active: !circuit.is_active });
    if (success) {
      await this.loadCircuits();
    }
  }

  async deleteCircuit(circuit: Circuit): Promise<void> {
    if (confirm(this.lang.t('admin.confirmDeleteCircuit'))) {
      const success = await this.circuitService.deleteCircuit(circuit.id);
      if (success) {
        await this.loadCircuits();
      }
    }
  }

  getEmptyStageFormData(): CircuitStageFormData {
    return {
      excursion_id: '',
      day_number: 1,
      stage_number: 1,
      title_fr: '',
      title_en: '',
      description_fr: '',
      description_en: '',
      images: [],
      duration_minutes: 0,
      start_time: null,
      end_time: null,
      location_fr: '',
      location_en: '',
      display_order: 0
    };
  }

  async openStagesManager(circuit: Circuit): Promise<void> {
    this.currentCircuit.set(circuit);
    this.showStagesManager.set(true);
    await this.loadStages(circuit.id);
  }

  closeStagesManager(): void {
    this.showStagesManager.set(false);
    this.currentCircuit.set(null);
    this.stages.set([]);
  }

  async loadStages(excursionId: string): Promise<void> {
    this.loadingStages.set(true);
    const data = await this.stageService.getStagesByExcursionId(excursionId);
    this.stages.set(data);
    this.loadingStages.set(false);
  }

  openStageForm(): void {
    const circuit = this.currentCircuit();
    if (!circuit) return;

    this.stageFormData = this.getEmptyStageFormData();
    this.stageFormData.excursion_id = circuit.id;
    this.stageImagesText = '';
    this.editingStage.set(false);
    this.editingStageId.set(null);
    this.showStageForm.set(true);
  }

  editStage(stage: CircuitStage): void {
    this.stageFormData = {
      excursion_id: stage.excursion_id,
      day_number: stage.day_number,
      stage_number: stage.stage_number,
      title_fr: stage.title_fr,
      title_en: stage.title_en,
      description_fr: stage.description_fr,
      description_en: stage.description_en,
      images: stage.images || [],
      duration_minutes: stage.duration_minutes || 0,
      start_time: stage.start_time,
      end_time: stage.end_time,
      location_fr: stage.location_fr || '',
      location_en: stage.location_en || '',
      display_order: stage.display_order
    };
    this.stageImagesText = (stage.images || []).join(', ');
    this.editingStage.set(true);
    this.editingStageId.set(stage.id);
    this.showStageForm.set(true);
  }

  closeStageForm(): void {
    this.showStageForm.set(false);
    this.stageFormData = this.getEmptyStageFormData();
  }

  async saveStage(): Promise<void> {
    this.isSaving.set(true);

    this.stageFormData.images = this.stageImagesText.split(',').map(s => s.trim()).filter(s => s);

    let success = false;
    if (this.editingStage() && this.editingStageId()) {
      success = await this.stageService.updateStage(this.editingStageId()!, this.stageFormData);
    } else {
      const created = await this.stageService.createStage(this.stageFormData);
      success = !!created;
    }

    this.isSaving.set(false);

    if (success) {
      this.closeStageForm();
      const circuit = this.currentCircuit();
      if (circuit) {
        await this.loadStages(circuit.id);
      }
    }
  }

  async deleteStage(stage: CircuitStage): Promise<void> {
    if (confirm(this.lang.t('admin.confirmDeleteStage'))) {
      const success = await this.stageService.deleteStage(stage.id);
      if (success) {
        const circuit = this.currentCircuit();
        if (circuit) {
          await this.loadStages(circuit.id);
        }
      }
    }
  }

  formatTime(time: string): string {
    if (!time) return '';
    return time.substring(0, 5);
  }

  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) {
      return `${hours}h`;
    }
    return `${hours}h${mins}`;
  }
}
