import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  AdminService, Booking, RentalBooking, TransferBooking, ContactMessage, AdminTab
} from '../../core/services/admin.service';
import { AuditService } from '../../core/services/audit.service';
import { LanguageService } from '../../core/services/language.service';
import { CurrencyService, type Currency } from '../../core/services/currency.service';
import { CurrencyConverterPipe } from '../../shared/pipes/currency-converter.pipe';
import { AdminCircuitsComponent } from './admin-circuits.component';
import { AdminExcursionsComponent } from './admin-excursions.component';
import { AdminPromotionsComponent } from './admin-promotions.component';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AdminImagesComponent } from './admin-images.component';
import { AdminUsersComponent } from './admin-users.component';
import { AdminRentalsComponent } from './admin-rentals.component';
import { AdminAuditComponent } from './admin-audit.component';
import { EditModeService } from '../../core/services/edit-mode.service';

// Étiquettes des onglets
const TAB_LABELS: Record<AdminTab, string> = {
  dashboard:  'Tableau de bord',
  bookings:   'Réservations',
  messages:   'Messages',
  circuits:   'Circuits',
  excursions: 'Excursions',
  rentals:    'Locations',
  promotions: 'Promotions',
  images:     'Images',
  users:      'Utilisateurs',
  content:    'Contenu',
  audit:      'Journal d\'audit'
};

// Couleur des badges de rôle
const ROLE_COLORS: Record<string, string> = {
  administrator: '#dc2626',
  manager:       '#7c3aed',
  operator:      '#2563eb'
};

const ROLE_LABELS: Record<string, string> = {
  administrator: 'Super-Admin',
  manager:       'Manager',
  operator:      'Opérateur'
};

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    FormsModule, DatePipe, DecimalPipe, RouterLink,
    AdminCircuitsComponent, AdminExcursionsComponent,
    AdminPromotionsComponent, AdminDashboardComponent,
    AdminImagesComponent, AdminUsersComponent,
    AdminRentalsComponent, AdminAuditComponent,
    CurrencyConverterPipe
  ],
  template: `
    <div class="admin-container">

      <!-- ══ ÉCRAN DE CONNEXION ════════════════════════════════════════════════ -->
      @if (!adminService.isAuthenticated()) {
        <div class="login-wrapper">
          <div class="login-card">
            <div class="login-header">
              <div class="login-logo">NF</div>
              <h1>NIO FAR</h1>
              <p>Espace d'administration</p>
            </div>

            <form (ngSubmit)="login()" class="login-form">
              <div class="form-group">
                <label for="email">Adresse email</label>
                <div class="input-wrapper">
                  <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input
                    type="email" id="email" name="email"
                    [(ngModel)]="email"
                    placeholder="votre@email.com"
                    autocomplete="email"
                    required
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="password">Mot de passe</label>
                <div class="input-wrapper">
                  <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    [type]="showPassword() ? 'text' : 'password'"
                    id="password" name="password"
                    [(ngModel)]="password"
                    placeholder="••••••••"
                    autocomplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    class="btn-toggle-password"
                    [attr.aria-label]="showPassword() ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
                    (click)="showPassword.set(!showPassword())"
                  >
                    @if (showPassword()) {
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    } @else {
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    }
                  </button>
                </div>
              </div>

              @if (loginError()) {
                <div class="alert alert-error">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {{ loginError() }}
                </div>
              }

              <button type="submit" class="btn btn-primary btn-login" [disabled]="loginLoading()">
                @if (loginLoading()) {
                  <span class="btn-spinner"></span> Connexion…
                } @else {
                  Se connecter
                }
              </button>
            </form>
          </div>
        </div>

      <!-- ══ BACKOFFICE AUTHENTIFIÉ ════════════════════════════════════════════ -->
      } @else {
        <header class="admin-header">
          <div class="header-left">
            <span class="header-brand">NIO FAR</span>
            <span class="header-sep">|</span>
            <span class="header-section">{{ TAB_LABELS[activeTab()] }}</span>
          </div>

          <div class="header-right">
            <!-- Sélecteur de devise -->
            <div class="currency-switcher" title="Devise d'affichage">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              <select class="currency-select" [value]="currencyService.getCurrency()()" (change)="onCurrencyChange($event)">
                @for (c of currencyService.getAllCurrencies(); track c.code) {
                  <option [value]="c.code">{{ c.code }} ({{ c.symbol }})</option>
                }
              </select>
            </div>

            <!-- Utilisateur connecté -->
            <div class="user-info">
              <div class="user-avatar">{{ userInitials() }}</div>
              <div class="user-details">
                <span class="user-name">{{ adminService.currentUser()?.name }}</span>
                <span class="user-role-badge" [style.background]="roleColor()">
                  {{ roleLabel() }}
                </span>
              </div>
            </div>

            <!-- Mode édition (admin / operator seulement) -->
            @if (!adminService.isManager()) {
              <button
                class="btn btn-toggle"
                [class.active]="editMode.isEditMode()"
                (click)="editMode.toggleEditMode()"
              >
                @if (editMode.isEditMode()) {
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Mode Édition Actif
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Mode Édition
                }
              </button>
            }

            <button class="btn btn-outline" (click)="logout()">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Déconnexion
            </button>
          </div>
        </header>

        <div class="admin-content">

          <!-- Onglets filtrés par rôle -->
          <nav class="tabs">
            @for (tab of adminService.allowedTabs(); track tab) {
              <button
                class="tab"
                [class.active]="activeTab() === tab"
                (click)="setTab(tab)"
              >
                {{ TAB_LABELS[tab] }}
                @if (tab === 'bookings' && allBookingsCount() > 0) {
                  <span class="badge">{{ allBookingsCount() }}</span>
                }
                @if (tab === 'messages' && messages().length > 0) {
                  <span class="badge">{{ messages().length }}</span>
                }
              </button>
            }
          </nav>


          @if (isLoading()) {
            <div class="loading">
              <div class="spinner"></div>
              <p>Chargement…</p>
            </div>
          } @else {

            <!-- Dashboard -->
            @if (activeTab() === 'dashboard') {
              <app-admin-dashboard />
            }

            <!-- Réservations -->
            @if (activeTab() === 'bookings') {
              <div class="booking-filters">
                <button class="filter-btn" [class.active]="bookingFilter() === 'all'" (click)="bookingFilter.set('all')">
                  Tous ({{ allBookingsCount() }})
                </button>
                <button class="filter-btn" [class.active]="bookingFilter() === 'circuits'" (click)="bookingFilter.set('circuits')">
                  Circuits ({{ bookings().length }})
                </button>
                <button class="filter-btn" [class.active]="bookingFilter() === 'rentals'" (click)="bookingFilter.set('rentals')">
                  Locations ({{ rentalBookings().length }})
                </button>
                <button class="filter-btn" [class.active]="bookingFilter() === 'transfers'" (click)="bookingFilter.set('transfers')">
                  Transferts ({{ transferBookings().length }})
                </button>
              </div>

              <!-- Réservations Circuits -->
              @if ((bookingFilter() === 'all' || bookingFilter() === 'circuits') && bookings().length > 0) {
                <h3 class="booking-section-title">Réservations Circuits</h3>
                <div class="table-container">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>Référence</th>
                        <th>Client</th>
                        <th>Circuit / Excursion</th>
                        <th>Date</th>
                        <th>Voyageurs</th>
                        <th>Total</th>
                        <th>Statut</th>
                        @if (adminService.canEditBookings()) { <th>Actions</th> }
                      </tr>
                    </thead>
                    <tbody>
                      @for (booking of bookings(); track booking.id) {
                        <tr>
                          <td><span class="reference">{{ booking.reference_number }}</span></td>
                          <td>
                            <div class="client-info">
                              <span class="client-name">{{ booking.first_name }} {{ booking.last_name }}</span>
                              <span class="client-email">{{ booking.email }}</span>
                              <span class="client-country">{{ booking.country }}</span>
                            </div>
                          </td>
                          <td>{{ booking.excursion_title }}</td>
                          <td>
                            <div class="date-info">
                              <span>{{ booking.start_date | date:'dd/MM/yyyy' }}</span>
                              @if (booking.end_date) { <span> – {{ booking.end_date | date:'dd/MM/yyyy' }}</span> }
                            </div>
                          </td>
                          <td>{{ booking.adults }}A@if (booking.children > 0) { / {{ booking.children }}E}</td>
                          <td><span class="total">{{ booking.estimated_total | currencyConverter }}</span></td>
                          <td>
                            <span class="status-badge" [class]="'status-' + booking.status">{{ statusLabel(booking.status) }}</span>
                            @if (booking.paid_at) { <span class="paid-badge">Payé</span> }
                          </td>
                          @if (adminService.canEditBookings()) {
                            <td>
                              <div class="actions">
                                <select [value]="booking.status" (change)="updateStatus(booking.id, $event)" class="status-select">
                                  <option value="pending_payment">En attente paiement</option>
                                  <option value="pending">En attente</option>
                                  <option value="confirmed">Confirmé</option>
                                  <option value="cancelled">Annulé</option>
                                </select>
                                @if (booking.special_requests) {
                                  <button class="btn-icon" title="Notes" (click)="showNotes(booking)">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                  </button>
                                }
                                <button class="btn-icon btn-danger" title="Supprimer" (click)="deleteBooking(booking.id, booking.reference_number)">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                </button>
                              </div>
                            </td>
                          }
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              }

              <!-- Réservations Locations -->
              @if ((bookingFilter() === 'all' || bookingFilter() === 'rentals') && rentalBookings().length > 0) {
                <h3 class="booking-section-title">Réservations Locations</h3>
                <div class="table-container">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>Référence</th><th>Client</th><th>Véhicule</th>
                        <th>Départ / Durée</th><th>Avec chauffeur</th><th>Total</th><th>Statut</th>
                        @if (adminService.canEditBookings()) { <th>Actions</th> }
                      </tr>
                    </thead>
                    <tbody>
                      @for (rb of rentalBookings(); track rb.id) {
                        <tr>
                          <td><span class="reference">{{ rb.reference_number }}</span></td>
                          <td>
                            <div class="client-info">
                              <span class="client-name">{{ rb.first_name }} {{ rb.last_name }}</span>
                              <span class="client-email">{{ rb.email }}</span>
                              <span class="client-country">{{ rb.country }}</span>
                            </div>
                          </td>
                          <td><span>{{ rb.rental_title }}</span><span class="client-country">{{ rb.rental_type }}</span></td>
                          <td>
                            <div class="date-info">
                              <span>{{ rb.start_date | date:'dd/MM/yyyy' }}</span>
                              <span class="client-country">{{ rb.days }} jour(s)</span>
                            </div>
                          </td>
                          <td>{{ rb.with_driver ? 'Oui' : 'Non' }}</td>
                          <td><span class="total">{{ rb.estimated_total | currencyConverter }}</span></td>
                          <td>
                            <span class="status-badge" [class]="'status-' + rb.status">{{ statusLabel(rb.status) }}</span>
                            @if (rb.paid_at) { <span class="paid-badge">Payé</span> }
                          </td>
                          @if (adminService.canEditBookings()) {
                            <td>
                              <div class="actions">
                                <select [value]="rb.status" (change)="updateRentalStatus(rb.id, $event)" class="status-select">
                                  <option value="pending_payment">En attente paiement</option>
                                  <option value="pending">En attente</option>
                                  <option value="confirmed">Confirmé</option>
                                  <option value="cancelled">Annulé</option>
                                </select>
                                @if (rb.special_requests) {
                                  <button class="btn-icon" title="Notes" (click)="showRentalNotes(rb)">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                  </button>
                                }
                                <button class="btn-icon btn-danger" title="Supprimer" (click)="deleteRentalBooking(rb.id, rb.reference_number)">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                </button>
                              </div>
                            </td>
                          }
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              }

              <!-- Réservations Transferts -->
              @if ((bookingFilter() === 'all' || bookingFilter() === 'transfers') && transferBookings().length > 0) {
                <h3 class="booking-section-title">Réservations Transferts</h3>
                <div class="table-container">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>Référence</th><th>Client</th><th>Direction</th>
                        <th>Vol / Date</th><th>Hôtel</th><th>Pax / Bag.</th><th>Statut</th>
                        @if (adminService.canEditBookings()) { <th>Actions</th> }
                      </tr>
                    </thead>
                    <tbody>
                      @for (tb of transferBookings(); track tb.id) {
                        <tr>
                          <td><span class="reference">{{ tb.reference_number }}</span></td>
                          <td>
                            <div class="client-info">
                              <span class="client-name">{{ tb.first_name }} {{ tb.last_name }}</span>
                              <span class="client-email">{{ tb.email }}</span>
                              <span class="client-country">{{ tb.country }}</span>
                            </div>
                          </td>
                          <td>
                            <span class="direction-badge" [class.dir-in]="tb.direction === 'airport_to_hotel'">
                              {{ tb.direction === 'airport_to_hotel' ? '✈→🏨' : '🏨→✈' }}
                            </span>
                            <span class="client-country">{{ tb.vehicle_type }}</span>
                          </td>
                          <td>
                            <div class="date-info">
                              <span>{{ tb.flight_date | date:'dd/MM/yyyy' }} {{ tb.flight_time }}</span>
                              @if (tb.flight_number) { <span class="client-country">{{ tb.flight_number }}</span> }
                            </div>
                          </td>
                          <td>{{ tb.hotel_name }}</td>
                          <td>{{ tb.passengers }}P / {{ tb.luggage }}B</td>
                          <td>
                            <span class="status-badge" [class]="'status-' + tb.status">{{ statusLabel(tb.status) }}</span>
                            @if (tb.paid_at) { <span class="paid-badge">Payé</span> }
                          </td>
                          @if (adminService.canEditBookings()) {
                            <td>
                              <div class="actions">
                                <select [value]="tb.status" (change)="updateTransferStatus(tb.id, $event)" class="status-select">
                                  <option value="pending_payment">En attente paiement</option>
                                  <option value="pending">En attente</option>
                                  <option value="confirmed">Confirmé</option>
                                  <option value="cancelled">Annulé</option>
                                </select>
                                @if (tb.special_requests) {
                                  <button class="btn-icon" title="Notes" (click)="showTransferNotes(tb)">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                  </button>
                                }
                                <button class="btn-icon btn-danger" title="Supprimer" (click)="deleteTransferBooking(tb.id, tb.reference_number)">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                </button>
                              </div>
                            </td>
                          }
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              }

              @if (allBookingsCount() === 0) {
                <div class="empty-state"><p>Aucune réservation pour le moment.</p></div>
              }
            }

            <!-- Messages -->
            @if (activeTab() === 'messages') {
              <div class="messages-grid">
                @if (messages().length === 0) {
                  <div class="empty-state"><p>Aucun message pour le moment.</p></div>
                } @else {
                  @for (message of messages(); track message.id) {
                    <div class="message-card">
                      <div class="message-header">
                        <div class="sender-info">
                          <span class="sender-name">{{ message.name }}</span>
                          <span class="sender-country">{{ message.country }}</span>
                        </div>
                        <span class="message-date">{{ message.created_at | date:'dd/MM/yyyy HH:mm' }}</span>
                      </div>
                      <div class="sender-email">{{ message.email }}</div>
                      <div class="message-content">{{ message.message }}</div>
                      <div class="message-actions">
                        <a [href]="'mailto:' + message.email" class="btn btn-small btn-primary">Répondre</a>
                        <button class="btn btn-small btn-outline" (click)="deleteMessage(message.id, message.name)">Supprimer</button>
                      </div>
                    </div>
                  }
                }
              </div>
            }

            @if (activeTab() === 'circuits')    { <app-admin-circuits /> }
            @if (activeTab() === 'excursions')  { <app-admin-excursions /> }
            @if (activeTab() === 'rentals')     { <app-admin-rentals /> }
            @if (activeTab() === 'promotions')  { <app-admin-promotions /> }
            @if (activeTab() === 'images')      { <app-admin-images /> }
            @if (activeTab() === 'users')       { <app-admin-users /> }
            @if (activeTab() === 'audit')       { <app-admin-audit /> }

            @if (activeTab() === 'content') {
              <div class="content-info card">
                <h2>Mode Édition du Contenu</h2>
                <p>Pour modifier le contenu statique des pages :</p>
                <ol>
                  <li>Cliquez sur <strong>Mode Édition</strong> en haut de la page</li>
                  <li>Utilisez les liens rapides ci-dessous pour accéder aux pages</li>
                  <li>Cliquez sur les textes encadrés en orange pour les éditer</li>
                  <li>Les modifications sont sauvegardées automatiquement</li>
                  <li>Désactivez le mode édition une fois terminé</li>
                </ol>
                <div class="quick-nav">
                  <h3>Navigation Rapide</h3>
                  <div class="quick-nav-grid">
                    @for (page of quickNavPages; track page.route) {
                      <a [routerLink]="page.route" class="quick-nav-card" (click)="activateEditMode()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path [attr.d]="page.icon"/></svg>
                        <span>{{ page.label }}</span>
                      </a>
                    }
                  </div>
                </div>
              </div>
            }
          }
        </div>

        <!-- Modal notes -->
        @if (showNotesModal()) {
          <div class="modal-overlay" (click)="closeNotes()">
            <div class="modal" (click)="$event.stopPropagation()">
              <div class="modal-header">
                <h3>Demandes spéciales</h3>
                <button class="btn-close" (click)="closeNotes()">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <div class="modal-body"><p>{{ notesText() }}</p></div>
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    /* ── Conteneur global ─────────────────────────────────────── */
    .admin-container {
      min-height: 100vh;
      background: var(--color-background);
    }

    /* ── Login ────────────────────────────────────────────────── */
    .login-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-xl);
      background: linear-gradient(135deg, var(--color-primary) 0%, #1a3a3a 100%);
    }

    .login-card {
      background: var(--color-white);
      border-radius: var(--radius-xl);
      padding: var(--spacing-2xl);
      width: 100%;
      max-width: 420px;
      box-shadow: 0 25px 60px rgba(0,0,0,0.3);
    }

    .login-header {
      text-align: center;
      margin-bottom: var(--spacing-xl);
    }

    .login-logo {
      width: 56px;
      height: 56px;
      background: var(--color-primary);
      color: white;
      border-radius: var(--radius-lg);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.2rem;
      margin-bottom: var(--spacing-md);
    }

    .login-header h1 {
      font-size: 1.75rem;
      color: var(--color-primary);
      margin: 0 0 var(--spacing-xs);
    }

    .login-header p {
      color: var(--color-text-light);
      font-size: 0.9rem;
    }

    .login-form .form-group {
      margin-bottom: var(--spacing-lg);
    }

    .login-form label {
      display: block;
      margin-bottom: var(--spacing-sm);
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--color-text);
    }

    .input-wrapper {
      position: relative;
    }

    .input-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--color-text-light);
      pointer-events: none;
    }

    .btn-toggle-password {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: transparent;
      border: none;
      cursor: pointer;
      color: var(--color-text-light);
      padding: 4px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      transition: color var(--transition-fast);
    }

    .btn-toggle-password:hover {
      color: var(--color-primary);
    }

    .login-form input {
      width: 100%;
      padding: var(--spacing-md) 44px var(--spacing-md) 46px;
      border: 2px solid rgba(61, 43, 31, 0.15);
      border-radius: var(--radius-md);
      font-size: 1rem;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }

    .login-form input:focus {
      outline: none;
      border-color: var(--color-primary);
    }

    .btn-login {
      width: 100%;
      padding: var(--spacing-md);
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
    }

    .btn-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.4);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    /* ── Header backoffice ─────────────────────────────────────── */
    .admin-header {
      background: var(--color-white);
      padding: var(--spacing-md) var(--spacing-xl);
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: var(--shadow-sm);
      position: sticky;
      top: 0;
      z-index: 100;
      border-bottom: 1px solid rgba(61,43,31,0.08);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .header-brand {
      font-weight: 800;
      font-size: 1.1rem;
      color: var(--color-primary);
      letter-spacing: 1px;
    }

    .header-sep {
      color: rgba(61,43,31,0.2);
    }

    .header-section {
      color: var(--color-text-light);
      font-size: 0.9rem;
    }

    .header-right {
      display: flex;
      gap: var(--spacing-md);
      align-items: center;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-sm) var(--spacing-md);
      background: var(--color-background);
      border-radius: var(--radius-lg);
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--color-primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.85rem;
      flex-shrink: 0;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .user-name {
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--color-text);
      line-height: 1.2;
    }

    .user-role-badge {
      font-size: 0.7rem;
      font-weight: 700;
      color: white;
      padding: 1px 8px;
      border-radius: var(--radius-full);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .btn-toggle {
      background: transparent;
      border: 2px solid var(--color-accent);
      color: var(--color-accent);
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-weight: 600;
      font-size: 0.875rem;
    }

    .btn-toggle:hover { background: rgba(196,159,74,0.1); }
    .btn-toggle.active { background: var(--color-accent); color: white; }

    .btn-outline {
      background: transparent;
      border: 2px solid rgba(61,43,31,0.3);
      color: var(--color-text-light);
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-size: 0.875rem;
    }

    .btn-outline:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }

    .currency-switcher {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px 4px 12px;
      background: var(--color-background);
      border-radius: var(--radius-md);
      color: var(--color-text-light);
    }
    .currency-switcher svg { flex-shrink: 0; }
    .currency-select {
      background: transparent;
      border: none;
      font-weight: 600;
      font-size: 0.85rem;
      color: var(--color-text);
      cursor: pointer;
      outline: none;
      padding: 6px 4px;
    }
    .currency-select:focus { outline: none; }

    /* ── Contenu ───────────────────────────────────────────────── */
    .admin-content {
      padding: var(--spacing-xl);
      max-width: 1400px;
      margin: 0 auto;
    }

    /* ── Onglets ───────────────────────────────────────────────── */
    .tabs {
      display: flex;
      gap: var(--spacing-xs);
      flex-wrap: wrap;
      margin-bottom: var(--spacing-lg);
      background: var(--color-white);
      padding: var(--spacing-sm);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
    }

    .tab {
      padding: var(--spacing-sm) var(--spacing-md);
      border: none;
      background: transparent;
      border-radius: var(--radius-md);
      cursor: pointer;
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--color-text-light);
      transition: all var(--transition-fast);
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      white-space: nowrap;
    }

    .tab:hover { color: var(--color-text); background: var(--color-background); }
    .tab.active { background: var(--color-primary); color: white; }
    .tab.active .badge { background: white; color: var(--color-primary); }

    .badge {
      background: var(--color-primary);
      color: white;
      padding: 1px 7px;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
    }


    /* ── Loading ───────────────────────────────────────────────── */
    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-4xl);
      color: var(--color-text-light);
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(61,43,31,0.1);
      border-top-color: var(--color-primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: var(--spacing-md);
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    /* ── Tableau ───────────────────────────────────────────────── */
    .table-container {
      background: white;
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-md);
      overflow: hidden;
      margin-bottom: var(--spacing-xl);
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table th, .data-table td {
      padding: var(--spacing-md);
      text-align: left;
      border-bottom: 1px solid rgba(61,43,31,0.08);
    }

    .data-table th {
      background: var(--color-background);
      font-weight: 600;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .data-table tbody tr:hover { background: var(--color-background); }

    /* ── Cellules ──────────────────────────────────────────────── */
    .reference {
      font-family: monospace;
      font-weight: 600;
      color: var(--color-primary);
      background: var(--color-background);
      padding: 2px 7px;
      border-radius: var(--radius-sm);
      font-size: 0.85rem;
    }

    .client-info { display: flex; flex-direction: column; gap: 2px; }
    .client-name { font-weight: 600; }
    .client-email { font-size: 0.85rem; color: var(--color-text-light); }
    .client-country { font-size: 0.8rem; color: var(--color-text-light); }
    .date-info { display: flex; flex-direction: column; font-size: 0.9rem; }
    .total { font-weight: 600; }

    .status-badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
    }

    .status-pending        { background: rgba(196,159,74,0.15); color: #b8860b; }
    .status-confirmed      { background: rgba(74,155,109,0.15); color: var(--color-success); }
    .status-cancelled      { background: rgba(196,91,74,0.15);  color: var(--color-error); }
    .status-pending_payment { background: rgba(196,104,43,0.12); color: var(--color-primary); }

    .paid-badge {
      display: inline-block;
      margin-left: 4px;
      padding: 1px 6px;
      border-radius: var(--radius-full);
      font-size: 0.7rem;
      font-weight: 700;
      background: rgba(74,155,109,0.15);
      color: var(--color-success);
      text-transform: uppercase;
    }

    /* ── Actions ───────────────────────────────────────────────── */
    .actions { display: flex; align-items: center; gap: var(--spacing-sm); }

    .status-select {
      padding: var(--spacing-sm);
      border: 1px solid rgba(61,43,31,0.2);
      border-radius: var(--radius-md);
      font-size: 0.85rem;
      cursor: pointer;
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

    .btn-icon:hover { background: var(--color-background); color: var(--color-primary); }
    .btn-danger:hover { background: rgba(196,91,74,0.1); color: var(--color-error); }

    /* ── Filtres réservations ──────────────────────────────────── */
    .booking-filters {
      display: flex;
      gap: var(--spacing-sm);
      flex-wrap: wrap;
      margin-bottom: var(--spacing-xl);
    }

    .filter-btn {
      padding: var(--spacing-sm) var(--spacing-lg);
      border-radius: var(--radius-full);
      border: 1px solid rgba(61,43,31,0.2);
      background: white;
      color: var(--color-text-light);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .filter-btn.active, .filter-btn:hover {
      background: var(--color-primary);
      color: white;
      border-color: var(--color-primary);
    }

    .booking-section-title {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--color-text-light);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: var(--spacing-xl) 0 var(--spacing-md);
      padding-bottom: var(--spacing-sm);
      border-bottom: 1px solid rgba(61,43,31,0.1);
    }

    /* ── Messages ──────────────────────────────────────────────── */
    .messages-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: var(--spacing-lg);
    }

    .message-card {
      background: white;
      border-radius: var(--radius-xl);
      padding: var(--spacing-xl);
      box-shadow: var(--shadow-md);
    }

    .message-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-sm);
    }

    .sender-info { display: flex; flex-direction: column; }
    .sender-name { font-weight: 600; }
    .sender-country { font-size: 0.85rem; color: var(--color-text-light); }
    .message-date { font-size: 0.8rem; color: var(--color-text-light); }
    .sender-email { font-size: 0.9rem; color: var(--color-secondary); margin-bottom: var(--spacing-md); }
    .message-content {
      color: var(--color-text);
      line-height: 1.6;
      margin-bottom: var(--spacing-lg);
      padding: var(--spacing-md);
      background: var(--color-background);
      border-radius: var(--radius-md);
    }

    .message-actions { display: flex; gap: var(--spacing-sm); }
    .btn-small { padding: var(--spacing-sm) var(--spacing-md); font-size: 0.85rem; }

    /* ── Alerts ────────────────────────────────────────────────── */
    .alert {
      padding: var(--spacing-md);
      border-radius: var(--radius-md);
      margin-bottom: var(--spacing-lg);
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-size: 0.9rem;
    }

    .alert-error {
      background: rgba(196,91,74,0.12);
      color: var(--color-error);
      border: 1px solid var(--color-error);
    }

    /* ── Modal ─────────────────────────────────────────────────── */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: var(--spacing-xl);
    }

    .modal {
      background: white;
      border-radius: var(--radius-xl);
      width: 100%;
      max-width: 500px;
      max-height: 80vh;
      overflow: hidden;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-lg) var(--spacing-xl);
      border-bottom: 1px solid rgba(61,43,31,0.1);
    }

    .modal-header h3 { margin: 0; }

    .btn-close {
      background: transparent;
      border: none;
      cursor: pointer;
      color: var(--color-text-light);
      padding: var(--spacing-sm);
      border-radius: var(--radius-md);
    }

    .btn-close:hover { background: var(--color-background); color: var(--color-text); }
    .modal-body { padding: var(--spacing-xl); overflow-y: auto; }
    .modal-body p { white-space: pre-wrap; line-height: 1.6; }

    /* ── Contenu CMS ───────────────────────────────────────────── */
    .content-info {
      background: white;
      padding: var(--spacing-2xl);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-md);
    }

    .content-info h2 { color: var(--color-primary); margin-bottom: var(--spacing-lg); }
    .content-info p { color: var(--color-text); line-height: 1.6; margin-bottom: var(--spacing-md); }
    .content-info ol { margin: var(--spacing-lg) 0; padding-left: var(--spacing-xl); color: var(--color-text); }
    .content-info li { margin-bottom: var(--spacing-sm); line-height: 1.6; }

    .quick-nav { margin: var(--spacing-2xl) 0; }
    .quick-nav h3 { color: var(--color-text); margin-bottom: var(--spacing-lg); font-size: 1.1rem; }

    .quick-nav-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: var(--spacing-md);
    }

    .quick-nav-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-lg);
      background: var(--color-background);
      border: 2px solid transparent;
      border-radius: var(--radius-lg);
      text-decoration: none;
      color: var(--color-text);
      transition: all var(--transition-fast);
      cursor: pointer;
    }

    .quick-nav-card:hover {
      border-color: var(--color-primary);
      background: white;
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }

    .quick-nav-card svg { color: var(--color-primary); }
    .quick-nav-card span { font-weight: 600; font-size: 0.875rem; text-align: center; }

    /* ── Direction badge ───────────────────────────────────────── */
    .direction-badge { font-size: 1rem; display: block; }
    .dir-in { color: var(--color-secondary); }

    /* ── Empty state ───────────────────────────────────────────── */
    .empty-state {
      padding: var(--spacing-4xl);
      text-align: center;
      color: var(--color-text-light);
    }

    /* ── Responsive ────────────────────────────────────────────── */
    @media (max-width: 992px) {
      .data-table { display: block; overflow-x: auto; }
    }

    @media (max-width: 600px) {
      .admin-header { flex-direction: column; gap: var(--spacing-md); }
      .user-info { display: none; }
      .messages-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class AdminComponent implements OnInit {
  readonly TAB_LABELS = TAB_LABELS;

  adminService = inject(AdminService);
  private audit  = inject(AuditService);
  lang     = inject(LanguageService);
  editMode = inject(EditModeService);
  currencyService = inject(CurrencyService);

  onCurrencyChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.currencyService.setCurrency(select.value as Currency);
  }

  // ── État login ────────────────────────────────────────────────
  email    = '';
  password = '';
  loginError    = signal<string | false>(false);
  loginLoading  = signal(false);
  showPassword  = signal(false);

  // ── État de l'UI ──────────────────────────────────────────────
  isLoading      = signal(false);
  activeTab      = signal<AdminTab>('dashboard');
  bookingFilter  = signal<'all' | 'circuits' | 'rentals' | 'transfers'>('all');
  bookings       = signal<Booking[]>([]);
  rentalBookings = signal<RentalBooking[]>([]);
  transferBookings = signal<TransferBooking[]>([]);
  messages       = signal<ContactMessage[]>([]);
  showNotesModal = signal(false);
  notesText      = signal<string | null>(null);

  // ── Computed ──────────────────────────────────────────────────
  allBookingsCount = computed(() =>
    this.bookings().length + this.rentalBookings().length + this.transferBookings().length
  );

  userInitials = computed(() => {
    const name = this.adminService.currentUser()?.name ?? '';
    return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
  });

  roleColor = computed(() =>
    ROLE_COLORS[this.adminService.currentUser()?.role ?? ''] ?? '#6b7280'
  );

  roleLabel = computed(() =>
    ROLE_LABELS[this.adminService.currentUser()?.role ?? ''] ?? ''
  );

  // ── Navigation rapide CMS ─────────────────────────────────────
  readonly quickNavPages = [
    { route: '/',           label: 'Accueil',          icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
    { route: '/services',   label: 'Services',         icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20' },
    { route: '/experiences',label: 'Expériences',      icon: 'M3 3h18v18H3z' },
    { route: '/circuits',   label: 'Circuits',         icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' },
    { route: '/why-nio-far',label: 'Pourquoi NIO FAR', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' },
    { route: '/contact',    label: 'Contact',          icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' }
  ];

  // ── Cycle de vie ──────────────────────────────────────────────
  ngOnInit(): void {
    this.adminService.checkAuth();
    if (this.adminService.isAuthenticated()) {
      this.activeTab.set(this.adminService.getDefaultTab());
      this.loadData();
    }
  }

  // ── Auth ──────────────────────────────────────────────────────
  async login(): Promise<void> {
    this.loginError.set(false);
    this.loginLoading.set(true);
    const result = await this.adminService.login(this.email, this.password);
    this.loginLoading.set(false);

    if (result.success) {
      const userName = this.adminService.currentUser()?.name ?? this.email;
      this.audit.login(userName);
      this.activeTab.set(this.adminService.getDefaultTab());
      this.loadData();
    } else {
      this.loginError.set(result.error ?? 'Erreur de connexion');
    }
  }

  async logout(): Promise<void> {
    const userName = this.adminService.currentUser()?.name ?? '';
    await this.audit.logout(userName);
    this.adminService.logout();
    this.email = '';
    this.password = '';
  }

  // ── Navigation ────────────────────────────────────────────────
  setTab(tab: AdminTab): void {
    this.activeTab.set(tab);
    if (tab === 'bookings' && this.allBookingsCount() === 0) {
      this.loadData();
    }
  }

  // ── Chargement données ────────────────────────────────────────
  async loadData(): Promise<void> {
    this.isLoading.set(true);
    const [bookingsData, rentalData, transferData, messagesData] = await Promise.all([
      this.adminService.getBookings(),
      this.adminService.getRentalBookings(),
      this.adminService.getTransferBookings(),
      this.adminService.getContactMessages()
    ]);
    this.bookings.set(bookingsData);
    this.rentalBookings.set(rentalData);
    this.transferBookings.set(transferData);
    this.messages.set(messagesData);
    this.isLoading.set(false);
  }

  // ── Statuts ───────────────────────────────────────────────────
  statusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending_payment: 'Att. paiement',
      pending:         'En attente',
      confirmed:       'Confirmé',
      cancelled:       'Annulé'
    };
    return labels[status] ?? status;
  }

  async updateStatus(id: string, event: Event): Promise<void> {
    const select = event.target as HTMLSelectElement;
    const status = select.value;
    const booking = this.bookings().find(b => b.id === id);
    const success = await this.adminService.updateBookingStatus(id, status);
    if (success) {
      this.bookings.update(list => list.map(b => b.id === id ? { ...b, status } : b));
      await this.audit.update('booking', id,
        booking?.reference_number ?? id,
        { old_status: booking?.status, new_status: status }
      );
    }
  }

  async updateRentalStatus(id: string, event: Event): Promise<void> {
    const select = event.target as HTMLSelectElement;
    const status = select.value;
    const rb = this.rentalBookings().find(b => b.id === id);
    const success = await this.adminService.updateRentalBookingStatus(id, status);
    if (success) {
      this.rentalBookings.update(list => list.map(b => b.id === id ? { ...b, status } : b));
      await this.audit.update('rental_booking', id,
        rb?.reference_number ?? id,
        { old_status: rb?.status, new_status: status }
      );
    }
  }

  async updateTransferStatus(id: string, event: Event): Promise<void> {
    const select = event.target as HTMLSelectElement;
    const status = select.value;
    const tb = this.transferBookings().find(b => b.id === id);
    const success = await this.adminService.updateTransferBookingStatus(id, status);
    if (success) {
      this.transferBookings.update(list => list.map(b => b.id === id ? { ...b, status } : b));
      await this.audit.update('transfer_booking', id,
        tb?.reference_number ?? id,
        { old_status: tb?.status, new_status: status }
      );
    }
  }

  // ── Suppressions ──────────────────────────────────────────────
  async deleteBooking(id: string, ref: string): Promise<void> {
    if (!confirm(`Supprimer la réservation ${ref} ?`)) return;
    const success = await this.adminService.deleteBooking(id);
    if (success) {
      this.bookings.update(list => list.filter(b => b.id !== id));
      await this.audit.delete('booking', id, ref);
    }
  }

  async deleteRentalBooking(id: string, ref: string): Promise<void> {
    if (!confirm(`Supprimer la réservation location ${ref} ?`)) return;
    const success = await this.adminService.deleteRentalBooking(id);
    if (success) {
      this.rentalBookings.update(list => list.filter(b => b.id !== id));
      await this.audit.delete('rental_booking', id, ref);
    }
  }

  async deleteTransferBooking(id: string, ref: string): Promise<void> {
    if (!confirm(`Supprimer la réservation transfert ${ref} ?`)) return;
    const success = await this.adminService.deleteTransferBooking(id);
    if (success) {
      this.transferBookings.update(list => list.filter(b => b.id !== id));
      await this.audit.delete('transfer_booking', id, ref);
    }
  }

  async deleteMessage(id: string, senderName: string): Promise<void> {
    if (!confirm(`Supprimer le message de ${senderName} ?`)) return;
    const success = await this.adminService.deleteContactMessage(id);
    if (success) {
      this.messages.update(msgs => msgs.filter(m => m.id !== id));
      await this.audit.delete('message', id, senderName);
    }
  }

  // ── Modals notes ──────────────────────────────────────────────
  showNotes(booking: Booking): void {
    this.notesText.set(booking.special_requests);
    this.showNotesModal.set(true);
  }

  showRentalNotes(rb: RentalBooking): void {
    this.notesText.set(rb.special_requests);
    this.showNotesModal.set(true);
  }

  showTransferNotes(tb: TransferBooking): void {
    this.notesText.set(tb.special_requests);
    this.showNotesModal.set(true);
  }

  closeNotes(): void {
    this.showNotesModal.set(false);
    this.notesText.set(null);
  }

  activateEditMode(): void {
    if (!this.editMode.isEditMode()) this.editMode.toggleEditMode();
  }
}
