import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { AuditService } from '../../core/services/audit.service';
import { User, CreateUserDto, UpdateUserDto, UserRole } from '../../core/models/user.model';

// ── Définition des rôles avec description et permissions ─────────────────────
const ROLE_DEFS: Array<{
  value: UserRole;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  icon: string;
  permissions: string[];
}> = [
  {
    value: 'administrator',
    label: 'Super-Administrateur',
    description: 'Accès complet à toutes les fonctionnalités du backoffice.',
    color: '#dc2626',
    bgColor: '#fef2f2',
    icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    permissions: [
      'Gestion des utilisateurs et rôles',
      'Tableau de bord & statistiques',
      'Gestion des réservations',
      'Édition circuits, excursions, locations',
      'Promotions & images',
      'Journal d\'audit'
    ]
  },
  {
    value: 'manager',
    label: 'Manager',
    description: 'Suivi global de l\'activité business en temps réel.',
    color: '#7c3aed',
    bgColor: '#f5f3ff',
    icon: 'M18 20V10M12 20V4M6 20v-6',
    permissions: [
      'Tableau de bord temps réel',
      'Consultation des réservations (lecture seule)',
      'Consultation des messages',
      'Journal d\'audit (lecture seule)'
    ]
  },
  {
    value: 'operator',
    label: 'Opérateur',
    description: 'Gestion opérationnelle des réservations et du contenu.',
    color: '#2563eb',
    bgColor: '#eff6ff',
    icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z',
    permissions: [
      'Gestion complète des réservations',
      'Consultation & suppression des messages',
      'Édition circuits, excursions, locations',
      'Promotions & images & contenu CMS'
    ]
  }
];

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <div class="users-section">

      <!-- ── En-tête ──────────────────────────────────────────────── -->
      <div class="section-header">
        <div>
          <h2>Gestion des utilisateurs</h2>
          <p class="subtitle">{{ users().length }} utilisateur(s) enregistré(s)</p>
        </div>
        <button class="btn btn-primary" (click)="openCreateForm()">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nouvel utilisateur
        </button>
      </div>

      <!-- ── Tableau ───────────────────────────────────────────────── -->
      @if (loading()) {
        <div class="loading">
          <div class="spinner"></div>
        </div>
      } @else if (users().length === 0) {
        <div class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <p>Aucun utilisateur pour le moment</p>
          <button class="btn btn-primary" (click)="openCreateForm()">Créer le premier utilisateur</button>
        </div>
      } @else {
        <div class="table-wrapper">
          <table class="users-table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Dernière connexion</th>
                <th>Créé le</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (user of users(); track user.id) {
                <tr [class.inactive-row]="!user.is_active">
                  <!-- Utilisateur -->
                  <td>
                    <div class="user-cell">
                      <div class="user-avatar-sm" [style.background]="getRoleColor(user.role)">
                        {{ getInitials(user.name) }}
                      </div>
                      <div>
                        <div class="user-full-name">{{ user.name }}</div>
                        <div class="user-email-sm">{{ user.email }}</div>
                      </div>
                    </div>
                  </td>

                  <!-- Rôle -->
                  <td>
                    <span class="role-chip" [class]="'role-' + user.role">
                      {{ getRoleLabel(user.role) }}
                    </span>
                  </td>

                  <!-- Statut -->
                  <td>
                    <button
                      class="status-toggle"
                      [class.active]="user.is_active"
                      (click)="toggleStatus(user)"
                      [title]="user.is_active ? 'Désactiver le compte' : 'Activer le compte'"
                    >
                      <span class="toggle-track">
                        <span class="toggle-thumb"></span>
                      </span>
                      {{ user.is_active ? 'Actif' : 'Inactif' }}
                    </button>
                  </td>

                  <!-- Dernière connexion -->
                  <td>
                    <span class="last-login" [title]="user.last_login ? (user.last_login | date:'dd/MM/yyyy HH:mm') : ''">
                      {{ formatLastLogin(user.last_login) }}
                    </span>
                  </td>

                  <!-- Créé le -->
                  <td class="date-cell">{{ user.created_at | date:'dd/MM/yyyy' }}</td>

                  <!-- Actions -->
                  <td>
                    <div class="row-actions">
                      <button class="action-btn" (click)="openEditForm(user)" title="Modifier">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        Modifier
                      </button>
                      <button class="action-btn danger" (click)="deleteUser(user)" title="Supprimer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      <!-- ── Modal création / édition ────────────────────────────── -->
      @if (showForm()) {
        <div class="modal-overlay" (click)="closeForm()">
          <div class="modal-panel" (click)="$event.stopPropagation()">

            <!-- En-tête modal -->
            <div class="modal-top">
              <div class="modal-avatar" [style.background]="previewAvatarColor()">
                {{ previewInitials() }}
              </div>
              <div>
                <h3>{{ editingUser() ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur' }}</h3>
                <p class="modal-subtitle">
                  @if (editingUser()) {
                    {{ editingUser()!.email }}
                  } @else {
                    Remplissez les informations ci-dessous
                  }
                </p>
              </div>
              <button class="modal-close" (click)="closeForm()">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <!-- Formulaire -->
            <form (ngSubmit)="saveUser()" class="user-form" novalidate>

              <!-- Section Identité -->
              <div class="form-section">
                <h4 class="form-section-title">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Identité
                </h4>
                <div class="form-row">
                  <div class="form-group" [class.has-error]="errors().firstName">
                    <label for="firstName">Prénom <span class="required">*</span></label>
                    <input
                      type="text" id="firstName" name="firstName"
                      [(ngModel)]="firstName"
                      (ngModelChange)="clearError('firstName')"
                      placeholder="Ex. Amadou"
                      autocomplete="given-name"
                    />
                    @if (errors().firstName) {
                      <span class="field-error">{{ errors().firstName }}</span>
                    }
                  </div>
                  <div class="form-group" [class.has-error]="errors().lastName">
                    <label for="lastName">Nom <span class="required">*</span></label>
                    <input
                      type="text" id="lastName" name="lastName"
                      [(ngModel)]="lastName"
                      (ngModelChange)="clearError('lastName')"
                      placeholder="Ex. SARR"
                      autocomplete="family-name"
                      style="text-transform: uppercase"
                    />
                    @if (errors().lastName) {
                      <span class="field-error">{{ errors().lastName }}</span>
                    }
                  </div>
                </div>

                <div class="form-group" [class.has-error]="errors().email">
                  <label for="userEmail">Adresse email <span class="required">*</span></label>
                  <div class="input-icon-wrap">
                    <svg class="field-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <input
                      type="email" id="userEmail" name="userEmail"
                      [(ngModel)]="formData.email"
                      (ngModelChange)="clearError('email')"
                      placeholder="prenom.nom@domaine.com"
                      autocomplete="email"
                    />
                  </div>
                  @if (errors().email) {
                    <span class="field-error">{{ errors().email }}</span>
                  }
                </div>
              </div>

              <!-- Section Rôle -->
              <div class="form-section">
                <h4 class="form-section-title">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  Rôle & permissions
                </h4>
                <div class="role-cards">
                  @for (role of roleDefs; track role.value) {
                    <div
                      class="role-card"
                      [class.selected]="formData.role === role.value"
                      [style.--role-color]="role.color"
                      [style.--role-bg]="role.bgColor"
                      (click)="formData.role = role.value"
                    >
                      <div class="role-card-header">
                        <div class="role-icon-wrap" [style.background]="role.bgColor" [style.color]="role.color">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path [attr.d]="role.icon"/>
                          </svg>
                        </div>
                        <div class="role-card-check">
                          @if (formData.role === role.value) {
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                          }
                        </div>
                      </div>
                      <div class="role-card-title" [style.color]="role.color">{{ role.label }}</div>
                      <div class="role-card-desc">{{ role.description }}</div>
                      <ul class="role-perm-list">
                        @for (perm of role.permissions; track perm) {
                          <li>{{ perm }}</li>
                        }
                      </ul>
                    </div>
                  }
                </div>
              </div>

              <!-- Section Mot de passe -->
              <div class="form-section">
                <h4 class="form-section-title">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Mot de passe
                  @if (editingUser()) {
                    <span class="section-hint">Laisser vide pour conserver le mot de passe actuel</span>
                  }
                </h4>

                <div class="form-row">
                  <div class="form-group" [class.has-error]="errors().password">
                    <label for="pwd">
                      Mot de passe
                      @if (!editingUser()) { <span class="required">*</span> }
                    </label>
                    <div class="input-icon-wrap">
                      <svg class="field-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      <input
                        [type]="showPwd() ? 'text' : 'password'"
                        id="pwd" name="pwd"
                        [(ngModel)]="formData.password"
                        (ngModelChange)="clearError('password')"
                        placeholder="••••••••"
                        autocomplete="new-password"
                      />
                      <button type="button" class="toggle-pwd" (click)="showPwd.set(!showPwd())" [title]="showPwd() ? 'Masquer' : 'Afficher'">
                        @if (showPwd()) {
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        } @else {
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        }
                      </button>
                    </div>
                    @if (errors().password) {
                      <span class="field-error">{{ errors().password }}</span>
                    }

                    <!-- Indicateur de force -->
                    @if (formData.password) {
                      <div class="pwd-strength">
                        <div class="strength-bars">
                          @for (i of [1,2,3,4,5]; track i) {
                            <div class="strength-bar" [class.filled]="pwdStrength() >= i" [class]="'strength-bar level-' + pwdStrength()"></div>
                          }
                        </div>
                        <span class="strength-label" [class]="'level-' + pwdStrength()">{{ pwdStrengthLabel() }}</span>
                      </div>
                      <ul class="pwd-rules">
                        <li [class.ok]="formData.password.length >= 8">Au moins 8 caractères</li>
                        <li [class.ok]="hasUppercase()">Une majuscule</li>
                        <li [class.ok]="hasNumber()">Un chiffre</li>
                        <li [class.ok]="hasSpecial()">Un caractère spécial (!#&#64;…)</li>
                      </ul>
                    }
                  </div>

                  <div class="form-group" [class.has-error]="errors().confirmPassword">
                    <label for="confirmPwd">
                      Confirmer le mot de passe
                      @if (!editingUser() || formData.password) { <span class="required">*</span> }
                    </label>
                    <div class="input-icon-wrap">
                      <svg class="field-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                      <input
                        [type]="showConfirm() ? 'text' : 'password'"
                        id="confirmPwd" name="confirmPwd"
                        [(ngModel)]="confirmPassword"
                        (ngModelChange)="clearError('confirmPassword')"
                        placeholder="••••••••"
                        autocomplete="new-password"
                      />
                      <button type="button" class="toggle-pwd" (click)="showConfirm.set(!showConfirm())" [title]="showConfirm() ? 'Masquer' : 'Afficher'">
                        @if (showConfirm()) {
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        } @else {
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        }
                      </button>
                    </div>
                    @if (errors().confirmPassword) {
                      <span class="field-error">{{ errors().confirmPassword }}</span>
                    }
                    @if (confirmPassword && formData.password && confirmPassword === formData.password) {
                      <span class="field-ok">Les mots de passe correspondent</span>
                    }
                  </div>
                </div>
              </div>

              <!-- Section Options -->
              <div class="form-section">
                <h4 class="form-section-title">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93L17.66 6.34M4.93 4.93l1.41 1.41"/></svg>
                  Options
                </h4>
                <label class="toggle-label">
                  <div class="toggle-switch" [class.on]="formData.is_active" (click)="formData.is_active = !formData.is_active">
                    <div class="toggle-knob"></div>
                  </div>
                  <div>
                    <span class="toggle-text">Compte {{ formData.is_active ? 'actif' : 'inactif' }}</span>
                    <span class="toggle-hint">{{ formData.is_active ? 'L\'utilisateur peut se connecter' : 'Connexion bloquée' }}</span>
                  </div>
                </label>
              </div>

              <!-- Erreur globale -->
              @if (saveError()) {
                <div class="save-error">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {{ saveError() }}
                </div>
              }

              <!-- Actions -->
              <div class="form-actions">
                <button type="button" class="btn btn-ghost" (click)="closeForm()">Annuler</button>
                <button type="submit" class="btn btn-primary" [disabled]="saving()">
                  @if (saving()) {
                    <span class="btn-spinner"></span> Enregistrement…
                  } @else {
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                    {{ editingUser() ? 'Enregistrer les modifications' : "Créer l'utilisateur" }}
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    /* ── Layout ─────────────────────────────────────────────── */
    .users-section { padding: 0; }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-xl);
    }

    .section-header h2 { margin: 0 0 4px; }
    .subtitle { font-size: 0.875rem; color: var(--color-text-light); margin: 0; }

    /* ── Loading / empty ─────────────────────────────────────── */
    .loading {
      display: flex;
      justify-content: center;
      padding: var(--spacing-4xl);
    }

    .spinner {
      width: 36px;
      height: 36px;
      border: 3px solid rgba(61,43,31,0.1);
      border-top-color: var(--color-primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .empty-state {
      text-align: center;
      padding: var(--spacing-4xl);
      color: var(--color-text-light);
    }

    .empty-state svg { margin-bottom: var(--spacing-lg); opacity: 0.3; }
    .empty-state p { margin: 0 0 var(--spacing-lg); }

    /* ── Tableau ─────────────────────────────────────────────── */
    .table-wrapper {
      background: white;
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-md);
      overflow: hidden;
    }

    .users-table {
      width: 100%;
      border-collapse: collapse;
    }

    .users-table th, .users-table td {
      padding: var(--spacing-md) var(--spacing-lg);
      text-align: left;
      border-bottom: 1px solid rgba(61,43,31,0.07);
    }

    .users-table th {
      background: var(--color-background);
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--color-text-light);
    }

    .users-table tbody tr:hover { background: var(--color-background); }
    .inactive-row { opacity: 0.6; }

    /* Cellule utilisateur */
    .user-cell { display: flex; align-items: center; gap: var(--spacing-md); }

    .user-avatar-sm {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.875rem;
      flex-shrink: 0;
    }

    .user-full-name { font-weight: 600; font-size: 0.9rem; line-height: 1.3; }
    .user-email-sm  { font-size: 0.8rem; color: var(--color-text-light); }

    /* Rôle */
    .role-chip {
      display: inline-block;
      padding: 3px 10px;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .role-administrator { background: #fee2e2; color: #dc2626; }
    .role-manager       { background: #ede9fe; color: #7c3aed; }
    .role-operator      { background: #dbeafe; color: #2563eb; }

    /* Status toggle */
    .status-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 0.875rem;
      color: var(--color-text-light);
      padding: 0;
    }

    .toggle-track {
      width: 36px;
      height: 20px;
      border-radius: 10px;
      background: #d1d5db;
      position: relative;
      transition: background 0.2s;
      display: block;
    }

    .status-toggle.active .toggle-track { background: #16a34a; }

    .toggle-thumb {
      position: absolute;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: white;
      top: 3px;
      left: 3px;
      transition: transform 0.2s;
      display: block;
    }

    .status-toggle.active .toggle-thumb { transform: translateX(16px); }

    /* Dernière connexion */
    .last-login { font-size: 0.875rem; color: var(--color-text-light); }
    .date-cell  { font-size: 0.875rem; color: var(--color-text-light); }

    /* Actions */
    .row-actions { display: flex; gap: var(--spacing-sm); }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 5px 10px;
      border: 1px solid rgba(61,43,31,0.2);
      border-radius: var(--radius-md);
      background: white;
      font-size: 0.8rem;
      cursor: pointer;
      color: var(--color-text-light);
      transition: all 0.15s;
    }

    .action-btn:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
      background: rgba(61,43,31,0.04);
    }

    .action-btn.danger:hover {
      border-color: #dc2626;
      color: #dc2626;
      background: #fef2f2;
    }

    /* ── Modal ───────────────────────────────────────────────── */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: var(--spacing-lg);
    }

    .modal-panel {
      background: white;
      border-radius: var(--radius-xl);
      width: 100%;
      max-width: 680px;
      max-height: 92vh;
      overflow-y: auto;
      box-shadow: 0 25px 60px rgba(0,0,0,0.25);
    }

    .modal-top {
      display: flex;
      align-items: center;
      gap: var(--spacing-lg);
      padding: var(--spacing-xl) var(--spacing-xl) var(--spacing-lg);
      border-bottom: 1px solid rgba(61,43,31,0.08);
      position: sticky;
      top: 0;
      background: white;
      z-index: 1;
    }

    .modal-avatar {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.1rem;
      flex-shrink: 0;
      transition: background 0.3s;
    }

    .modal-top h3 { margin: 0 0 2px; font-size: 1.1rem; }
    .modal-subtitle { font-size: 0.875rem; color: var(--color-text-light); margin: 0; }

    .modal-close {
      margin-left: auto;
      background: none;
      border: 1px solid rgba(61,43,31,0.15);
      border-radius: var(--radius-md);
      padding: var(--spacing-sm);
      cursor: pointer;
      color: var(--color-text-light);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s;
      flex-shrink: 0;
    }

    .modal-close:hover { border-color: var(--color-primary); color: var(--color-primary); }

    /* ── Formulaire ──────────────────────────────────────────── */
    .user-form { padding: var(--spacing-xl); display: flex; flex-direction: column; gap: var(--spacing-xl); }

    .form-section {
      border: 1px solid rgba(61,43,31,0.1);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
    }

    .form-section-title {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.7px;
      color: var(--color-text-light);
      margin: 0 0 var(--spacing-lg);
    }

    .section-hint {
      font-size: 0.75rem;
      font-weight: 400;
      text-transform: none;
      letter-spacing: 0;
      color: var(--color-text-light);
      margin-left: auto;
      font-style: italic;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-lg);
    }

    .form-group { display: flex; flex-direction: column; gap: 6px; }

    .form-group label {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-text);
    }

    .required { color: #dc2626; }

    .input-icon-wrap { position: relative; }

    .field-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--color-text-light);
      pointer-events: none;
    }

    .form-group input,
    .form-group select {
      padding: 10px 12px;
      border: 1.5px solid rgba(61,43,31,0.2);
      border-radius: var(--radius-md);
      font-size: 0.9rem;
      width: 100%;
      box-sizing: border-box;
      transition: border-color 0.15s;
    }

    .input-icon-wrap input { padding-left: 38px; padding-right: 38px; }

    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: var(--color-primary);
    }

    .has-error input, .has-error select {
      border-color: #dc2626;
    }

    .field-error {
      font-size: 0.8rem;
      color: #dc2626;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .field-ok {
      font-size: 0.8rem;
      color: #16a34a;
    }

    .toggle-pwd {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      color: var(--color-text-light);
      display: flex;
      align-items: center;
      padding: 2px;
    }

    .toggle-pwd:hover { color: var(--color-primary); }

    /* Indicateur de force */
    .pwd-strength {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      margin-top: 6px;
    }

    .strength-bars {
      display: flex;
      gap: 3px;
      flex: 1;
    }

    .strength-bar {
      height: 4px;
      flex: 1;
      border-radius: 2px;
      background: rgba(61,43,31,0.1);
      transition: background 0.2s;
    }

    .strength-bar.filled.level-1 { background: #dc2626; }
    .strength-bar.filled.level-2 { background: #f97316; }
    .strength-bar.filled.level-3 { background: #eab308; }
    .strength-bar.filled.level-4 { background: #22c55e; }
    .strength-bar.filled.level-5 { background: #16a34a; }

    .strength-label {
      font-size: 0.75rem;
      font-weight: 600;
      white-space: nowrap;
    }

    .strength-label.level-1 { color: #dc2626; }
    .strength-label.level-2 { color: #f97316; }
    .strength-label.level-3 { color: #eab308; }
    .strength-label.level-4 { color: #22c55e; }
    .strength-label.level-5 { color: #16a34a; }

    .pwd-rules {
      list-style: none;
      padding: 0;
      margin: var(--spacing-sm) 0 0;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .pwd-rules li {
      font-size: 0.75rem;
      color: var(--color-text-light);
      padding: 2px 8px;
      border-radius: var(--radius-full);
      background: rgba(61,43,31,0.06);
      transition: all 0.2s;
    }

    .pwd-rules li.ok {
      color: #16a34a;
      background: #dcfce7;
    }

    /* ── Cartes de rôle ──────────────────────────────────────── */
    .role-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-md);
    }

    .role-card {
      border: 2px solid rgba(61,43,31,0.12);
      border-radius: var(--radius-lg);
      padding: var(--spacing-md);
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
    }

    .role-card:hover {
      border-color: var(--role-color, var(--color-primary));
      background: var(--role-bg, var(--color-background));
      transform: translateY(-1px);
    }

    .role-card.selected {
      border-color: var(--role-color, var(--color-primary));
      background: var(--role-bg, var(--color-background));
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--role-color, var(--color-primary)) 15%, transparent);
    }

    .role-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-sm);
    }

    .role-icon-wrap {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .role-card-check {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid rgba(61,43,31,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .role-card.selected .role-card-check {
      background: var(--role-color, var(--color-primary));
      border-color: var(--role-color, var(--color-primary));
      color: white;
    }

    .role-card-title {
      font-size: 0.875rem;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .role-card-desc {
      font-size: 0.775rem;
      color: var(--color-text-light);
      line-height: 1.4;
      margin-bottom: var(--spacing-sm);
    }

    .role-perm-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .role-perm-list li {
      font-size: 0.725rem;
      color: var(--color-text-light);
      padding-left: 14px;
      position: relative;
      line-height: 1.4;
    }

    .role-perm-list li::before {
      content: '›';
      position: absolute;
      left: 0;
      color: var(--role-color, var(--color-primary));
      font-weight: 700;
    }

    /* ── Toggle de compte ────────────────────────────────────── */
    .toggle-label {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      cursor: pointer;
    }

    .toggle-switch {
      width: 48px;
      height: 26px;
      border-radius: 13px;
      background: #d1d5db;
      position: relative;
      cursor: pointer;
      transition: background 0.2s;
      flex-shrink: 0;
    }

    .toggle-switch.on { background: #16a34a; }

    .toggle-knob {
      position: absolute;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: white;
      top: 3px;
      left: 3px;
      transition: transform 0.2s;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }

    .toggle-switch.on .toggle-knob { transform: translateX(22px); }

    .toggle-text { display: block; font-weight: 600; font-size: 0.875rem; }
    .toggle-hint { display: block; font-size: 0.775rem; color: var(--color-text-light); }

    /* ── Erreur globale ──────────────────────────────────────── */
    .save-error {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-md) var(--spacing-lg);
      background: #fef2f2;
      border: 1px solid #fca5a5;
      border-radius: var(--radius-md);
      color: #dc2626;
      font-size: 0.875rem;
    }

    /* ── Actions du formulaire ───────────────────────────────── */
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-md);
      padding-top: var(--spacing-md);
      border-top: 1px solid rgba(61,43,31,0.08);
    }

    .btn-ghost {
      background: none;
      border: 1px solid rgba(61,43,31,0.2);
      color: var(--color-text-light);
      padding: var(--spacing-sm) var(--spacing-xl);
      border-radius: var(--radius-md);
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.15s;
    }

    .btn-ghost:hover { border-color: var(--color-primary); color: var(--color-primary); }

    .btn-spinner {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255,255,255,0.4);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      display: inline-block;
    }

    /* ── Responsive ──────────────────────────────────────────── */
    @media (max-width: 640px) {
      .form-row { grid-template-columns: 1fr; }
      .role-cards { grid-template-columns: 1fr; }
      .users-table { display: block; overflow-x: auto; }
    }
  `]
})
export class AdminUsersComponent implements OnInit {
  private userService = inject(UserService);
  private audit       = inject(AuditService);

  readonly roleDefs = ROLE_DEFS;

  // ── État ───────────────────────────────────────────────────────
  users      = signal<User[]>([]);
  loading    = signal(true);
  showForm   = signal(false);
  saving     = signal(false);
  saveError  = signal<string | null>(null);
  editingUser = signal<User | null>(null);

  // ── Champs du formulaire ───────────────────────────────────────
  firstName       = '';
  lastName        = '';
  confirmPassword = '';
  showPwd         = signal(false);
  showConfirm     = signal(false);
  errors          = signal<FormErrors>({});

  formData: { email: string; role: UserRole; password: string; is_active: boolean } = {
    email:     '',
    role:      'operator',
    password:  '',
    is_active: true
  };

  // ── Computed ───────────────────────────────────────────────────
  previewInitials = computed(() => {
    const first = this.firstName.trim();
    const last  = this.lastName.trim();
    if (!first && !last) return '?';
    return ((first[0] ?? '') + (last[0] ?? '')).toUpperCase();
  });

  previewAvatarColor = computed(() =>
    this.getRoleColor(this.formData.role)
  );

  pwdStrength = computed<number>(() => {
    const p = this.formData.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8)                    score++;
    if (p.length >= 12)                   score++;
    if (/[A-Z]/.test(p))                  score++;
    if (/[0-9]/.test(p))                  score++;
    if (/[^A-Za-z0-9]/.test(p))          score++;
    return Math.min(score, 5);
  });

  pwdStrengthLabel = computed(() => {
    const labels = ['', 'Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'];
    return labels[this.pwdStrength()] ?? '';
  });

  hasUppercase = computed(() => /[A-Z]/.test(this.formData.password));
  hasNumber    = computed(() => /[0-9]/.test(this.formData.password));
  hasSpecial   = computed(() => /[^A-Za-z0-9]/.test(this.formData.password));

  // ── Cycle de vie ───────────────────────────────────────────────
  async ngOnInit() { await this.loadUsers(); }

  async loadUsers() {
    try {
      this.loading.set(true);
      this.users.set(await this.userService.getAllUsers());
    } catch (e) {
      console.error('Error loading users:', e);
    } finally {
      this.loading.set(false);
    }
  }

  // ── Ouverture formulaire ───────────────────────────────────────
  openCreateForm() {
    this.editingUser.set(null);
    this.firstName = '';
    this.lastName  = '';
    this.confirmPassword = '';
    this.showPwd.set(false);
    this.showConfirm.set(false);
    this.errors.set({});
    this.saveError.set(null);
    this.formData = { email: '', role: 'operator', password: '', is_active: true };
    this.showForm.set(true);
  }

  openEditForm(user: User) {
    this.editingUser.set(user);
    const parts = user.name.split(' ');
    this.firstName = parts[0] ?? '';
    this.lastName  = parts.slice(1).join(' ');
    this.confirmPassword = '';
    this.showPwd.set(false);
    this.showConfirm.set(false);
    this.errors.set({});
    this.saveError.set(null);
    this.formData = {
      email:    user.email,
      role:     user.role,
      password: '',
      is_active: user.is_active
    };
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingUser.set(null);
  }

  clearError(field: keyof FormErrors) {
    this.errors.update(e => ({ ...e, [field]: undefined }));
  }

  // ── Validation ─────────────────────────────────────────────────
  private validate(): boolean {
    const errs: FormErrors = {};

    if (!this.firstName.trim()) errs.firstName = 'Le prénom est requis';
    if (!this.lastName.trim())  errs.lastName  = 'Le nom est requis';

    if (!this.formData.email.trim()) {
      errs.email = 'L\'adresse email est requise';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.formData.email)) {
      errs.email = 'Adresse email invalide';
    }

    const isCreate  = !this.editingUser();
    const hasPwd    = !!this.formData.password;

    if (isCreate || hasPwd) {
      if (!this.formData.password) {
        errs.password = 'Le mot de passe est requis';
      } else if (this.formData.password.length < 8) {
        errs.password = 'Minimum 8 caractères';
      }
      if (!this.confirmPassword) {
        errs.confirmPassword = 'Veuillez confirmer le mot de passe';
      } else if (this.confirmPassword !== this.formData.password) {
        errs.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
    }

    this.errors.set(errs);
    return Object.keys(errs).length === 0;
  }

  // ── Sauvegarde ─────────────────────────────────────────────────
  async saveUser() {
    if (!this.validate()) return;

    this.saving.set(true);
    this.saveError.set(null);

    const fullName = `${this.firstName.trim()} ${this.lastName.trim().toUpperCase()}`;

    try {
      if (this.editingUser()) {
        const payload: UpdateUserDto = {
          name:      fullName,
          email:     this.formData.email,
          role:      this.formData.role,
          is_active: this.formData.is_active
        };
        if (this.formData.password) payload.password = this.formData.password;

        await this.userService.updateUser(this.editingUser()!.id, payload);
        await this.audit.update('user', this.editingUser()!.id, fullName, {
          role: this.formData.role,
          is_active: this.formData.is_active
        });
      } else {
        const created = await this.userService.createUser({
          name:      fullName,
          email:     this.formData.email,
          role:      this.formData.role,
          password:  this.formData.password,
          is_active: this.formData.is_active
        } as CreateUserDto);
        await this.audit.create('user', created.id, fullName, { role: this.formData.role });
      }

      await this.loadUsers();
      this.closeForm();
    } catch (e: any) {
      const msg = e?.message ?? '';
      if (msg.includes('duplicate') || msg.includes('unique')) {
        this.saveError.set('Cette adresse email est déjà utilisée par un autre compte.');
      } else {
        this.saveError.set('Une erreur est survenue lors de l\'enregistrement. Veuillez réessayer.');
      }
    } finally {
      this.saving.set(false);
    }
  }

  // ── Actions rapides ────────────────────────────────────────────
  async toggleStatus(user: User) {
    try {
      await this.userService.toggleUserStatus(user.id, !user.is_active);
      await this.audit.update('user', user.id, user.name,
        { is_active: !user.is_active }
      );
      await this.loadUsers();
    } catch (e) {
      console.error('Error toggling user status:', e);
    }
  }

  async deleteUser(user: User) {
    if (!confirm(`Supprimer définitivement le compte de ${user.name} ?\nCette action est irréversible.`)) return;
    try {
      await this.userService.deleteUser(user.id);
      await this.audit.delete('user', user.id, user.name);
      await this.loadUsers();
    } catch (e) {
      console.error('Error deleting user:', e);
    }
  }

  // ── Helpers affichage ──────────────────────────────────────────
  getRoleLabel(role: string): string {
    return ROLE_DEFS.find(r => r.value === role)?.label ?? role;
  }

  getRoleColor(role: string): string {
    return ROLE_DEFS.find(r => r.value === role)?.color ?? '#6b7280';
  }

  getInitials(name: string): string {
    return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
  }

  formatLastLogin(date: string | null): string {
    if (!date) return 'Jamais connecté';
    const d    = new Date(date);
    const now  = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (diff < 60)            return 'À l\'instant';
    if (diff < 3600)          return `Il y a ${Math.floor(diff / 60)} min`;
    if (diff < 86400)         return `Il y a ${Math.floor(diff / 3600)} h`;
    if (diff < 86400 * 7)     return `Il y a ${Math.floor(diff / 86400)} j`;
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
