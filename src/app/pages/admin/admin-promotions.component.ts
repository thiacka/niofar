import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { CircuitService, Circuit, Promotion, PromotionFormData } from '../../core/services/circuit.service';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-admin-promotions',
  standalone: true,
  imports: [FormsModule, DatePipe, DecimalPipe],
  template: `
    <div class="section-header">
      <h2>{{ lang.t('admin.promotionsManagement') }}</h2>
      <button class="btn btn-primary" (click)="openCreateForm()">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        {{ lang.t('admin.addPromotion') }}
      </button>
    </div>

    @if (isLoading()) {
      <div class="loading">
        <div class="spinner"></div>
      </div>
    } @else {
      @if (promotions().length === 0) {
        <div class="empty-state">
          <p>{{ lang.t('admin.noPromotions') }}</p>
        </div>
      } @else {
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>{{ lang.t('admin.code') }}</th>
                <th>{{ lang.t('admin.promoName') }}</th>
                <th>{{ lang.t('admin.discount') }}</th>
                <th>{{ lang.t('admin.circuit') }}</th>
                <th>{{ lang.t('admin.validity') }}</th>
                <th>{{ lang.t('admin.usage') }}</th>
                <th>{{ lang.t('admin.status') }}</th>
                <th>{{ lang.t('admin.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              @for (promo of promotions(); track promo.id) {
                <tr [class.inactive]="!promo.is_active">
                  <td>
                    <span class="promo-code">{{ promo.code }}</span>
                  </td>
                  <td>{{ promo.name_fr }}</td>
                  <td>
                    @if (promo.discount_type === 'percentage') {
                      <span class="discount">-{{ promo.discount_value }}%</span>
                    } @else {
                      <span class="discount">-{{ promo.discount_value | number }} FCFA</span>
                    }
                  </td>
                  <td>
                    @if (promo.circuit_id) {
                      {{ getCircuitName(promo.circuit_id) }}
                    } @else {
                      <span class="all-circuits">{{ lang.t('admin.allCircuits') }}</span>
                    }
                  </td>
                  <td>
                    @if (promo.start_date || promo.end_date) {
                      <div class="validity">
                        @if (promo.start_date) {
                          <span>{{ promo.start_date | date:'dd/MM/yyyy' }}</span>
                        }
                        @if (promo.start_date && promo.end_date) {
                          <span> - </span>
                        }
                        @if (promo.end_date) {
                          <span>{{ promo.end_date | date:'dd/MM/yyyy' }}</span>
                        }
                      </div>
                    } @else {
                      <span class="no-limit">{{ lang.t('admin.noLimit') }}</span>
                    }
                  </td>
                  <td>
                    @if (promo.usage_limit) {
                      <span>{{ promo.usage_count }} / {{ promo.usage_limit }}</span>
                    } @else {
                      <span>{{ promo.usage_count }}</span>
                    }
                  </td>
                  <td>
                    <span class="status-badge" [class.active]="promo.is_active" [class.inactive]="!promo.is_active">
                      {{ promo.is_active ? lang.t('admin.active') : lang.t('admin.inactive') }}
                    </span>
                  </td>
                  <td>
                    <div class="actions">
                      <button class="btn-icon" [title]="lang.t('admin.edit')" (click)="openEditForm(promo)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button class="btn-icon" [title]="lang.t('admin.toggleStatus')" (click)="toggleStatus(promo)">
                        @if (promo.is_active) {
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
                      <button class="btn-icon danger" [title]="lang.t('admin.delete')" (click)="deletePromotion(promo)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    }

    @if (showForm()) {
      <div class="modal-overlay" (click)="closeForm()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ isEditing() ? lang.t('admin.editPromotion') : lang.t('admin.addPromotion') }}</h3>
            <button class="btn-close" (click)="closeForm()">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <form #promoForm="ngForm" (ngSubmit)="onSubmit(promoForm)">
              @if (errorMessage()) {
                <div class="error-message">
                  {{ errorMessage() }}
                </div>
              }

              <div class="form-row">
                <div class="form-group">
                  <label>{{ lang.t('admin.code') }} *</label>
                  <input type="text" [(ngModel)]="formData.code" name="code" required [disabled]="isEditing()" style="text-transform: uppercase;" #codeInput="ngModel" />
                  @if (codeInput.invalid && codeInput.touched) {
                    <span class="field-error">Le code est requis</span>
                  }
                </div>
                <div class="form-group">
                  <label>{{ lang.t('admin.circuit') }}</label>
                  <select [(ngModel)]="formData.circuit_id" name="circuit_id">
                    <option [ngValue]="null">{{ lang.t('admin.allCircuits') }}</option>
                    @for (circuit of circuits(); track circuit.id) {
                      <option [ngValue]="circuit.id">{{ circuit.title_fr }}</option>
                    }
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>{{ lang.t('admin.nameFr') }} *</label>
                  <input type="text" [(ngModel)]="formData.name_fr" name="name_fr" required #nameFrInput="ngModel" />
                  @if (nameFrInput.invalid && nameFrInput.touched) {
                    <span class="field-error">Le nom français est requis</span>
                  }
                </div>
                <div class="form-group">
                  <label>{{ lang.t('admin.nameEn') }} *</label>
                  <input type="text" [(ngModel)]="formData.name_en" name="name_en" required #nameEnInput="ngModel" />
                  @if (nameEnInput.invalid && nameEnInput.touched) {
                    <span class="field-error">Le nom anglais est requis</span>
                  }
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>{{ lang.t('admin.discountType') }} *</label>
                  <select [(ngModel)]="formData.discount_type" name="discount_type" required>
                    <option value="percentage">{{ lang.t('admin.percentage') }}</option>
                    <option value="fixed">{{ lang.t('admin.fixedAmount') }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>{{ lang.t('admin.discountValue') }} *</label>
                  <input type="number" [(ngModel)]="formData.discount_value" name="discount_value" required min="1" #discountInput="ngModel" />
                  @if (discountInput.invalid && discountInput.touched) {
                    <span class="field-error">La valeur doit être supérieure à 0</span>
                  }
                </div>
              </div>

              <div class="form-group">
                <label>{{ lang.t('admin.descriptionFr') }}</label>
                <textarea [(ngModel)]="formData.description_fr" name="description_fr" rows="2"></textarea>
              </div>

              <div class="form-group">
                <label>{{ lang.t('admin.descriptionEn') }}</label>
                <textarea [(ngModel)]="formData.description_en" name="description_en" rows="2"></textarea>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>{{ lang.t('admin.startDate') }}</label>
                  <input type="date" [(ngModel)]="formData.start_date" name="start_date" />
                </div>
                <div class="form-group">
                  <label>{{ lang.t('admin.endDate') }}</label>
                  <input type="date" [(ngModel)]="formData.end_date" name="end_date" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>{{ lang.t('admin.minTravelers') }}</label>
                  <input type="number" [(ngModel)]="formData.min_travelers" name="min_travelers" min="1" />
                </div>
                <div class="form-group">
                  <label>{{ lang.t('admin.usageLimit') }}</label>
                  <input type="number" [(ngModel)]="formData.usage_limit" name="usage_limit" [placeholder]="lang.t('admin.unlimited')" />
                </div>
              </div>

              <div class="form-group checkbox-group">
                <label>
                  <input type="checkbox" [(ngModel)]="formData.is_active" name="is_active" />
                  {{ lang.t('admin.active') }}
                </label>
              </div>

              <div class="form-actions">
                <button type="button" class="btn btn-outline" (click)="closeForm()">{{ lang.t('admin.cancel') }}</button>
                <button type="submit" class="btn btn-primary" [disabled]="isSaving() || promoForm.invalid">
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

    .table-container {
      background: var(--color-white);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-md);
      overflow: hidden;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table th,
    .data-table td {
      padding: var(--spacing-md);
      text-align: left;
      border-bottom: 1px solid rgba(61, 43, 31, 0.1);
    }

    .data-table th {
      background: var(--color-background);
      font-weight: 600;
      color: var(--color-text);
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .data-table tbody tr:hover {
      background: var(--color-background);
    }

    .data-table tbody tr.inactive {
      opacity: 0.6;
    }

    .promo-code {
      font-family: monospace;
      font-weight: 700;
      font-size: 0.95rem;
      color: var(--color-primary);
      background: var(--color-background);
      padding: 4px 10px;
      border-radius: var(--radius-sm);
    }

    .discount {
      font-weight: 700;
      color: var(--color-success);
    }

    .all-circuits {
      font-style: italic;
      color: var(--color-text-light);
    }

    .validity {
      font-size: 0.9rem;
      color: var(--color-text);
    }

    .no-limit {
      font-style: italic;
      color: var(--color-text-light);
    }

    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge.active {
      background: rgba(74, 155, 109, 0.15);
      color: var(--color-success);
    }

    .status-badge.inactive {
      background: rgba(196, 91, 74, 0.15);
      color: var(--color-error);
    }

    .actions {
      display: flex;
      gap: var(--spacing-sm);
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

    .loading, .empty-state {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: var(--spacing-4xl);
      color: var(--color-text-light);
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
      max-width: 600px;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
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

    .error-message {
      background: rgba(196, 91, 74, 0.1);
      border: 1px solid var(--color-error);
      border-radius: var(--radius-md);
      padding: var(--spacing-md);
      margin-bottom: var(--spacing-lg);
      color: var(--color-error);
      font-size: 0.9rem;
    }

    .field-error {
      display: block;
      color: var(--color-error);
      font-size: 0.8rem;
      margin-top: var(--spacing-xs);
    }

    .form-group input.ng-invalid.ng-touched,
    .form-group textarea.ng-invalid.ng-touched,
    .form-group select.ng-invalid.ng-touched {
      border-color: var(--color-error);
    }

    @media (max-width: 768px) {
      .section-header {
        flex-direction: column;
        gap: var(--spacing-md);
        align-items: flex-start;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .data-table {
        display: block;
        overflow-x: auto;
      }
    }
  `]
})
export class AdminPromotionsComponent implements OnInit {
  lang = inject(LanguageService);
  circuitService = inject(CircuitService);

  circuits = signal<Circuit[]>([]);
  promotions = signal<Promotion[]>([]);
  isLoading = signal(false);
  showForm = signal(false);
  isEditing = signal(false);
  isSaving = signal(false);
  editingPromotionId = signal<string | null>(null);
  errorMessage = signal<string>('');

  formData: PromotionFormData = this.getEmptyFormData();

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    this.isLoading.set(true);
    const [circuits, promotions] = await Promise.all([
      this.circuitService.loadAllCircuits(),
      this.circuitService.loadAllPromotions()
    ]);
    this.circuits.set(circuits);
    this.promotions.set(promotions);
    this.isLoading.set(false);
  }

  getEmptyFormData(): PromotionFormData {
    return {
      circuit_id: null,
      code: '',
      name_en: '',
      name_fr: '',
      description_en: '',
      description_fr: '',
      discount_type: 'percentage',
      discount_value: 10,
      min_travelers: 1,
      start_date: null,
      end_date: null,
      is_active: true,
      usage_limit: null
    };
  }

  getCircuitName(circuitId: string): string {
    const circuit = this.circuits().find(c => c.id === circuitId);
    return circuit?.title_fr || '';
  }

  openCreateForm(): void {
    this.formData = this.getEmptyFormData();
    this.isEditing.set(false);
    this.editingPromotionId.set(null);
    this.showForm.set(true);
  }

  openEditForm(promo: Promotion): void {
    this.formData = {
      circuit_id: promo.circuit_id,
      code: promo.code,
      name_en: promo.name_en,
      name_fr: promo.name_fr,
      description_en: promo.description_en,
      description_fr: promo.description_fr,
      discount_type: promo.discount_type,
      discount_value: promo.discount_value,
      min_travelers: promo.min_travelers,
      start_date: promo.start_date,
      end_date: promo.end_date,
      is_active: promo.is_active,
      usage_limit: promo.usage_limit
    };
    this.isEditing.set(true);
    this.editingPromotionId.set(promo.id);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.errorMessage.set('');
    this.formData = this.getEmptyFormData();
  }

  onSubmit(form: any): void {
    if (form.form.valid) {
      this.savePromotion();
    }
  }

  async savePromotion(): Promise<void> {
    this.isSaving.set(true);
    this.errorMessage.set('');

    try {
      let success = false;
      if (this.isEditing() && this.editingPromotionId()) {
        success = await this.circuitService.updatePromotion(this.editingPromotionId()!, this.formData);
      } else {
        const created = await this.circuitService.createPromotion(this.formData);
        success = !!created;
      }

      this.isSaving.set(false);

      if (success) {
        this.closeForm();
        await this.loadData();
      } else {
        this.errorMessage.set('Une erreur est survenue lors de la sauvegarde. Vérifiez que le code promotion est unique.');
      }
    } catch (error) {
      console.error('Error saving promotion:', error);
      this.errorMessage.set('Une erreur est survenue lors de la sauvegarde. Veuillez réessayer.');
      this.isSaving.set(false);
    }
  }

  async toggleStatus(promo: Promotion): Promise<void> {
    const success = await this.circuitService.updatePromotion(promo.id, { is_active: !promo.is_active });
    if (success) {
      await this.loadData();
    }
  }

  async deletePromotion(promo: Promotion): Promise<void> {
    if (confirm(this.lang.t('admin.confirmDeletePromotion'))) {
      const success = await this.circuitService.deletePromotion(promo.id);
      if (success) {
        await this.loadData();
      }
    }
  }
}
