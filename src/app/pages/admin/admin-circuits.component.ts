import { Component, inject, signal, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe, SlicePipe, UpperCasePipe } from '@angular/common';
import { CircuitService, Circuit, CircuitFormData, ItineraryDay, CircuitAttachment } from '../../core/services/circuit.service';
import { CircuitStageService, CircuitStage, CircuitStageFormData } from '../../core/services/circuit-stage.service';
import { LanguageService } from '../../core/services/language.service';
import { CloudinaryUploadComponent } from '../../shared/components/cloudinary-upload/cloudinary-upload.component';
import { CloudinaryService } from '../../core/services/cloudinary.service';

@Component({
  selector: 'app-admin-circuits',
  standalone: true,
  imports: [FormsModule, DecimalPipe, SlicePipe, UpperCasePipe, CloudinaryUploadComponent],
  template: `
    <!-- ── En-tête section ── -->
    <div class="section-header">
      <h2>{{ lang.t('admin.circuitsManagement') }}</h2>
      <button class="btn btn-primary" (click)="openCreateForm()">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        {{ lang.t('admin.addCircuit') }}
      </button>
    </div>

    <!-- ── Grille circuits ── -->
    @if (isLoading()) {
      <div class="loading"><div class="spinner"></div></div>
    } @else {
      <div class="circuits-grid">
        @for (circuit of circuits(); track circuit.id) {
          <div class="circuit-card" [class.inactive]="!circuit.is_active">
            <div class="circuit-image">
              <img [src]="circuit.image_url" [alt]="circuit.title_fr" loading="lazy" />
              @if (!circuit.is_active) {
                <span class="status-badge inactive">{{ lang.t('admin.inactive') }}</span>
              }
            </div>
            <div class="circuit-info">
              <h3>{{ circuit.title_fr }}</h3>
              <p class="circuit-duration">{{ circuit.duration_fr }}</p>
              <p class="circuit-price">{{ circuit.price | number }} FCFA</p>
              <p class="circuit-meta">
                <span class="meta-badge itinerary">{{ (circuit.itinerary || []).length }} jour(s)</span>
              </p>
            </div>
            <div class="circuit-actions">
              <button class="btn-icon" title="Gérer l'itinéraire" (click)="openItineraryManager(circuit)">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </button>
              <button class="btn-icon" [title]="lang.t('admin.manageStages')" (click)="openStagesManager(circuit)">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
                  <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
                  <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
              </button>
              <button class="btn-icon" [title]="lang.t('admin.manageAttachments')" (click)="openAttachmentsManager(circuit)">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
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
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
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

    <!-- ════════════════════════════════════════════════════
         WIZARD — Création / Edition de circuit
    ════════════════════════════════════════════════════ -->
    @if (showForm()) {
      <div class="modal-overlay" (click)="closeForm()">
        <div class="modal circuit-wizard" (click)="$event.stopPropagation()">

          <!-- En-tête -->
          <div class="modal-header">
            <div>
              <h3>{{ isEditing() ? lang.t('admin.editCircuit') : lang.t('admin.addCircuit') }}</h3>
              <p class="wizard-subtitle">{{ wizardSubtitles[currentStep() - 1] }}</p>
            </div>
            <button class="btn-close" (click)="closeForm()">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <!-- Indicateur d'étapes -->
          <div class="wizard-steps">
            <div class="wizard-step" [class.active]="currentStep() === 1" [class.done]="currentStep() > 1" (click)="goToStep(1)">
              <div class="step-circle">@if (currentStep() > 1) { ✓ } @else { 1 }</div>
              <span class="step-label">Général</span>
            </div>
            <div class="wizard-connector" [class.filled]="currentStep() > 1"></div>
            <div class="wizard-step" [class.active]="currentStep() === 2" [class.done]="currentStep() > 2" (click)="currentStep() >= 2 && goToStep(2)">
              <div class="step-circle">@if (currentStep() > 2) { ✓ } @else { 2 }</div>
              <span class="step-label">Descriptif</span>
            </div>
            <div class="wizard-connector" [class.filled]="currentStep() > 2"></div>
            <div class="wizard-step" [class.active]="currentStep() === 3" (click)="currentStep() >= 3 && goToStep(3)">
              <div class="step-circle">3</div>
              <span class="step-label">Itinéraire</span>
            </div>
          </div>

          <!-- Corps -->
          <div class="modal-body">
            <form (ngSubmit)="saveCircuit()">

              <!-- ── ÉTAPE 1 : Général ── -->
              @if (currentStep() === 1) {
                <div class="step-content">

                  <div class="form-row">
                    <div class="form-group">
                      <label>Identifiant URL (slug) *</label>
                      <input type="text" [(ngModel)]="formData.slug" name="slug" required [disabled]="isEditing()" placeholder="circuit-sine-saloum" />
                      <small class="field-hint">Utilisé dans l'URL : /circuits/<strong>circuit-sine-saloum</strong></small>
                    </div>
                    <div class="form-group">
                      <label>Ordre d'affichage</label>
                      <input type="number" [(ngModel)]="formData.display_order" name="display_order" min="0" />
                    </div>
                  </div>

                  <div class="form-group">
                    <label>Image principale *</label>
                    <app-cloudinary-upload
                      [value]="formData.image_url"
                      folder="nio-far/circuits"
                      placeholder="https://images.unsplash.com/..."
                      (urlChange)="formData.image_url = $event"
                    />
                  </div>

                  <div class="duration-group">
                    <div class="form-group duration-days">
                      <label>Durée (jours) *</label>
                      <input type="number" [(ngModel)]="formData.duration_days" name="duration_days" min="1" required (input)="autoFillDuration()" />
                    </div>
                    <button type="button" class="btn-auto" title="Générer les labels automatiquement" (click)="autoFillDuration()">
                      ↺ Auto
                    </button>
                    <div class="form-group">
                      <label>Label durée (FR) *</label>
                      <input type="text" [(ngModel)]="formData.duration_fr" name="duration_fr" required placeholder="7 jours / 6 nuits" />
                    </div>
                    <div class="form-group">
                      <label>Label durée (EN) *</label>
                      <input type="text" [(ngModel)]="formData.duration_en" name="duration_en" required placeholder="7 days / 6 nights" />
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label>Prix par personne (FCFA) *</label>
                      <input type="number" [(ngModel)]="formData.price" name="price" required min="0" />
                    </div>
                    <div class="form-group">
                      <label>Participants min *</label>
                      <input type="number" [(ngModel)]="formData.min_participants" name="min_participants" min="1" required />
                    </div>
                    <div class="form-group">
                      <label>Participants max *</label>
                      <input type="number" [(ngModel)]="formData.max_participants" name="max_participants" min="1" required />
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label>Note de prix (FR)</label>
                      <input type="text" [(ngModel)]="formData.price_note_fr" name="price_note_fr" placeholder="par personne, hors vols" />
                    </div>
                    <div class="form-group">
                      <label>Prix note (EN)</label>
                      <input type="text" [(ngModel)]="formData.price_note_en" name="price_note_en" placeholder="per person, excl. flights" />
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label>Hébergement (FR)</label>
                      <input type="text" [(ngModel)]="formData.accommodation_type_fr" name="accommodation_type_fr" placeholder="Lodges & hôtels ★★★" />
                    </div>
                    <div class="form-group">
                      <label>Accommodation (EN)</label>
                      <input type="text" [(ngModel)]="formData.accommodation_type_en" name="accommodation_type_en" placeholder="Lodges & hotels ★★★" />
                    </div>
                  </div>

                  <div class="form-group checkbox-group">
                    <label>
                      <input type="checkbox" [(ngModel)]="formData.is_active" name="is_active" />
                      Circuit actif (visible sur le site)
                    </label>
                  </div>

                </div>
              }

              <!-- ── ÉTAPE 2 : Descriptif bilingue ── -->
              @if (currentStep() === 2) {
                <div class="step-content">
                  <div class="bilingual-grid">

                    <!-- Français -->
                    <div class="lang-col">
                      <div class="lang-header fr">
                        <span class="lang-flag">🇫🇷</span><h4>Français</h4>
                      </div>

                      <div class="form-group">
                        <label>Titre *</label>
                        <input type="text" [(ngModel)]="formData.title_fr" name="title_fr" required placeholder="Circuit Sine Saloum & Casamance" />
                      </div>
                      <div class="form-group">
                        <label>Description *</label>
                        <textarea [(ngModel)]="formData.description_fr" name="description_fr" rows="5" required placeholder="Partez à la découverte des merveilles du Sénégal à travers ce circuit exceptionnel..."></textarea>
                      </div>

                      <div class="form-group">
                        <label>Points forts</label>
                        <div class="chip-input-row">
                          <input type="text" [(ngModel)]="newHighlightFr" name="nHlFr"
                            placeholder="ex: Croisière en pirogue sur le Sine Saloum"
                            (keydown.enter)="$event.preventDefault(); addHighlightFr()" />
                          <button type="button" class="btn-chip-add" (click)="addHighlightFr()">+</button>
                        </div>
                        <div class="chips">
                          @for (h of formData.highlights_fr; track $index; let i = $index) {
                            <span class="chip">{{ h }}<button type="button" (click)="removeHighlightFr(i)">×</button></span>
                          }
                          @if (formData.highlights_fr.length === 0) {
                            <span class="chip-empty">Aucun point fort ajouté</span>
                          }
                        </div>
                      </div>

                      <div class="form-group">
                        <label>Services inclus</label>
                        <div class="chip-input-row">
                          <input type="text" [(ngModel)]="newServiceFr" name="nSvcFr"
                            placeholder="ex: Hébergement en lodge"
                            (keydown.enter)="$event.preventDefault(); addServiceFr()" />
                          <button type="button" class="btn-chip-add" (click)="addServiceFr()">+</button>
                        </div>
                        <div class="chips">
                          @for (s of formData.included_services_fr; track $index; let i = $index) {
                            <span class="chip">{{ s }}<button type="button" (click)="removeServiceFr(i)">×</button></span>
                          }
                          @if (formData.included_services_fr.length === 0) {
                            <span class="chip-empty">Aucun service ajouté</span>
                          }
                        </div>
                      </div>
                    </div>

                    <!-- English -->
                    <div class="lang-col">
                      <div class="lang-header en">
                        <span class="lang-flag">🇬🇧</span><h4>English</h4>
                      </div>

                      <div class="form-group">
                        <label>Title *</label>
                        <input type="text" [(ngModel)]="formData.title_en" name="title_en" required placeholder="Sine Saloum & Casamance Circuit" />
                      </div>
                      <div class="form-group">
                        <label>Description *</label>
                        <textarea [(ngModel)]="formData.description_en" name="description_en" rows="5" required placeholder="Discover the wonders of Senegal through this exceptional tour..."></textarea>
                      </div>

                      <div class="form-group">
                        <label>Highlights</label>
                        <div class="chip-input-row">
                          <input type="text" [(ngModel)]="newHighlightEn" name="nHlEn"
                            placeholder="ex: Pirogue cruise on Sine Saloum"
                            (keydown.enter)="$event.preventDefault(); addHighlightEn()" />
                          <button type="button" class="btn-chip-add" (click)="addHighlightEn()">+</button>
                        </div>
                        <div class="chips">
                          @for (h of formData.highlights_en; track $index; let i = $index) {
                            <span class="chip">{{ h }}<button type="button" (click)="removeHighlightEn(i)">×</button></span>
                          }
                          @if (formData.highlights_en.length === 0) {
                            <span class="chip-empty">No highlight added</span>
                          }
                        </div>
                      </div>

                      <div class="form-group">
                        <label>Included services</label>
                        <div class="chip-input-row">
                          <input type="text" [(ngModel)]="newServiceEn" name="nSvcEn"
                            placeholder="ex: Lodge accommodation"
                            (keydown.enter)="$event.preventDefault(); addServiceEn()" />
                          <button type="button" class="btn-chip-add" (click)="addServiceEn()">+</button>
                        </div>
                        <div class="chips">
                          @for (s of formData.included_services_en; track $index; let i = $index) {
                            <span class="chip">{{ s }}<button type="button" (click)="removeServiceEn(i)">×</button></span>
                          }
                          @if (formData.included_services_en.length === 0) {
                            <span class="chip-empty">No service added</span>
                          }
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              }

              <!-- ── ÉTAPE 3 : Itinéraire inline ── -->
              @if (currentStep() === 3) {
                <div class="step-content">

                  <div class="itinerary-header">
                    <div>
                      <h4>Programme jour par jour</h4>
                      <p class="help-text">Définissez le déroulé complet du circuit. Chaque jour apparaîtra sur la page détail.</p>
                    </div>
                    @if (!inlineDayFormVisible()) {
                      <button type="button" class="btn btn-primary" (click)="openInlineDayForm()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Ajouter un jour
                      </button>
                    }
                  </div>

                  <!-- Timeline des jours -->
                  @if (formData.itinerary.length > 0) {
                    <div class="itinerary-timeline">
                      @for (day of formData.itinerary; track day.day; let i = $index) {
                        <div class="timeline-day" [class.is-editing]="editingInlineDayIndex() === i">
                          <div class="timeline-left">
                            <div class="day-circle">{{ day.day }}</div>
                            @if (i < formData.itinerary.length - 1) {
                              <div class="timeline-line"></div>
                            }
                          </div>
                          <div class="day-card">
                            <div class="day-card-top">
                              <div class="day-card-titles">
                                <strong class="day-title-fr">{{ day.title_fr }}</strong>
                                @if (day.title_en) {
                                  <span class="day-title-en">{{ day.title_en }}</span>
                                }
                              </div>
                              <div class="day-card-actions">
                                <button type="button" class="btn-icon" title="Modifier" (click)="editInlineDay(i)">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                  </svg>
                                </button>
                                <button type="button" class="btn-icon danger" title="Supprimer" (click)="deleteInlineDay(i)">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                  </svg>
                                </button>
                              </div>
                            </div>
                            @if (day.location_fr) {
                              <p class="day-meta">📍 {{ day.location_fr }}</p>
                            }
                            <p class="day-desc">{{ day.description_fr | slice:0:150 }}{{ day.description_fr.length > 150 ? '…' : '' }}</p>
                            <div class="day-badges">
                              @if (day.accommodation_fr) {
                                <span class="day-badge hotel">🏨 {{ day.accommodation_fr }}</span>
                              }
                              @if (day.meals_fr) {
                                <span class="day-badge meal">🍽 {{ day.meals_fr }}</span>
                              }
                              @if (day.excursion_image) {
                                <span class="day-badge img">📷 Photo</span>
                              }
                            </div>
                          </div>
                        </div>
                      }
                    </div>
                  } @else if (!inlineDayFormVisible()) {
                    <div class="itinerary-empty">
                      <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.25">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                      <p>Aucun jour ajouté</p>
                      <small>Cliquez "Ajouter un jour" pour construire votre itinéraire</small>
                    </div>
                  }

                  <!-- Formulaire inline d'ajout / édition de jour -->
                  @if (inlineDayFormVisible()) {
                    <div class="inline-day-form">
                      <div class="inline-form-header">
                        <div class="inline-form-title">
                          <div class="inline-day-num">Jour {{ inlineDay.day }}</div>
                          <h5>{{ editingInlineDayIndex() !== null ? 'Modifier ce jour' : 'Nouveau jour' }}</h5>
                        </div>
                        <button type="button" class="btn-close-sm" (click)="cancelInlineDay()">✕</button>
                      </div>

                      <div class="form-row">
                        <div class="form-group">
                          <label>N° du jour</label>
                          <input type="number" [(ngModel)]="inlineDay.day" name="il_day" min="1" />
                        </div>
                        <div class="form-group">
                          <label>Image du jour</label>
                          <app-cloudinary-upload
                            [value]="inlineDay.excursion_image || ''"
                            folder="nio-far/circuits/itinerary"
                            [showPreview]="false"
                            (urlChange)="inlineDay.excursion_image = $event"
                          />
                        </div>
                      </div>

                      <div class="bilingual-grid">
                        <!-- FR -->
                        <div>
                          <div class="mini-lang fr">🇫🇷 Français</div>
                          <div class="form-group">
                            <label>Titre *</label>
                            <input type="text" [(ngModel)]="inlineDay.title_fr" name="il_title_fr" required placeholder="Dakar → Saint-Louis" />
                          </div>
                          <div class="form-group">
                            <label>Description *</label>
                            <textarea [(ngModel)]="inlineDay.description_fr" name="il_desc_fr" rows="4" required
                              placeholder="Départ matinal de Dakar en direction du nord, arrivée à Saint-Louis en début d'après-midi..."></textarea>
                          </div>
                          <div class="form-row">
                            <div class="form-group">
                              <label>Localisation</label>
                              <input type="text" [(ngModel)]="inlineDay.location_fr" name="il_loc_fr" placeholder="Dakar → Saint-Louis" />
                            </div>
                            <div class="form-group">
                              <label>Hébergement</label>
                              <input type="text" [(ngModel)]="inlineDay.accommodation_fr" name="il_acc_fr" placeholder="Hôtel Résidence ★★★" />
                            </div>
                          </div>
                          <div class="form-group">
                            <label>Repas inclus</label>
                            <input type="text" [(ngModel)]="inlineDay.meals_fr" name="il_meals_fr" placeholder="Petit-déjeuner, Dîner" />
                          </div>
                        </div>
                        <!-- EN -->
                        <div>
                          <div class="mini-lang en">🇬🇧 English</div>
                          <div class="form-group">
                            <label>Title *</label>
                            <input type="text" [(ngModel)]="inlineDay.title_en" name="il_title_en" required placeholder="Dakar → Saint-Louis" />
                          </div>
                          <div class="form-group">
                            <label>Description *</label>
                            <textarea [(ngModel)]="inlineDay.description_en" name="il_desc_en" rows="4" required
                              placeholder="Early morning departure from Dakar heading north, arriving in Saint-Louis..."></textarea>
                          </div>
                          <div class="form-row">
                            <div class="form-group">
                              <label>Location</label>
                              <input type="text" [(ngModel)]="inlineDay.location_en" name="il_loc_en" placeholder="Dakar → Saint-Louis" />
                            </div>
                            <div class="form-group">
                              <label>Accommodation</label>
                              <input type="text" [(ngModel)]="inlineDay.accommodation_en" name="il_acc_en" placeholder="Hotel Residence ★★★" />
                            </div>
                          </div>
                          <div class="form-group">
                            <label>Included meals</label>
                            <input type="text" [(ngModel)]="inlineDay.meals_en" name="il_meals_en" placeholder="Breakfast, Dinner" />
                          </div>
                        </div>
                      </div>

                      <div class="inline-day-actions">
                        <button type="button" class="btn btn-outline" (click)="cancelInlineDay()">Annuler</button>
                        <button type="button" class="btn btn-primary" (click)="saveInlineDay()">
                          {{ editingInlineDayIndex() !== null ? '✓ Modifier ce jour' : '+ Ajouter ce jour' }}
                        </button>
                      </div>
                    </div>
                  }

                </div>
              }

              <!-- ── Navigation wizard ── -->
              <div class="wizard-nav">
                <button type="button" class="btn btn-outline" (click)="closeForm()">Annuler</button>
                <div class="wizard-nav-right">
                  @if (currentStep() > 1) {
                    <button type="button" class="btn btn-ghost" (click)="prevStep()">← Précédent</button>
                  }
                  @if (currentStep() < 3) {
                    <button type="button" class="btn btn-primary" (click)="nextStep()">Suivant →</button>
                  }
                  @if (currentStep() === 3) {
                    <button type="submit" class="btn btn-success" [disabled]="isSaving() || inlineDayFormVisible()">
                      @if (isSaving()) { <span class="spinner-small"></span> }
                      {{ isEditing() ? 'Enregistrer les modifications' : 'Créer le circuit' }}
                    </button>
                  }
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>
    }

    <!-- ════════════════════════════════════════════════════
         Gestionnaire de Stages (circuit_stages table)
    ════════════════════════════════════════════════════ -->
    @if (showStagesManager()) {
      <div class="modal-overlay" (click)="closeStagesManager()">
        <div class="modal xlarge" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ lang.t('admin.manageStages') }} — {{ currentCircuit()?.title_fr }}</h3>
            <button class="btn-close" (click)="closeStagesManager()">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="stages-header">
              <button class="btn btn-primary" (click)="openStageForm()">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                {{ lang.t('admin.addStage') }}
              </button>
            </div>
            @if (loadingStages()) {
              <div class="loading"><div class="spinner"></div></div>
            } @else if (stages().length === 0) {
              <div class="empty-state"><p>{{ lang.t('admin.noStages') }}</p></div>
            } @else {
              <div class="stages-list">
                @for (stage of stages(); track stage.id) {
                  <div class="stage-item">
                    <div class="stage-badge">{{ lang.t('admin.day') }} {{ stage.day_number }} — {{ lang.t('admin.stage') }} {{ stage.stage_number }}</div>
                    <div class="stage-info">
                      <h4>{{ stage.title_fr }}</h4>
                      <p class="stage-location">{{ stage.location_fr }}</p>
                      <p class="stage-times">
                        @if (stage.start_time) { {{ formatTime(stage.start_time) }} }
                        @if (stage.start_time && stage.end_time) { — {{ formatTime(stage.end_time) }} }
                        @if (stage.duration_minutes > 0) {
                          <span class="duration-badge">{{ formatDuration(stage.duration_minutes) }}</span>
                        }
                      </p>
                      @if (stage.images && stage.images.length > 0) {
                        <div class="stage-images-preview">
                          @for (img of stage.images.slice(0, 3); track img) {
                            <img [src]="img" [alt]="stage.title_fr" loading="lazy" />
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

    <!-- ════════════════════════════════════════════════════
         Formulaire Stage
    ════════════════════════════════════════════════════ -->
    @if (showStageForm()) {
      <div class="modal-overlay" (click)="closeStageForm()">
        <div class="modal large" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ editingStage() ? lang.t('admin.editStage') : lang.t('admin.addStage') }}</h3>
            <button class="btn-close" (click)="closeStageForm()">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
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
                <h4>Français</h4>
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
                <app-cloudinary-upload
                  [value]="stageImagesText"
                  folder="nio-far/circuits/stages"
                  [showPreview]="false"
                  [placeholder]="lang.t('admin.imagesPlaceholder')"
                  (urlChange)="stageImagesText = $event"
                />
                <small>{{ lang.t('admin.imagesHint') }}</small>
              </div>
              <div class="form-actions">
                <button type="button" class="btn btn-outline" (click)="closeStageForm()">{{ lang.t('admin.cancel') }}</button>
                <button type="submit" class="btn btn-primary" [disabled]="isSaving()">
                  @if (isSaving()) { <span class="spinner-small"></span> }
                  {{ lang.t('admin.save') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    }

    <!-- ════════════════════════════════════════════════════
         Gestionnaire d'itinéraire (depuis les cartes)
    ════════════════════════════════════════════════════ -->
    @if (showItineraryManager()) {
      <div class="modal-overlay" (click)="closeItineraryManager()">
        <div class="modal xlarge" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Itinéraire — {{ currentCircuit()?.title_fr }}</h3>
            <button class="btn-close" (click)="closeItineraryManager()">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="stages-header">
              <p class="help-text">Programme jour par jour affiché sur la page détail du circuit.</p>
              <button class="btn btn-primary" (click)="openDayForm()">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Ajouter un jour
              </button>
            </div>
            @if (itineraryDays().length === 0) {
              <div class="empty-state"><p>Aucun jour défini.</p></div>
            } @else {
              <div class="stages-list">
                @for (day of itineraryDays(); track day.day; let i = $index) {
                  <div class="stage-item">
                    <div class="stage-badge">Jour {{ day.day }}</div>
                    <div class="stage-info">
                      <h4>{{ day.title_fr }}</h4>
                      @if (day.location_fr) { <p class="stage-location">📍 {{ day.location_fr }}</p> }
                      <p class="stage-location">{{ day.description_fr | slice:0:100 }}{{ day.description_fr.length > 100 ? '…' : '' }}</p>
                      @if (day.accommodation_fr) { <p class="stage-location">🏨 {{ day.accommodation_fr }}</p> }
                      @if (day.meals_fr) { <p class="stage-location">🍽 {{ day.meals_fr }}</p> }
                      @if (day.excursion_image) {
                        <div class="stage-images-preview">
                          <img [src]="day.excursion_image" [alt]="day.title_fr" loading="lazy" />
                        </div>
                      }
                    </div>
                    <div class="stage-actions">
                      <button class="btn-icon" title="Modifier" (click)="openDayForm(i)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button class="btn-icon danger" title="Supprimer" (click)="deleteDayFromItinerary(i)">
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

    <!-- ════════════════════════════════════════════════════
         Formulaire d'un jour (gestionnaire itinéraire depuis carte)
    ════════════════════════════════════════════════════ -->
    @if (showDayForm()) {
      <div class="modal-overlay" (click)="closeDayForm()">
        <div class="modal large" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ editingDayIndex() !== null ? 'Modifier le jour' : 'Ajouter un jour' }}</h3>
            <button class="btn-close" (click)="closeDayForm()">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <form (ngSubmit)="saveDayToItinerary()">
              <div class="form-row">
                <div class="form-group">
                  <label>N° du jour</label>
                  <input type="number" [(ngModel)]="dayFormData.day" name="day" min="1" required />
                </div>
                <div class="form-group">
                  <label>Image du jour</label>
                  <app-cloudinary-upload
                    [value]="dayFormData.excursion_image || ''"
                    folder="nio-far/circuits/itinerary"
                    [showPreview]="false"
                    (urlChange)="dayFormData.excursion_image = $event"
                  />
                </div>
              </div>
              <div class="form-section">
                <h4>Français</h4>
                <div class="form-group">
                  <label>Titre *</label>
                  <input type="text" [(ngModel)]="dayFormData.title_fr" name="title_fr" required />
                </div>
                <div class="form-group">
                  <label>Description *</label>
                  <textarea [(ngModel)]="dayFormData.description_fr" name="description_fr" rows="4" required></textarea>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Localisation</label>
                    <input type="text" [(ngModel)]="dayFormData.location_fr" name="location_fr" placeholder="Dakar → Saly" />
                  </div>
                  <div class="form-group">
                    <label>Hébergement</label>
                    <input type="text" [(ngModel)]="dayFormData.accommodation_fr" name="accommodation_fr" placeholder="Lodge Terrou-Bi ★★★" />
                  </div>
                </div>
                <div class="form-group">
                  <label>Repas</label>
                  <input type="text" [(ngModel)]="dayFormData.meals_fr" name="meals_fr" placeholder="Petit-déjeuner, Dîner" />
                </div>
              </div>
              <div class="form-section">
                <h4>English</h4>
                <div class="form-group">
                  <label>Title *</label>
                  <input type="text" [(ngModel)]="dayFormData.title_en" name="title_en" required />
                </div>
                <div class="form-group">
                  <label>Description *</label>
                  <textarea [(ngModel)]="dayFormData.description_en" name="description_en" rows="4" required></textarea>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Location</label>
                    <input type="text" [(ngModel)]="dayFormData.location_en" name="location_en" placeholder="Dakar → Saly" />
                  </div>
                  <div class="form-group">
                    <label>Accommodation</label>
                    <input type="text" [(ngModel)]="dayFormData.accommodation_en" name="accommodation_en" />
                  </div>
                </div>
                <div class="form-group">
                  <label>Meals</label>
                  <input type="text" [(ngModel)]="dayFormData.meals_en" name="meals_en" placeholder="Breakfast, Dinner" />
                </div>
              </div>
              <div class="form-actions">
                <button type="button" class="btn btn-outline" (click)="closeDayForm()">{{ lang.t('admin.cancel') }}</button>
                <button type="submit" class="btn btn-primary" [disabled]="isSaving()">
                  @if (isSaving()) { <span class="spinner-small"></span> }
                  {{ lang.t('admin.save') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    }

    <!-- ════════════════════════════════════════════════════
         Gestionnaire de pieces jointes
    ════════════════════════════════════════════════════ -->
    @if (showAttachmentsManager()) {
      <div class="modal-overlay" (click)="closeAttachmentsManager()">
        <div class="modal large" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ lang.t('admin.attachments') }} — {{ currentCircuit()?.title_fr }}</h3>
            <button class="btn-close" (click)="closeAttachmentsManager()">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="attachments-header">
              <p class="help-text">{{ lang.t('admin.attachmentLimit') }}</p>
              @if (attachments().length < 3) {
                <button type="button" class="btn btn-primary upload-btn" [disabled]="isUploading()" (click)="uploadAttachmentViaCloudinary()">
                  @if (isUploading()) {
                    <span class="spinner-small"></span>
                    {{ lang.t('admin.uploading') }}
                  } @else {
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    {{ lang.t('admin.addAttachment') }}
                  }
                </button>
              } @else {
                <span class="max-badge">{{ lang.t('admin.maxAttachmentsReached') }}</span>
              }
            </div>

            @if (loadingAttachments()) {
              <div class="loading"><div class="spinner"></div></div>
            } @else if (attachments().length === 0) {
              <div class="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.25">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                </svg>
                <p>{{ lang.t('admin.noAttachments') }}</p>
              </div>
            } @else {
              <div class="attachments-list">
                @for (att of attachments(); track att.id) {
                  <div class="attachment-item">
                    <div class="attachment-icon">
                      @if (att.file_type.startsWith('image/')) {
                        <img [src]="att.file_url" [alt]="att.file_name" class="attachment-thumb" loading="lazy" />
                      } @else {
                        <div class="pdf-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/>
                            <line x1="16" y1="17" x2="8" y2="17"/>
                            <polyline points="10 9 9 9 8 9"/>
                          </svg>
                        </div>
                      }
                    </div>
                    <div class="attachment-info">
                      <span class="attachment-name">{{ att.file_name }}</span>
                      <span class="attachment-meta">{{ formatFileSize(att.file_size) }} — {{ att.file_type.split('/')[1] | uppercase }}</span>
                    </div>
                    <div class="attachment-actions">
                      <a [href]="att.file_url" target="_blank" class="btn-icon" title="Ouvrir">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                          <polyline points="15 3 21 3 21 9"/>
                          <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                      </a>
                      <button class="btn-icon danger" (click)="deleteAttachment(att)">
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
  `,
  styles: [`
    /* ── Layout principal ── */
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-xl);
    }
    .section-header h2 { margin: 0; color: var(--color-text); }
    .section-header .btn { display: flex; align-items: center; gap: var(--spacing-sm); }

    .circuits-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--spacing-lg);
    }

    /* ── Cards ── */
    .circuit-card {
      background: var(--color-white);
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-md);
      transition: all var(--transition-fast);
    }
    .circuit-card.inactive { opacity: 0.6; }
    .circuit-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
    .circuit-image { position: relative; height: 180px; }
    .circuit-image img { width: 100%; height: 100%; object-fit: cover; }
    .status-badge {
      position: absolute; top: var(--spacing-sm); right: var(--spacing-sm);
      padding: 4px 12px; border-radius: var(--radius-full);
      font-size: 0.75rem; font-weight: 600; text-transform: uppercase;
    }
    .status-badge.inactive { background: rgba(196,91,74,0.9); color: white; }
    .circuit-info { padding: var(--spacing-lg); }
    .circuit-info h3 { margin: 0 0 var(--spacing-sm); font-size: 1.1rem; color: var(--color-text); }
    .circuit-duration { font-size: 0.9rem; color: var(--color-text-light); margin-bottom: var(--spacing-xs); }
    .circuit-price { font-weight: 700; color: var(--color-primary); font-size: 1.1rem; }
    .circuit-meta { margin: var(--spacing-xs) 0 0; }
    .meta-badge {
      display: inline-block; font-size: 0.72rem; font-weight: 700;
      padding: 2px 8px; border-radius: var(--radius-full);
      text-transform: uppercase; letter-spacing: 0.4px;
    }
    .meta-badge.itinerary { background: rgba(43,138,138,0.12); color: var(--color-secondary); }
    .circuit-actions {
      display: flex; justify-content: flex-end;
      gap: var(--spacing-sm); padding: var(--spacing-md) var(--spacing-lg);
      border-top: 1px solid rgba(61,43,31,0.1);
    }

    /* ── Boutons icônes ── */
    .btn-icon {
      background: transparent; border: none; padding: var(--spacing-sm);
      cursor: pointer; color: var(--color-text-light);
      border-radius: var(--radius-md); transition: all var(--transition-fast);
    }
    .btn-icon:hover { background: var(--color-background); color: var(--color-primary); }
    .btn-icon.danger:hover { background: rgba(196,91,74,0.1); color: var(--color-error); }

    /* ── Utilitaires ── */
    .loading { display: flex; justify-content: center; padding: var(--spacing-4xl); }
    .spinner {
      width: 40px; height: 40px;
      border: 3px solid rgba(61,43,31,0.1); border-top-color: var(--color-primary);
      border-radius: 50%; animation: spin 0.8s linear infinite;
    }
    .spinner-small {
      display: inline-block; width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
      border-radius: 50%; animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .empty-state { text-align: center; padding: var(--spacing-4xl); color: var(--color-text-light); }
    .help-text { font-size: 0.875rem; color: var(--color-text-light); margin: 0 0 var(--spacing-md); line-height: 1.5; }

    /* ── Modales (base) ── */
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.5);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000; padding: var(--spacing-xl);
    }
    .modal {
      background: var(--color-white); border-radius: var(--radius-xl);
      width: 100%; max-width: 500px; max-height: 90vh;
      overflow: hidden; display: flex; flex-direction: column;
    }
    .modal.large { max-width: 740px; }
    .modal.xlarge { max-width: 920px; }
    .modal-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      padding: var(--spacing-lg) var(--spacing-xl);
      border-bottom: 1px solid rgba(61,43,31,0.1); flex-shrink: 0;
    }
    .modal-header h3 { margin: 0; color: var(--color-text); }
    .btn-close {
      background: transparent; border: none; cursor: pointer;
      color: var(--color-text-light); padding: var(--spacing-sm);
      border-radius: var(--radius-md); transition: all var(--transition-fast);
      flex-shrink: 0;
    }
    .btn-close:hover { background: var(--color-background); color: var(--color-text); }
    .modal-body { padding: var(--spacing-xl); overflow-y: auto; flex-grow: 1; }

    /* ── Formulaires communs ── */
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md); }
    .form-group { margin-bottom: var(--spacing-md); }
    .form-group label {
      display: block; margin-bottom: var(--spacing-xs);
      font-weight: 600; color: var(--color-text); font-size: 0.9rem;
    }
    .form-group input, .form-group textarea, .form-group select {
      width: 100%; padding: var(--spacing-sm) var(--spacing-md);
      border: 2px solid rgba(61,43,31,0.15); border-radius: var(--radius-md);
      font-size: 0.95rem; transition: border-color var(--transition-fast);
      box-sizing: border-box;
    }
    .form-group input:focus, .form-group textarea:focus, .form-group select:focus {
      outline: none; border-color: var(--color-primary);
    }
    .form-group input:disabled { background: var(--color-background); cursor: not-allowed; }
    .checkbox-group { display: flex; align-items: center; }
    .checkbox-group label {
      display: flex; align-items: center; gap: var(--spacing-sm);
      cursor: pointer; margin-bottom: 0; font-weight: 400;
    }
    .checkbox-group input[type="checkbox"] { width: auto; }
    .field-hint { display: block; font-size: 0.8rem; color: var(--color-text-light); margin-top: 4px; }
    .form-section {
      background: var(--color-background); padding: var(--spacing-lg);
      border-radius: var(--radius-lg); margin-bottom: var(--spacing-lg);
    }
    .form-section h4 {
      margin: 0 0 var(--spacing-md); color: var(--color-text);
      font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;
    }
    .form-actions {
      display: flex; justify-content: flex-end; gap: var(--spacing-md);
      margin-top: var(--spacing-xl); padding-top: var(--spacing-lg);
      border-top: 1px solid rgba(61,43,31,0.1);
    }

    /* ── Boutons ── */
    .btn {
      padding: var(--spacing-sm) var(--spacing-xl); border-radius: var(--radius-md);
      font-weight: 600; cursor: pointer; transition: all var(--transition-fast);
      display: inline-flex; align-items: center; gap: var(--spacing-sm);
      border: none; font-size: 0.95rem;
    }
    .btn-primary { background: var(--color-primary); color: white; }
    .btn-primary:hover:not(:disabled) { background: var(--color-primary-dark); }
    .btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }
    .btn-success { background: #2d9b5a; color: white; }
    .btn-success:hover:not(:disabled) { background: #247a47; }
    .btn-success:disabled { opacity: 0.55; cursor: not-allowed; }
    .btn-outline { background: transparent; border: 2px solid var(--color-primary); color: var(--color-primary); }
    .btn-outline:hover { background: var(--color-primary); color: white; }
    .btn-ghost {
      background: transparent; border: none; color: var(--color-text-light);
      padding: var(--spacing-sm) var(--spacing-md);
    }
    .btn-ghost:hover { color: var(--color-text); }

    /* ════════════════════════════════════
       WIZARD
    ════════════════════════════════════ */
    .circuit-wizard { max-width: 860px; }
    .wizard-subtitle { margin: 4px 0 0; font-size: 0.85rem; color: var(--color-text-light); }

    /* Indicateur d'étapes */
    .wizard-steps {
      display: flex; align-items: center;
      padding: var(--spacing-md) var(--spacing-xl);
      background: var(--color-background); border-bottom: 1px solid rgba(61,43,31,0.08);
      flex-shrink: 0;
    }
    .wizard-step {
      display: flex; flex-direction: column; align-items: center;
      gap: 4px; cursor: pointer; user-select: none;
    }
    .step-circle {
      width: 34px; height: 34px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 0.9rem;
      border: 2px solid rgba(61,43,31,0.2);
      color: var(--color-text-light); background: white;
      transition: all 0.2s;
    }
    .wizard-step.active .step-circle {
      border-color: var(--color-primary); background: var(--color-primary);
      color: white; box-shadow: 0 0 0 4px rgba(61,43,31,0.12);
    }
    .wizard-step.done .step-circle {
      border-color: #2d9b5a; background: #2d9b5a; color: white;
    }
    .step-label { font-size: 0.78rem; font-weight: 600; color: var(--color-text-light); }
    .wizard-step.active .step-label, .wizard-step.done .step-label { color: var(--color-text); }
    .wizard-connector {
      flex: 1; height: 2px; background: rgba(61,43,31,0.15); margin: 0 var(--spacing-sm);
      margin-bottom: 18px; transition: background 0.3s;
    }
    .wizard-connector.filled { background: #2d9b5a; }

    /* Contenu des étapes */
    .step-content { animation: fadeIn 0.2s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

    /* Navigation wizard */
    .wizard-nav {
      display: flex; justify-content: space-between; align-items: center;
      margin-top: var(--spacing-xl); padding-top: var(--spacing-lg);
      border-top: 2px solid rgba(61,43,31,0.08);
    }
    .wizard-nav-right { display: flex; gap: var(--spacing-sm); align-items: center; }

    /* ── Durée ── */
    .duration-group {
      display: grid;
      grid-template-columns: 120px auto 1fr 1fr;
      gap: var(--spacing-md);
      align-items: end;
      margin-bottom: var(--spacing-md);
    }
    .btn-auto {
      height: 42px; padding: 0 var(--spacing-md); border-radius: var(--radius-md);
      border: 2px dashed rgba(61,43,31,0.25); background: transparent;
      color: var(--color-text-light); cursor: pointer; font-size: 0.85rem; font-weight: 600;
      transition: all var(--transition-fast); white-space: nowrap; margin-bottom: var(--spacing-md);
    }
    .btn-auto:hover { border-color: var(--color-primary); color: var(--color-primary); }

    /* ── Aperçu image ── */
    .img-preview {
      margin-top: var(--spacing-sm); border-radius: var(--radius-md);
      overflow: hidden; height: 140px;
    }
    .img-preview img { width: 100%; height: 100%; object-fit: cover; }

    /* ── Grille bilingue ── */
    .bilingual-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-xl); }
    .lang-col { background: var(--color-background); border-radius: var(--radius-lg); padding: var(--spacing-lg); }
    .lang-header {
      display: flex; align-items: center; gap: var(--spacing-sm);
      margin-bottom: var(--spacing-lg);
      padding-bottom: var(--spacing-md); border-bottom: 2px solid rgba(61,43,31,0.08);
    }
    .lang-header h4 { margin: 0; font-size: 1rem; }
    .lang-flag { font-size: 1.4rem; }

    /* ── Chips ── */
    .chip-input-row { display: flex; gap: var(--spacing-sm); }
    .chip-input-row input { flex: 1; }
    .btn-chip-add {
      width: 40px; height: 40px; flex-shrink: 0;
      border: 2px solid var(--color-primary); border-radius: var(--radius-md);
      background: transparent; color: var(--color-primary);
      font-size: 1.4rem; line-height: 1; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all var(--transition-fast);
    }
    .btn-chip-add:hover { background: var(--color-primary); color: white; }
    .chips { display: flex; flex-wrap: wrap; gap: var(--spacing-sm); margin-top: var(--spacing-sm); min-height: 32px; }
    .chip {
      display: inline-flex; align-items: center; gap: 6px;
      background: var(--color-primary); color: white;
      padding: 4px 10px; border-radius: var(--radius-full);
      font-size: 0.82rem; font-weight: 500; max-width: 260px;
    }
    .chip button {
      background: none; border: none; color: rgba(255,255,255,0.75);
      cursor: pointer; font-size: 1rem; line-height: 1; padding: 0;
      flex-shrink: 0;
    }
    .chip button:hover { color: white; }
    .chip-empty { font-size: 0.82rem; color: var(--color-text-light); font-style: italic; }

    /* ═══════════════════════════════════
       TIMELINE ITINÉRAIRE INLINE
    ═══════════════════════════════════ */
    .itinerary-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: var(--spacing-xl);
    }
    .itinerary-header h4 { margin: 0 0 4px; font-size: 1.05rem; }

    .itinerary-timeline { display: flex; flex-direction: column; margin-bottom: var(--spacing-lg); }
    .timeline-day { display: flex; gap: var(--spacing-md); }
    .timeline-left {
      display: flex; flex-direction: column; align-items: center;
      flex-shrink: 0; width: 40px;
    }
    .day-circle {
      width: 36px; height: 36px; border-radius: 50%;
      background: var(--color-primary); color: white;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 0.88rem; flex-shrink: 0;
      box-shadow: 0 2px 8px rgba(61,43,31,0.25);
    }
    .timeline-line { flex: 1; width: 2px; background: rgba(61,43,31,0.15); margin: 4px 0; min-height: 20px; }
    .day-card {
      flex: 1; background: var(--color-background); border-radius: var(--radius-lg);
      padding: var(--spacing-md) var(--spacing-lg); margin-bottom: var(--spacing-md);
      border: 1.5px solid transparent; transition: border-color 0.2s;
    }
    .timeline-day.is-editing .day-card { border-color: var(--color-primary); }
    .day-card-top {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: var(--spacing-sm);
    }
    .day-card-titles { flex: 1; margin-right: var(--spacing-sm); }
    .day-title-fr { display: block; font-size: 0.95rem; color: var(--color-text); }
    .day-title-en { display: block; font-size: 0.82rem; color: var(--color-text-light); font-style: italic; }
    .day-card-actions { display: flex; gap: 4px; flex-shrink: 0; }
    .day-meta { font-size: 0.82rem; color: var(--color-secondary); margin: 0 0 var(--spacing-xs); }
    .day-desc { font-size: 0.85rem; color: var(--color-text-light); margin: 0 0 var(--spacing-sm); line-height: 1.5; }
    .day-badges { display: flex; flex-wrap: wrap; gap: var(--spacing-xs); }
    .day-badge {
      font-size: 0.78rem; padding: 2px 8px; border-radius: var(--radius-full);
      background: rgba(61,43,31,0.08); color: var(--color-text-light);
    }
    .day-badge.hotel { background: rgba(43,138,138,0.1); color: var(--color-secondary); }
    .day-badge.meal { background: rgba(196,159,74,0.12); color: #8a6c0a; }

    /* État vide */
    .itinerary-empty {
      text-align: center; padding: var(--spacing-3xl) var(--spacing-xl);
      color: var(--color-text-light); background: var(--color-background);
      border-radius: var(--radius-xl); border: 2px dashed rgba(61,43,31,0.15);
    }
    .itinerary-empty p { margin: var(--spacing-sm) 0 4px; font-size: 1rem; color: var(--color-text); }
    .itinerary-empty small { font-size: 0.85rem; }

    /* Formulaire inline d'ajout/édition de jour */
    .inline-day-form {
      background: linear-gradient(135deg, rgba(61,43,31,0.03) 0%, rgba(43,138,138,0.04) 100%);
      border: 2px solid var(--color-primary); border-radius: var(--radius-xl);
      padding: var(--spacing-xl); margin-top: var(--spacing-lg);
      animation: slideDown 0.2s ease;
    }
    @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: none; } }
    .inline-form-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: var(--spacing-lg);
    }
    .inline-form-title { display: flex; align-items: center; gap: var(--spacing-md); }
    .inline-day-num {
      background: var(--color-primary); color: white;
      width: 36px; height: 36px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 0.9rem; flex-shrink: 0;
    }
    .inline-form-title h5 { margin: 0; font-size: 1rem; color: var(--color-text); }
    .btn-close-sm {
      background: none; border: 1px solid rgba(61,43,31,0.2); width: 28px; height: 28px;
      border-radius: 50%; cursor: pointer; color: var(--color-text-light);
      font-size: 0.85rem; display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .btn-close-sm:hover { background: rgba(196,91,74,0.1); color: var(--color-error); border-color: var(--color-error); }
    .form-row-3 { display: grid; grid-template-columns: 100px 1fr 1fr; gap: var(--spacing-md); margin-bottom: var(--spacing-sm); }
    .span-2 { grid-column: span 2; }
    .mini-lang {
      font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
      color: var(--color-text-light); margin-bottom: var(--spacing-md); padding-bottom: var(--spacing-sm);
      border-bottom: 1px solid rgba(61,43,31,0.1);
    }
    .inline-day-actions {
      display: flex; justify-content: flex-end; gap: var(--spacing-md);
      margin-top: var(--spacing-lg); padding-top: var(--spacing-md);
      border-top: 1px solid rgba(61,43,31,0.1);
    }

    /* Stages list (gestionnaire existant) */
    .stages-header { margin-bottom: var(--spacing-xl); display: flex; justify-content: space-between; align-items: center; }
    .stages-list { display: flex; flex-direction: column; gap: var(--spacing-md); }
    .stage-item {
      background: var(--color-background); border-radius: var(--radius-lg);
      padding: var(--spacing-lg); display: flex; gap: var(--spacing-lg); align-items: start;
    }
    .stage-badge {
      background: var(--color-secondary); color: white;
      padding: var(--spacing-xs) var(--spacing-md); border-radius: var(--radius-full);
      font-size: 0.75rem; font-weight: 700; white-space: nowrap; text-transform: uppercase;
    }
    .stage-info { flex-grow: 1; }
    .stage-info h4 { margin: 0 0 var(--spacing-xs); color: var(--color-text); }
    .stage-location { font-size: 0.85rem; color: var(--color-text-light); margin: 0 0 var(--spacing-xs); }
    .stage-times {
      font-size: 0.85rem; color: var(--color-text-light); margin: 0 0 var(--spacing-sm);
      display: flex; align-items: center; gap: var(--spacing-sm);
    }
    .duration-badge {
      background: var(--color-accent); color: white;
      padding: 2px 8px; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 600;
    }
    .stage-images-preview { display: flex; gap: var(--spacing-xs); margin-top: var(--spacing-sm); align-items: center; }
    .stage-images-preview img { width: 60px; height: 60px; object-fit: cover; border-radius: var(--radius-md); }
    .more-images { font-size: 0.85rem; color: var(--color-text-light); font-weight: 600; }
    .stage-actions { display: flex; gap: var(--spacing-xs); }

    /* ── Responsive ── */
    @media (max-width: 768px) {
      .bilingual-grid { grid-template-columns: 1fr; }
      .duration-group { grid-template-columns: 1fr 1fr; }
      .btn-auto { display: none; }
    }
    /* ── Attachments ── */
    .attachments-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: var(--spacing-xl);
    }
    .upload-btn {
      cursor: pointer; display: inline-flex; align-items: center; gap: var(--spacing-sm);
    }
    .upload-btn.disabled { opacity: 0.55; pointer-events: none; }
    .max-badge {
      font-size: 0.85rem; color: var(--color-accent); font-weight: 600;
      padding: var(--spacing-xs) var(--spacing-md);
      background: rgba(196,159,74,0.12); border-radius: var(--radius-full);
    }
    .attachments-list { display: flex; flex-direction: column; gap: var(--spacing-md); }
    .attachment-item {
      display: flex; align-items: center; gap: var(--spacing-lg);
      background: var(--color-background); border-radius: var(--radius-lg);
      padding: var(--spacing-md) var(--spacing-lg);
      transition: box-shadow var(--transition-fast);
    }
    .attachment-item:hover { box-shadow: var(--shadow-md); }
    .attachment-icon { flex-shrink: 0; width: 56px; height: 56px; border-radius: var(--radius-md); overflow: hidden; }
    .attachment-thumb { width: 100%; height: 100%; object-fit: cover; }
    .pdf-icon {
      width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
      background: rgba(196,91,74,0.1); color: var(--color-error);
    }
    .attachment-info { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .attachment-name {
      font-weight: 600; font-size: 0.9rem; color: var(--color-text);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .attachment-meta { font-size: 0.78rem; color: var(--color-text-light); }
    .attachment-actions { display: flex; gap: var(--spacing-xs); flex-shrink: 0; }
    .attachment-actions a { text-decoration: none; }

    @media (max-width: 600px) {
      .circuits-grid { grid-template-columns: 1fr; }
      .form-row { grid-template-columns: 1fr; }
      .form-row-3 { grid-template-columns: 1fr; }
      .span-2 { grid-column: 1; }
      .wizard-steps { padding: var(--spacing-sm) var(--spacing-md); gap: var(--spacing-sm); }
      .step-label { display: none; }
      .stage-item { flex-direction: column; }
      .attachment-item { flex-wrap: wrap; }
    }
  `]
})
export class AdminCircuitsComponent implements OnInit {
  lang = inject(LanguageService);
  circuitService = inject(CircuitService);
  stageService = inject(CircuitStageService);
  private cloudinaryService = inject(CloudinaryService);

  // ── État principal ──────────────────────────────────────────────────────────
  circuits = signal<Circuit[]>([]);
  isLoading = signal(false);
  showForm = signal(false);
  isEditing = signal(false);
  isSaving = signal(false);
  editingCircuitId = signal<string | null>(null);
  currentCircuit = signal<Circuit | null>(null);

  // ── Wizard ──────────────────────────────────────────────────────────────────
  currentStep = signal(1);
  readonly wizardSubtitles = [
    'Informations générales, image et tarification',
    'Contenu bilingue, points forts et services inclus',
    'Programme jour par jour du circuit'
  ];

  // ── Formulaire circuit ──────────────────────────────────────────────────────
  formData: CircuitFormData = this.getEmptyFormData();

  // Chips: état d'entrée (texte en cours de saisie)
  newHighlightFr = '';
  newHighlightEn = '';
  newServiceFr = '';
  newServiceEn = '';

  // ── Itinéraire inline (dans le wizard) ─────────────────────────────────────
  inlineDayFormVisible = signal(false);
  editingInlineDayIndex = signal<number | null>(null);
  inlineDay: ItineraryDay = this.getEmptyDayData();

  // ── Stages manager (circuit_stages) ────────────────────────────────────────
  showStagesManager = signal(false);
  showStageForm = signal(false);
  stages = signal<CircuitStage[]>([]);
  loadingStages = signal(false);
  editingStage = signal(false);
  editingStageId = signal<string | null>(null);
  stageFormData: CircuitStageFormData = this.getEmptyStageFormData();
  stageImagesText = '';

  // ── Gestionnaire de pieces jointes ──────────────────────────────────────────
  showAttachmentsManager = signal(false);
  attachments = signal<CircuitAttachment[]>([]);
  loadingAttachments = signal(false);
  isUploading = signal(false);

  // ── Gestionnaire itinéraire (depuis cartes) ─────────────────────────────────
  showItineraryManager = signal(false);
  showDayForm = signal(false);
  itineraryDays = signal<ItineraryDay[]>([]);
  editingDayIndex = signal<number | null>(null);
  dayFormData: ItineraryDay = this.getEmptyDayData();

  // ── Lifecycle ───────────────────────────────────────────────────────────────
  ngOnInit(): void { this.loadCircuits(); }

  async loadCircuits(): Promise<void> {
    this.isLoading.set(true);
    this.circuits.set(await this.circuitService.loadAllCircuits());
    this.isLoading.set(false);
  }

  // ── Données vides ───────────────────────────────────────────────────────────
  getEmptyFormData(): CircuitFormData {
    return {
      slug: '', image_url: '', duration_en: '', duration_fr: '', duration_days: 7,
      title_en: '', title_fr: '', description_en: '', description_fr: '',
      highlights_en: [], highlights_fr: [], itinerary: [],
      included_services_fr: [], included_services_en: [],
      accommodation_type_fr: null, accommodation_type_en: null,
      min_participants: 2, max_participants: 12, price: 0,
      price_note_en: 'per person', price_note_fr: 'par personne',
      is_active: true, display_order: 0
    };
  }

  getEmptyDayData(): ItineraryDay {
    return {
      day: 1, title_fr: '', title_en: '',
      description_fr: '', description_en: '',
      location_fr: '', location_en: '',
      accommodation_fr: '', accommodation_en: '',
      meals_fr: '', meals_en: '', excursion_image: ''
    };
  }

  // ── Wizard navigation ───────────────────────────────────────────────────────
  nextStep(): void { if (this.currentStep() < 3) this.currentStep.update(s => s + 1); }
  prevStep(): void { if (this.currentStep() > 1) this.currentStep.update(s => s - 1); }
  goToStep(n: number): void { this.currentStep.set(n); }

  // ── Auto-remplissage durée ──────────────────────────────────────────────────
  autoFillDuration(): void {
    const days = this.formData.duration_days;
    if (!days || days < 1) return;
    const nights = days - 1;
    this.formData.duration_fr = nights > 0 ? `${days} jours / ${nights} nuits` : `1 jour`;
    this.formData.duration_en = nights > 0 ? `${days} days / ${nights} nights` : `1 day`;
  }

  // ── Chips : highlights FR ───────────────────────────────────────────────────
  addHighlightFr(): void {
    const v = this.newHighlightFr.trim();
    if (v) { this.formData.highlights_fr = [...this.formData.highlights_fr, v]; this.newHighlightFr = ''; }
  }
  removeHighlightFr(i: number): void { this.formData.highlights_fr = this.formData.highlights_fr.filter((_, idx) => idx !== i); }

  // ── Chips : highlights EN ───────────────────────────────────────────────────
  addHighlightEn(): void {
    const v = this.newHighlightEn.trim();
    if (v) { this.formData.highlights_en = [...this.formData.highlights_en, v]; this.newHighlightEn = ''; }
  }
  removeHighlightEn(i: number): void { this.formData.highlights_en = this.formData.highlights_en.filter((_, idx) => idx !== i); }

  // ── Chips : services FR ─────────────────────────────────────────────────────
  addServiceFr(): void {
    const v = this.newServiceFr.trim();
    if (v) { this.formData.included_services_fr = [...this.formData.included_services_fr, v]; this.newServiceFr = ''; }
  }
  removeServiceFr(i: number): void { this.formData.included_services_fr = this.formData.included_services_fr.filter((_, idx) => idx !== i); }

  // ── Chips : services EN ─────────────────────────────────────────────────────
  addServiceEn(): void {
    const v = this.newServiceEn.trim();
    if (v) { this.formData.included_services_en = [...this.formData.included_services_en, v]; this.newServiceEn = ''; }
  }
  removeServiceEn(i: number): void { this.formData.included_services_en = this.formData.included_services_en.filter((_, idx) => idx !== i); }

  // ── Itinéraire inline ───────────────────────────────────────────────────────
  openInlineDayForm(index?: number): void {
    if (index !== undefined) {
      this.inlineDay = { ...this.formData.itinerary[index] };
      this.editingInlineDayIndex.set(index);
    } else {
      const days = this.formData.itinerary;
      const nextDay = days.length > 0 ? Math.max(...days.map(d => d.day)) + 1 : 1;
      this.inlineDay = { ...this.getEmptyDayData(), day: nextDay };
      this.editingInlineDayIndex.set(null);
    }
    this.inlineDayFormVisible.set(true);
  }

  editInlineDay(index: number): void { this.openInlineDayForm(index); }

  saveInlineDay(): void {
    if (!this.inlineDay.title_fr || !this.inlineDay.description_fr) return;
    const days = [...this.formData.itinerary];
    const idx = this.editingInlineDayIndex();
    if (idx !== null) {
      days[idx] = { ...this.inlineDay };
    } else {
      days.push({ ...this.inlineDay });
    }
    days.sort((a, b) => a.day - b.day);
    this.formData = { ...this.formData, itinerary: days };
    this.cancelInlineDay();
  }

  cancelInlineDay(): void {
    this.inlineDayFormVisible.set(false);
    this.editingInlineDayIndex.set(null);
    this.inlineDay = this.getEmptyDayData();
  }

  deleteInlineDay(index: number): void {
    if (!confirm('Supprimer ce jour ?')) return;
    const days = this.formData.itinerary.filter((_, i) => i !== index);
    this.formData = { ...this.formData, itinerary: days };
  }

  // ── Ouverture / fermeture formulaire circuit ────────────────────────────────
  openCreateForm(): void {
    this.formData = this.getEmptyFormData();
    this.newHighlightFr = ''; this.newHighlightEn = '';
    this.newServiceFr = ''; this.newServiceEn = '';
    this.isEditing.set(false);
    this.editingCircuitId.set(null);
    this.currentStep.set(1);
    this.cancelInlineDay();
    this.showForm.set(true);
  }

  openEditForm(circuit: Circuit): void {
    this.formData = {
      slug: circuit.slug, image_url: circuit.image_url,
      duration_en: circuit.duration_en, duration_fr: circuit.duration_fr,
      duration_days: circuit.duration_days, title_en: circuit.title_en,
      title_fr: circuit.title_fr, description_en: circuit.description_en,
      description_fr: circuit.description_fr,
      highlights_en: [...circuit.highlights_en], highlights_fr: [...circuit.highlights_fr],
      itinerary: [...(circuit.itinerary || [])],
      included_services_fr: [...circuit.included_services_fr],
      included_services_en: [...circuit.included_services_en],
      accommodation_type_fr: circuit.accommodation_type_fr,
      accommodation_type_en: circuit.accommodation_type_en,
      min_participants: circuit.min_participants,
      max_participants: circuit.max_participants, price: circuit.price,
      price_note_en: circuit.price_note_en, price_note_fr: circuit.price_note_fr,
      is_active: circuit.is_active, display_order: circuit.display_order
    };
    this.newHighlightFr = ''; this.newHighlightEn = '';
    this.newServiceFr = ''; this.newServiceEn = '';
    this.isEditing.set(true);
    this.editingCircuitId.set(circuit.id);
    this.currentStep.set(1);
    this.cancelInlineDay();
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.cancelInlineDay();
  }

  // ── Sauvegarde circuit ──────────────────────────────────────────────────────
  async saveCircuit(): Promise<void> {
    this.isSaving.set(true);
    let success = false;
    if (this.isEditing() && this.editingCircuitId()) {
      success = await this.circuitService.updateCircuit(this.editingCircuitId()!, this.formData);
    } else {
      const created = await this.circuitService.createCircuit(this.formData);
      success = !!created;
    }
    this.isSaving.set(false);
    if (success) { this.closeForm(); await this.loadCircuits(); }
  }

  // ── Actions circuit ─────────────────────────────────────────────────────────
  async toggleStatus(circuit: Circuit): Promise<void> {
    const success = await this.circuitService.updateCircuit(circuit.id, { is_active: !circuit.is_active });
    if (success) await this.loadCircuits();
  }

  async deleteCircuit(circuit: Circuit): Promise<void> {
    if (confirm(this.lang.t('admin.confirmDeleteCircuit'))) {
      const success = await this.circuitService.deleteCircuit(circuit.id);
      if (success) await this.loadCircuits();
    }
  }

  // ── Gestionnaire de Stages ──────────────────────────────────────────────────
  getEmptyStageFormData(): CircuitStageFormData {
    return {
      excursion_id: '', day_number: 1, stage_number: 1,
      title_fr: '', title_en: '', description_fr: '', description_en: '',
      images: [], duration_minutes: 0, start_time: null, end_time: null,
      location_fr: '', location_en: '', display_order: 0
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
    this.stages.set(await this.stageService.getStagesByExcursionId(excursionId));
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
      excursion_id: stage.excursion_id, day_number: stage.day_number,
      stage_number: stage.stage_number, title_fr: stage.title_fr,
      title_en: stage.title_en, description_fr: stage.description_fr,
      description_en: stage.description_en, images: stage.images || [],
      duration_minutes: stage.duration_minutes || 0,
      start_time: stage.start_time, end_time: stage.end_time,
      location_fr: stage.location_fr || '', location_en: stage.location_en || '',
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
      success = !!(await this.stageService.createStage(this.stageFormData));
    }
    this.isSaving.set(false);
    if (success) {
      this.closeStageForm();
      const circuit = this.currentCircuit();
      if (circuit) await this.loadStages(circuit.id);
    }
  }

  async deleteStage(stage: CircuitStage): Promise<void> {
    if (confirm(this.lang.t('admin.confirmDeleteStage'))) {
      const success = await this.stageService.deleteStage(stage.id);
      if (success) {
        const circuit = this.currentCircuit();
        if (circuit) await this.loadStages(circuit.id);
      }
    }
  }

  // ── Gestionnaire itinéraire (depuis cartes) ─────────────────────────────────
  openItineraryManager(circuit: Circuit): void {
    this.currentCircuit.set(circuit);
    this.itineraryDays.set([...(circuit.itinerary || [])].sort((a, b) => a.day - b.day));
    this.showItineraryManager.set(true);
  }

  closeItineraryManager(): void {
    this.showItineraryManager.set(false);
    this.currentCircuit.set(null);
    this.itineraryDays.set([]);
  }

  openDayForm(index?: number): void {
    if (index !== undefined) {
      this.dayFormData = { ...this.itineraryDays()[index] };
      this.editingDayIndex.set(index);
    } else {
      const days = this.itineraryDays();
      const nextDay = days.length > 0 ? Math.max(...days.map(d => d.day)) + 1 : 1;
      this.dayFormData = { ...this.getEmptyDayData(), day: nextDay };
      this.editingDayIndex.set(null);
    }
    this.showDayForm.set(true);
  }

  closeDayForm(): void {
    this.showDayForm.set(false);
    this.dayFormData = this.getEmptyDayData();
    this.editingDayIndex.set(null);
  }

  async saveDayToItinerary(): Promise<void> {
    const circuit = this.currentCircuit();
    if (!circuit) return;
    this.isSaving.set(true);
    const days = [...this.itineraryDays()];
    const idx = this.editingDayIndex();
    if (idx !== null) { days[idx] = { ...this.dayFormData }; }
    else { days.push({ ...this.dayFormData }); }
    days.sort((a, b) => a.day - b.day);
    const success = await this.circuitService.updateCircuit(circuit.id, { itinerary: days });
    this.isSaving.set(false);
    if (success) {
      this.itineraryDays.set(days);
      this.circuits.update(list => list.map(c => c.id === circuit.id ? { ...c, itinerary: days } : c));
      this.closeDayForm();
    }
  }

  async deleteDayFromItinerary(index: number): Promise<void> {
    const circuit = this.currentCircuit();
    if (!circuit || !confirm('Supprimer ce jour ?')) return;
    const days = this.itineraryDays().filter((_, i) => i !== index);
    const success = await this.circuitService.updateCircuit(circuit.id, { itinerary: days });
    if (success) {
      this.itineraryDays.set(days);
      this.circuits.update(list => list.map(c => c.id === circuit.id ? { ...c, itinerary: days } : c));
    }
  }

  // ── Gestionnaire de pieces jointes ──────────────────────────────────────────
  async openAttachmentsManager(circuit: Circuit): Promise<void> {
    this.currentCircuit.set(circuit);
    this.showAttachmentsManager.set(true);
    await this.loadAttachments(circuit.id);
  }

  closeAttachmentsManager(): void {
    this.showAttachmentsManager.set(false);
    this.attachments.set([]);
  }

  async loadAttachments(circuitId: string): Promise<void> {
    this.loadingAttachments.set(true);
    this.attachments.set(await this.circuitService.getAttachments(circuitId));
    this.loadingAttachments.set(false);
  }

  async uploadAttachmentViaCloudinary(): Promise<void> {
    const circuit = this.currentCircuit();
    if (!circuit || this.attachments().length >= 3) return;

    const remaining = 3 - this.attachments().length;
    this.isUploading.set(true);
    try {
      const results = await this.cloudinaryService.openUploadWidget({
        folder: `nio-far/circuits/${circuit.id}/attachments`,
        resourceType: 'auto',
        maxFiles: remaining,
        acceptedFiles: 'pdf,jpg,jpeg,png,webp',
      });

      for (const r of results) {
        if (this.attachments().length >= 3) break;
        const attachment = await this.circuitService.saveAttachmentRecord(circuit.id, {
          file_name: r.original_filename + '.' + r.format,
          file_url: r.secure_url,
          file_type: r.resource_type === 'raw' ? 'application/pdf' : `image/${r.format}`,
          file_size: r.bytes,
        });
        if (attachment) {
          this.attachments.update(list => [...list, attachment]);
        }
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      this.isUploading.set(false);
    }
  }

  async deleteAttachment(att: CircuitAttachment): Promise<void> {
    if (!confirm(this.lang.t('admin.confirmDeleteAttachment'))) return;
    const success = await this.circuitService.deleteAttachment(att);
    if (success) {
      this.attachments.update(list => list.filter(a => a.id !== att.id));
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  }

  // ── Utilitaires ─────────────────────────────────────────────────────────────
  formatTime(time: string): string { return time ? time.substring(0, 5) : ''; }

  formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m === 0 ? `${h}h` : `${h}h${m}`;
  }
}
