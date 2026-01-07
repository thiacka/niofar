import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService, Booking, ContactMessage } from '../../core/services/admin.service';
import { LanguageService } from '../../core/services/language.service';
import { AdminCircuitsComponent } from './admin-circuits.component';
import { AdminExcursionsComponent } from './admin-excursions.component';
import { AdminPromotionsComponent } from './admin-promotions.component';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AdminImagesComponent } from './admin-images.component';
import { EditModeService } from '../../core/services/edit-mode.service';
import { AdminUsersComponent } from './admin-users.component';

type TabType = 'dashboard' | 'bookings' | 'messages' | 'circuits' | 'excursions' | 'promotions' | 'images' | 'users' | 'content';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, DatePipe, DecimalPipe, RouterLink, AdminCircuitsComponent, AdminExcursionsComponent, AdminPromotionsComponent, AdminDashboardComponent, AdminImagesComponent, AdminUsersComponent],
  template: `
    <div class="admin-container">
      @if (!adminService.isAuthenticated()) {
        <div class="login-wrapper">
          <div class="login-card">
            <div class="login-header">
              <h1>NIO FAR</h1>
              <p>{{ lang.t('admin.loginTitle') }}</p>
            </div>
            <form (ngSubmit)="login()" class="login-form">
              <div class="form-group">
                <label for="password">{{ lang.t('admin.password') }}</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  [(ngModel)]="password"
                  [placeholder]="lang.t('admin.passwordPlaceholder')"
                  required
                />
              </div>
              @if (loginError()) {
                <div class="alert alert-error">
                  {{ lang.t('admin.loginError') }}
                </div>
              }
              <button type="submit" class="btn btn-primary">
                {{ lang.t('admin.login') }}
              </button>
            </form>
          </div>
        </div>
      } @else {
        <header class="admin-header">
          <div class="header-left">
            <h1>NIO FAR Admin</h1>
          </div>
          <div class="header-right">
            <button
              class="btn btn-toggle"
              [class.active]="editMode.isEditMode()"
              (click)="editMode.toggleEditMode()"
            >
              @if (editMode.isEditMode()) {
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Mode Edition Actif
              } @else {
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Activer Mode Edition
              }
            </button>
            <button class="btn btn-outline" (click)="logout()">
              {{ lang.t('admin.logout') }}
            </button>
          </div>
        </header>

        <div class="admin-content">
          <div class="tabs">
            <button
              class="tab"
              [class.active]="activeTab() === 'dashboard'"
              (click)="setTab('dashboard')"
            >
              {{ lang.t('admin.dashboard') }}
            </button>
            <button
              class="tab"
              [class.active]="activeTab() === 'bookings'"
              (click)="setTab('bookings')"
            >
              {{ lang.t('admin.bookings') }}
              <span class="badge">{{ bookings().length }}</span>
            </button>
            <button
              class="tab"
              [class.active]="activeTab() === 'messages'"
              (click)="setTab('messages')"
            >
              {{ lang.t('admin.messages') }}
              <span class="badge">{{ messages().length }}</span>
            </button>
            <button
              class="tab"
              [class.active]="activeTab() === 'circuits'"
              (click)="setTab('circuits')"
            >
              {{ lang.t('admin.circuits') }}
            </button>
            <button
              class="tab"
              [class.active]="activeTab() === 'excursions'"
              (click)="setTab('excursions')"
            >
              {{ lang.t('admin.excursions') }}
            </button>
            <button
              class="tab"
              [class.active]="activeTab() === 'promotions'"
              (click)="setTab('promotions')"
            >
              {{ lang.t('admin.promotions') }}
            </button>
            <button
              class="tab"
              [class.active]="activeTab() === 'images'"
              (click)="setTab('images')"
            >
              {{ lang.t('admin.images') }}
            </button>
            <button
              class="tab"
              [class.active]="activeTab() === 'content'"
              (click)="setTab('content')"
            >
              Contenu
            </button>
            <button
              class="tab"
              [class.active]="activeTab() === 'users'"
              (click)="setTab('users')"
            >
              {{ lang.t('admin.users') }}
            </button>
          </div>

          @if (isLoading()) {
            <div class="loading">
              <div class="spinner"></div>
              <p>{{ lang.t('admin.loading') }}</p>
            </div>
          } @else {
            @if (activeTab() === 'dashboard') {
              <app-admin-dashboard />
            }

            @if (activeTab() === 'bookings') {
              <div class="table-container">
                @if (bookings().length === 0) {
                  <div class="empty-state">
                    <p>{{ lang.t('admin.noBookings') }}</p>
                  </div>
                } @else {
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>{{ lang.t('admin.reference') }}</th>
                        <th>{{ lang.t('admin.client') }}</th>
                        <th>{{ lang.t('admin.circuit') }}</th>
                        <th>{{ lang.t('admin.date') }}</th>
                        <th>{{ lang.t('admin.travelers') }}</th>
                        <th>{{ lang.t('admin.total') }}</th>
                        <th>{{ lang.t('admin.status') }}</th>
                        <th>{{ lang.t('admin.actions') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (booking of bookings(); track booking.id) {
                        <tr>
                          <td>
                            <span class="reference">{{ booking.reference_number }}</span>
                          </td>
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
                              @if (booking.end_date) {
                                <span class="date-separator">-</span>
                                <span>{{ booking.end_date | date:'dd/MM/yyyy' }}</span>
                              }
                            </div>
                          </td>
                          <td>
                            <span>{{ booking.adults }} {{ lang.t('admin.adults') }}</span>
                            @if (booking.children > 0) {
                              <span>, {{ booking.children }} {{ lang.t('admin.children') }}</span>
                            }
                          </td>
                          <td>
                            <span class="total">{{ booking.estimated_total | number }} FCFA</span>
                          </td>
                          <td>
                            <span class="status-badge" [class]="'status-' + booking.status">
                              {{ lang.t('admin.status.' + booking.status) }}
                            </span>
                          </td>
                          <td>
                            <div class="actions">
                              <select
                                [value]="booking.status"
                                (change)="updateStatus(booking.id, $event)"
                                class="status-select"
                              >
                                <option value="pending">{{ lang.t('admin.status.pending') }}</option>
                                <option value="confirmed">{{ lang.t('admin.status.confirmed') }}</option>
                                <option value="cancelled">{{ lang.t('admin.status.cancelled') }}</option>
                              </select>
                              @if (booking.special_requests) {
                                <button
                                  class="btn-icon"
                                  [title]="lang.t('admin.viewNotes')"
                                  (click)="showNotes(booking)"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                    <polyline points="14 2 14 8 20 8"/>
                                    <line x1="16" y1="13" x2="8" y2="13"/>
                                    <line x1="16" y1="17" x2="8" y2="17"/>
                                  </svg>
                                </button>
                              }
                              <button
                                class="btn-icon btn-danger"
                                [title]="lang.t('admin.delete')"
                                (click)="deleteBooking(booking.id)"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                  <polyline points="3 6 5 6 21 6"/>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                  <line x1="10" y1="11" x2="10" y2="17"/>
                                  <line x1="14" y1="11" x2="14" y2="17"/>
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                }
              </div>
            }

            @if (activeTab() === 'messages') {
              <div class="messages-grid">
                @if (messages().length === 0) {
                  <div class="empty-state">
                    <p>{{ lang.t('admin.noMessages') }}</p>
                  </div>
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
                        <a [href]="'mailto:' + message.email" class="btn btn-small btn-primary">
                          {{ lang.t('admin.reply') }}
                        </a>
                        <button class="btn btn-small btn-outline" (click)="deleteMessage(message.id)">
                          {{ lang.t('admin.delete') }}
                        </button>
                      </div>
                    </div>
                  }
                }
              </div>
            }

            @if (activeTab() === 'circuits') {
              <app-admin-circuits />
            }

            @if (activeTab() === 'excursions') {
              <app-admin-excursions />
            }

            @if (activeTab() === 'promotions') {
              <app-admin-promotions />
            }

            @if (activeTab() === 'images') {
              <app-admin-images />
            }

            @if (activeTab() === 'users') {
              <app-admin-users />
            }

            @if (activeTab() === 'content') {
              <div class="content-info card">
                <h2>Mode Edition du Contenu</h2>
                <p>Pour modifier le contenu statique des pages:</p>
                <ol>
                  <li>Cliquez sur le bouton "Activer Mode Edition" en haut de la page</li>
                  <li>Utilisez les liens rapides ci-dessous pour accéder aux pages</li>
                  <li>Cliquez sur les textes avec contour orange pour les éditer</li>
                  <li>Les modifications sont sauvegardées automatiquement</li>
                  <li>Désactivez le mode édition une fois terminé</li>
                </ol>

                <div class="quick-nav">
                  <h3>Navigation Rapide</h3>
                  <div class="quick-nav-grid">
                    <a routerLink="/" class="quick-nav-card" (click)="activateEditMode()">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                      </svg>
                      <span>Accueil</span>
                    </a>
                    <a routerLink="/services" class="quick-nav-card" (click)="activateEditMode()">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                      </svg>
                      <span>Services</span>
                    </a>
                    <a routerLink="/experiences" class="quick-nav-card" (click)="activateEditMode()">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <line x1="9" y1="3" x2="9" y2="21"/>
                      </svg>
                      <span>Experiences</span>
                    </a>
                    <a routerLink="/circuits" class="quick-nav-card" (click)="activateEditMode()">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <span>Circuits</span>
                    </a>
                    <a routerLink="/why-nio-far" class="quick-nav-card" (click)="activateEditMode()">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      <span>Pourquoi NIO FAR</span>
                    </a>
                    <a routerLink="/contact" class="quick-nav-card" (click)="activateEditMode()">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                      <span>Contact</span>
                    </a>
                  </div>
                </div>

                <p class="note">
                  <strong>Note:</strong> Le mode édition vous permet de modifier les titres, descriptions et autres contenus textuels sur toutes les pages du site.
                </p>
              </div>
            }
          }
        </div>

        @if (showNotesModal()) {
          <div class="modal-overlay" (click)="closeNotes()">
            <div class="modal" (click)="$event.stopPropagation()">
              <div class="modal-header">
                <h3>{{ lang.t('admin.specialRequests') }}</h3>
                <button class="btn-close" (click)="closeNotes()">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div class="modal-body">
                <p>{{ selectedBooking()?.special_requests }}</p>
              </div>
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .admin-container {
      min-height: 100vh;
      background: var(--color-background);
    }

    .login-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-xl);
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
    }

    .login-card {
      background: var(--color-white);
      border-radius: var(--radius-xl);
      padding: var(--spacing-2xl);
      width: 100%;
      max-width: 400px;
      box-shadow: var(--shadow-xl);
    }

    .login-header {
      text-align: center;
      margin-bottom: var(--spacing-xl);
    }

    .login-header h1 {
      font-size: 2rem;
      color: var(--color-primary);
      margin-bottom: var(--spacing-sm);
    }

    .login-header p {
      color: var(--color-text-light);
    }

    .login-form .form-group {
      margin-bottom: var(--spacing-lg);
    }

    .login-form label {
      display: block;
      margin-bottom: var(--spacing-sm);
      font-weight: 600;
      color: var(--color-text);
    }

    .login-form input {
      width: 100%;
      padding: var(--spacing-md);
      border: 2px solid rgba(61, 43, 31, 0.15);
      border-radius: var(--radius-md);
      font-size: 1rem;
    }

    .login-form input:focus {
      outline: none;
      border-color: var(--color-primary);
    }

    .login-form .btn {
      width: 100%;
    }

    .admin-header {
      background: var(--color-white);
      padding: var(--spacing-lg) var(--spacing-xl);
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: var(--shadow-sm);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .admin-header h1 {
      font-size: 1.5rem;
      color: var(--color-primary);
    }

    .btn-outline {
      background: transparent;
      border: 2px solid var(--color-primary);
      color: var(--color-primary);
      padding: var(--spacing-sm) var(--spacing-lg);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .btn-outline:hover {
      background: var(--color-primary);
      color: var(--color-white);
    }

    .btn-toggle {
      background: transparent;
      border: 2px solid var(--color-accent);
      color: var(--color-accent);
      padding: var(--spacing-sm) var(--spacing-lg);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-weight: 600;
    }

    .btn-toggle:hover {
      background: rgba(196, 159, 74, 0.1);
    }

    .btn-toggle.active {
      background: var(--color-accent);
      color: var(--color-white);
    }

    .header-right {
      display: flex;
      gap: var(--spacing-md);
      align-items: center;
    }

    .admin-content {
      padding: var(--spacing-xl);
      max-width: 1400px;
      margin: 0 auto;
    }

    .tabs {
      display: flex;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-xl);
      background: var(--color-white);
      padding: var(--spacing-sm);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
    }

    .tab {
      flex: 1;
      padding: var(--spacing-md) var(--spacing-lg);
      border: none;
      background: transparent;
      border-radius: var(--radius-md);
      cursor: pointer;
      font-weight: 600;
      color: var(--color-text-light);
      transition: all var(--transition-fast);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
    }

    .tab:hover {
      color: var(--color-text);
      background: var(--color-background);
    }

    .tab.active {
      background: var(--color-primary);
      color: var(--color-white);
    }

    .tab.active .badge {
      background: var(--color-white);
      color: var(--color-primary);
    }

    .badge {
      background: var(--color-primary);
      color: var(--color-white);
      padding: 2px 8px;
      border-radius: var(--radius-full);
      font-size: 0.8rem;
    }

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
      border: 3px solid rgba(61, 43, 31, 0.1);
      border-top-color: var(--color-primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: var(--spacing-md);
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
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

    .reference {
      font-family: monospace;
      font-weight: 600;
      color: var(--color-primary);
      background: var(--color-background);
      padding: 4px 8px;
      border-radius: var(--radius-sm);
    }

    .client-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .client-name {
      font-weight: 600;
      color: var(--color-text);
    }

    .client-email {
      font-size: 0.85rem;
      color: var(--color-text-light);
    }

    .client-country {
      font-size: 0.8rem;
      color: var(--color-text-light);
    }

    .date-info {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.9rem;
    }

    .date-separator {
      color: var(--color-text-light);
    }

    .total {
      font-weight: 600;
      color: var(--color-text);
    }

    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: var(--radius-full);
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-pending {
      background: rgba(196, 159, 74, 0.15);
      color: #b8860b;
    }

    .status-confirmed {
      background: rgba(74, 155, 109, 0.15);
      color: var(--color-success);
    }

    .status-cancelled {
      background: rgba(196, 91, 74, 0.15);
      color: var(--color-error);
    }

    .actions {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .status-select {
      padding: var(--spacing-sm);
      border: 1px solid rgba(61, 43, 31, 0.2);
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

    .btn-icon:hover {
      background: var(--color-background);
      color: var(--color-primary);
    }

    .btn-danger:hover {
      background: rgba(196, 91, 74, 0.1);
      color: var(--color-error);
    }

    .empty-state {
      padding: var(--spacing-4xl);
      text-align: center;
      color: var(--color-text-light);
    }

    .messages-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: var(--spacing-lg);
    }

    .message-card {
      background: var(--color-white);
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

    .sender-info {
      display: flex;
      flex-direction: column;
    }

    .sender-name {
      font-weight: 600;
      color: var(--color-text);
    }

    .sender-country {
      font-size: 0.85rem;
      color: var(--color-text-light);
    }

    .message-date {
      font-size: 0.8rem;
      color: var(--color-text-light);
    }

    .sender-email {
      font-size: 0.9rem;
      color: var(--color-secondary);
      margin-bottom: var(--spacing-md);
    }

    .message-content {
      color: var(--color-text);
      line-height: 1.6;
      margin-bottom: var(--spacing-lg);
      padding: var(--spacing-md);
      background: var(--color-background);
      border-radius: var(--radius-md);
    }

    .message-actions {
      display: flex;
      gap: var(--spacing-sm);
    }

    .btn-small {
      padding: var(--spacing-sm) var(--spacing-md);
      font-size: 0.85rem;
    }

    .alert {
      padding: var(--spacing-md);
      border-radius: var(--radius-md);
      margin-bottom: var(--spacing-lg);
    }

    .alert-error {
      background: rgba(196, 91, 74, 0.15);
      color: var(--color-error);
      border: 1px solid var(--color-error);
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
      max-height: 80vh;
      overflow: hidden;
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
    }

    .modal-body p {
      white-space: pre-wrap;
      line-height: 1.6;
      color: var(--color-text);
    }

    .content-info {
      background: var(--color-white);
      padding: var(--spacing-2xl);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-md);
    }

    .content-info h2 {
      color: var(--color-primary);
      margin-bottom: var(--spacing-lg);
    }

    .content-info p {
      color: var(--color-text);
      line-height: 1.6;
      margin-bottom: var(--spacing-md);
    }

    .content-info ol {
      margin: var(--spacing-lg) 0;
      padding-left: var(--spacing-xl);
      color: var(--color-text);
    }

    .content-info li {
      margin-bottom: var(--spacing-sm);
      line-height: 1.6;
    }

    .content-info .note {
      background: rgba(196, 159, 74, 0.1);
      border-left: 4px solid var(--color-accent);
      padding: var(--spacing-md);
      border-radius: var(--radius-md);
      margin-top: var(--spacing-lg);
    }

    .content-info .note strong {
      color: var(--color-accent);
    }

    .quick-nav {
      margin: var(--spacing-2xl) 0;
    }

    .quick-nav h3 {
      color: var(--color-text);
      margin-bottom: var(--spacing-lg);
      font-size: 1.1rem;
    }

    .quick-nav-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
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
      background: var(--color-white);
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }

    .quick-nav-card svg {
      color: var(--color-primary);
    }

    .quick-nav-card span {
      font-weight: 600;
      font-size: 0.9rem;
      text-align: center;
    }

    @media (max-width: 992px) {
      .data-table {
        display: block;
        overflow-x: auto;
      }
    }

    @media (max-width: 600px) {
      .admin-header {
        flex-direction: column;
        gap: var(--spacing-md);
        text-align: center;
      }

      .tabs {
        flex-direction: column;
      }

      .messages-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminComponent implements OnInit {
  adminService = inject(AdminService);
  lang = inject(LanguageService);
  editMode = inject(EditModeService);

  password = '';
  loginError = signal(false);
  isLoading = signal(false);
  activeTab = signal<TabType>('dashboard');
  bookings = signal<Booking[]>([]);
  messages = signal<ContactMessage[]>([]);
  showNotesModal = signal(false);
  selectedBooking = signal<Booking | null>(null);

  ngOnInit(): void {
    this.adminService.checkAuth();
    if (this.adminService.isAuthenticated()) {
      this.loadData();
    }
  }

  login(): void {
    this.loginError.set(false);
    if (this.adminService.login(this.password)) {
      this.loadData();
    } else {
      this.loginError.set(true);
    }
  }

  logout(): void {
    this.adminService.logout();
    this.password = '';
  }

  setTab(tab: TabType): void {
    this.activeTab.set(tab);
  }

  async loadData(): Promise<void> {
    this.isLoading.set(true);
    const [bookingsData, messagesData] = await Promise.all([
      this.adminService.getBookings(),
      this.adminService.getContactMessages()
    ]);
    this.bookings.set(bookingsData);
    this.messages.set(messagesData);
    this.isLoading.set(false);
  }

  async updateStatus(id: string, event: Event): Promise<void> {
    const select = event.target as HTMLSelectElement;
    const status = select.value;
    const success = await this.adminService.updateBookingStatus(id, status);
    if (success) {
      this.bookings.update(bookings =>
        bookings.map(b => b.id === id ? { ...b, status } : b)
      );
    }
  }

  async deleteBooking(id: string): Promise<void> {
    if (confirm(this.lang.t('admin.confirmDeleteBooking'))) {
      const success = await this.adminService.deleteBooking(id);
      if (success) {
        this.bookings.update(bookings => bookings.filter(b => b.id !== id));
      }
    }
  }

  async deleteMessage(id: string): Promise<void> {
    if (confirm(this.lang.t('admin.confirmDelete'))) {
      const success = await this.adminService.deleteContactMessage(id);
      if (success) {
        this.messages.update(msgs => msgs.filter(m => m.id !== id));
      }
    }
  }

  showNotes(booking: Booking): void {
    this.selectedBooking.set(booking);
    this.showNotesModal.set(true);
  }

  closeNotes(): void {
    this.showNotesModal.set(false);
    this.selectedBooking.set(null);
  }

  activateEditMode(): void {
    if (!this.editMode.isEditMode()) {
      this.editMode.toggleEditMode();
    }
  }
}
