import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { RentalService, Rental, RentalFormData } from '../../core/services/rental.service';
import { LanguageService } from '../../core/services/language.service';

type RentalType = 'vehicle' | 'incentive' | 'boat';
type FilterType = 'all' | RentalType;

@Component({
  selector: 'app-admin-rentals',
  standalone: true,
  imports: [FormsModule, DecimalPipe],
  template: `
    <div class="section-header">
      <h2>Gestion des Locations</h2>
      <button class="btn btn-primary" (click)="openCreateForm()">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Ajouter une location
      </button>
    </div>

    <div class="filters">
      <button class="filter-btn" [class.active]="activeFilter() === 'all'" (click)="setFilter('all')">
        Tous ({{ rentals().length }})
      </button>
      <button class="filter-btn" [class.active]="activeFilter() === 'vehicle'" (click)="setFilter('vehicle')">
        Vehicules ({{ getCountByType('vehicle') }})
      </button>
      <button class="filter-btn" [class.active]="activeFilter() === 'incentive'" (click)="setFilter('incentive')">
        Incentives ({{ getCountByType('incentive') }})
      </button>
      <button class="filter-btn" [class.active]="activeFilter() === 'boat'" (click)="setFilter('boat')">
        Bateaux ({{ getCountByType('boat') }})
      </button>
    </div>

    @if (isLoading()) {
      <div class="loading">
        <div class="spinner"></div>
      </div>
    } @else {
      <div class="rentals-grid">
        @for (rental of filteredRentals(); track rental.id) {
          <div class="rental-card" [class.inactive]="!rental.is_active">
            <div class="rental-image">
              @if (rental.image_url) {
                <img [src]="rental.image_url" [alt]="rental.name_fr" />
              } @else {
                <div class="no-image">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
              }
              <span class="type-badge" [class]="rental.type">{{ getTypeLabel(rental.type) }}</span>
              @if (!rental.is_active) {
                <span class="status-badge inactive">Inactif</span>
              }
            </div>
            <div class="rental-info">
              <div class="rental-category">{{ getCategoryLabel(rental.category) }}</div>
              <h3>{{ rental.name_fr }}</h3>
              <div class="rental-details">
                <span class="capacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  {{ rental.capacity }}
                </span>
                <span class="price">{{ rental.price_per_day | number }} FCFA</span>
              </div>
            </div>
            <div class="rental-actions">
              <button class="btn-icon" title="Modifier" (click)="openEditForm(rental)">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button class="btn-icon" title="Activer/Desactiver" (click)="toggleStatus(rental)">
                @if (rental.is_active) {
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
              <button class="btn-icon danger" title="Supprimer" (click)="deleteRental(rental)">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        } @empty {
          <div class="empty-state">
            <p>Aucune location trouvee</p>
          </div>
        }
      </div>
    }

    @if (showForm()) {
      <div class="modal-overlay" (click)="closeForm()">
        <div class="modal large" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ isEditing() ? 'Modifier la location' : 'Ajouter une location' }}</h3>
            <button class="btn-close" (click)="closeForm()">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <form (ngSubmit)="saveRental()">
              <div class="form-row">
                <div class="form-group">
                  <label>Type</label>
                  <select [(ngModel)]="formData.type" name="type" required (change)="onTypeChange()">
                    <option value="vehicle">Vehicule</option>
                    <option value="incentive">Incentive</option>
                    <option value="boat">Bateau</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Categorie</label>
                  <select [(ngModel)]="formData.category" name="category" required>
                    @for (cat of getCategoriesForType(formData.type); track cat.value) {
                      <option [value]="cat.value">{{ cat.label }}</option>
                    }
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Slug (URL)</label>
                  <input type="text" [(ngModel)]="formData.slug" name="slug" required [disabled]="isEditing()" />
                </div>
                <div class="form-group">
                  <label>Ordre d'affichage</label>
                  <input type="number" [(ngModel)]="formData.display_order" name="display_order" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Prix par jour (FCFA)</label>
                  <input type="number" [(ngModel)]="formData.price_per_day" name="price_per_day" required />
                </div>
                <div class="form-group">
                  <label>Capacite (personnes)</label>
                  <input type="number" [(ngModel)]="formData.capacity" name="capacity" required />
                </div>
              </div>

              <div class="form-group">
                <label>URL de l'image</label>
                <input type="url" [(ngModel)]="formData.image_url" name="image_url" />
              </div>

              <div class="form-section">
                <h4>Francais</h4>
                <div class="form-group">
                  <label>Nom</label>
                  <input type="text" [(ngModel)]="formData.name_fr" name="name_fr" required />
                </div>
                <div class="form-group">
                  <label>Description</label>
                  <textarea [(ngModel)]="formData.description_fr" name="description_fr" rows="3"></textarea>
                </div>
                <div class="form-group">
                  <label>Caracteristiques (separees par des virgules)</label>
                  <input type="text" [(ngModel)]="featuresFrText" name="features_fr" placeholder="Climatisation, GPS, Bluetooth" />
                </div>
                <div class="form-group">
                  <label>Note sur le prix</label>
                  <input type="text" [(ngModel)]="formData.price_note_fr" name="price_note_fr" placeholder="par jour, chauffeur inclus" />
                </div>
              </div>

              <div class="form-section">
                <h4>English</h4>
                <div class="form-group">
                  <label>Name</label>
                  <input type="text" [(ngModel)]="formData.name_en" name="name_en" required />
                </div>
                <div class="form-group">
                  <label>Description</label>
                  <textarea [(ngModel)]="formData.description_en" name="description_en" rows="3"></textarea>
                </div>
                <div class="form-group">
                  <label>Features (comma-separated)</label>
                  <input type="text" [(ngModel)]="featuresEnText" name="features_en" placeholder="Air conditioning, GPS, Bluetooth" />
                </div>
                <div class="form-group">
                  <label>Price note</label>
                  <input type="text" [(ngModel)]="formData.price_note_en" name="price_note_en" placeholder="per day, driver included" />
                </div>
              </div>

              <div class="form-group checkbox-group">
                <label>
                  <input type="checkbox" [(ngModel)]="formData.is_active" name="is_active" />
                  Actif
                </label>
              </div>

              <div class="form-actions">
                <button type="button" class="btn btn-outline" (click)="closeForm()">Annuler</button>
                <button type="submit" class="btn btn-primary" [disabled]="isSaving()">
                  @if (isSaving()) {
                    <span class="spinner-small"></span>
                  }
                  Enregistrer
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
      margin-bottom: var(--spacing-lg);
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

    .filters {
      display: flex;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-xl);
      flex-wrap: wrap;
    }

    .filter-btn {
      padding: var(--spacing-sm) var(--spacing-lg);
      border: 2px solid rgba(61, 43, 31, 0.15);
      background: var(--color-white);
      border-radius: var(--radius-full);
      cursor: pointer;
      font-weight: 500;
      color: var(--color-text-light);
      transition: all var(--transition-fast);
    }

    .filter-btn:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }

    .filter-btn.active {
      background: var(--color-primary);
      border-color: var(--color-primary);
      color: var(--color-white);
    }

    .rentals-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--spacing-lg);
    }

    .rental-card {
      background: var(--color-white);
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-md);
      transition: all var(--transition-fast);
    }

    .rental-card.inactive {
      opacity: 0.6;
    }

    .rental-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .rental-image {
      position: relative;
      height: 180px;
      background: var(--color-background);
    }

    .rental-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .no-image {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text-light);
    }

    .type-badge {
      position: absolute;
      top: var(--spacing-sm);
      left: var(--spacing-sm);
      padding: 4px 12px;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .type-badge.vehicle {
      background: rgba(59, 130, 246, 0.9);
      color: white;
    }

    .type-badge.incentive {
      background: rgba(16, 185, 129, 0.9);
      color: white;
    }

    .type-badge.boat {
      background: rgba(14, 165, 233, 0.9);
      color: white;
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

    .rental-info {
      padding: var(--spacing-lg);
    }

    .rental-category {
      font-size: 0.8rem;
      color: var(--color-text-light);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: var(--spacing-xs);
    }

    .rental-info h3 {
      margin: 0 0 var(--spacing-sm);
      font-size: 1.1rem;
      color: var(--color-text);
    }

    .rental-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .capacity {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.9rem;
      color: var(--color-text-light);
    }

    .price {
      font-weight: 700;
      color: var(--color-primary);
    }

    .rental-actions {
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

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: var(--spacing-4xl);
      color: var(--color-text-light);
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

      .rentals-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminRentalsComponent implements OnInit {
  lang = inject(LanguageService);
  rentalService = inject(RentalService);

  rentals = signal<Rental[]>([]);
  isLoading = signal(false);
  showForm = signal(false);
  isEditing = signal(false);
  isSaving = signal(false);
  editingRentalId = signal<string | null>(null);
  activeFilter = signal<FilterType>('all');

  formData: RentalFormData = this.getEmptyFormData();
  featuresFrText = '';
  featuresEnText = '';

  vehicleCategories = [
    { value: '4x4', label: '4x4' },
    { value: 'berline', label: 'Berline' },
    { value: 'minibus', label: 'Minibus' },
    { value: 'bus', label: 'Bus' }
  ];

  incentiveCategories = [
    { value: 'team-building', label: 'Team Building' },
    { value: 'seminaire', label: 'Seminaire' },
    { value: 'convention', label: 'Convention' },
    { value: 'incentive', label: 'Incentive' }
  ];

  boatCategories = [
    { value: 'pirogue', label: 'Pirogue' },
    { value: 'bateau-moteur', label: 'Bateau a moteur' },
    { value: 'voilier', label: 'Voilier' },
    { value: 'yacht', label: 'Yacht' }
  ];

  ngOnInit(): void {
    this.loadRentals();
  }

  async loadRentals(): Promise<void> {
    this.isLoading.set(true);
    const data = await this.rentalService.loadAllRentals();
    this.rentals.set(data);
    this.isLoading.set(false);
  }

  setFilter(filter: FilterType): void {
    this.activeFilter.set(filter);
  }

  filteredRentals(): Rental[] {
    const filter = this.activeFilter();
    if (filter === 'all') return this.rentals();
    return this.rentals().filter(r => r.type === filter);
  }

  getCountByType(type: RentalType): number {
    return this.rentals().filter(r => r.type === type).length;
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      vehicle: 'Vehicule',
      incentive: 'Incentive',
      boat: 'Bateau'
    };
    return labels[type] || type;
  }

  getCategoryLabel(category: string): string {
    const allCategories = [...this.vehicleCategories, ...this.incentiveCategories, ...this.boatCategories];
    const found = allCategories.find(c => c.value === category);
    return found?.label || category;
  }

  getCategoriesForType(type: string): { value: string; label: string }[] {
    switch (type) {
      case 'vehicle': return this.vehicleCategories;
      case 'incentive': return this.incentiveCategories;
      case 'boat': return this.boatCategories;
      default: return [];
    }
  }

  onTypeChange(): void {
    const categories = this.getCategoriesForType(this.formData.type);
    if (categories.length > 0) {
      this.formData.category = categories[0].value;
    }
  }

  getEmptyFormData(): RentalFormData {
    return {
      slug: '',
      type: 'vehicle',
      category: '4x4',
      name_fr: '',
      name_en: '',
      description_fr: '',
      description_en: '',
      features_fr: [],
      features_en: [],
      price_per_day: 0,
      price_note_fr: 'par jour',
      price_note_en: 'per day',
      capacity: 1,
      image_url: '',
      gallery_urls: [],
      is_active: true,
      display_order: 0
    };
  }

  openCreateForm(): void {
    this.formData = this.getEmptyFormData();
    this.featuresFrText = '';
    this.featuresEnText = '';
    this.isEditing.set(false);
    this.editingRentalId.set(null);
    this.showForm.set(true);
  }

  openEditForm(rental: Rental): void {
    this.formData = {
      slug: rental.slug,
      type: rental.type,
      category: rental.category,
      name_fr: rental.name_fr,
      name_en: rental.name_en,
      description_fr: rental.description_fr,
      description_en: rental.description_en,
      features_fr: rental.features_fr,
      features_en: rental.features_en,
      price_per_day: rental.price_per_day,
      price_note_fr: rental.price_note_fr,
      price_note_en: rental.price_note_en,
      capacity: rental.capacity,
      image_url: rental.image_url,
      gallery_urls: rental.gallery_urls,
      is_active: rental.is_active,
      display_order: rental.display_order
    };
    this.featuresFrText = rental.features_fr.join(', ');
    this.featuresEnText = rental.features_en.join(', ');
    this.isEditing.set(true);
    this.editingRentalId.set(rental.id);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.formData = this.getEmptyFormData();
  }

  async saveRental(): Promise<void> {
    this.isSaving.set(true);

    this.formData.features_fr = this.featuresFrText.split(',').map(s => s.trim()).filter(s => s);
    this.formData.features_en = this.featuresEnText.split(',').map(s => s.trim()).filter(s => s);

    let success = false;
    if (this.isEditing() && this.editingRentalId()) {
      success = await this.rentalService.updateRental(this.editingRentalId()!, this.formData);
    } else {
      success = await this.rentalService.createRental(this.formData);
    }

    this.isSaving.set(false);

    if (success) {
      this.closeForm();
      await this.loadRentals();
    }
  }

  async toggleStatus(rental: Rental): Promise<void> {
    const success = await this.rentalService.toggleRentalStatus(rental.id, rental.is_active);
    if (success) {
      await this.loadRentals();
    }
  }

  async deleteRental(rental: Rental): Promise<void> {
    if (confirm('Etes-vous sur de vouloir supprimer cette location ?')) {
      const success = await this.rentalService.deleteRental(rental.id);
      if (success) {
        await this.loadRentals();
      }
    }
  }
}
