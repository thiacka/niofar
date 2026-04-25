import { Component, inject, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../core/services/supabase.service';
import { AuditLog, AuditAction } from '../../core/models/user.model';

const ACTION_LABELS: Record<AuditAction, string> = {
  LOGIN:  'Connexion',
  LOGOUT: 'Déconnexion',
  CREATE: 'Création',
  UPDATE: 'Modification',
  DELETE: 'Suppression'
};

const ACTION_COLORS: Record<AuditAction, string> = {
  LOGIN:  '#16a34a',
  LOGOUT: '#6b7280',
  CREATE: '#2563eb',
  UPDATE: '#d97706',
  DELETE: '#dc2626'
};

const ENTITY_LABELS: Record<string, string> = {
  booking:          'Réservation Circuit',
  rental_booking:   'Réservation Location',
  transfer_booking: 'Réservation Transfert',
  message:          'Message',
  circuit:          'Circuit',
  excursion:        'Excursion',
  rental:           'Location',
  promotion:        'Promotion',
  user:             'Utilisateur',
  session:          'Session',
  image:            'Image'
};

@Component({
  selector: 'app-admin-audit',
  standalone: true,
  imports: [DatePipe, FormsModule],
  template: `
    <div class="audit-section">
      <div class="section-header">
        <div>
          <h2>Journal d'audit</h2>
          <p class="subtitle">Historique de toutes les actions critiques du backoffice</p>
        </div>
        <button class="btn btn-secondary" (click)="loadLogs()">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
          Actualiser
        </button>
      </div>

      <!-- Filtres -->
      <div class="filters-bar">
        <div class="filter-group">
          <label>Action</label>
          <select [(ngModel)]="filterAction" (ngModelChange)="applyFilters()" class="filter-select">
            <option value="">Toutes</option>
            <option value="LOGIN">Connexion</option>
            <option value="LOGOUT">Déconnexion</option>
            <option value="CREATE">Création</option>
            <option value="UPDATE">Modification</option>
            <option value="DELETE">Suppression</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Type d'entité</label>
          <select [(ngModel)]="filterEntity" (ngModelChange)="applyFilters()" class="filter-select">
            <option value="">Tous</option>
            <option value="booking">Réservations</option>
            <option value="circuit">Circuits</option>
            <option value="user">Utilisateurs</option>
            <option value="session">Sessions</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Utilisateur</label>
          <input
            type="text"
            [(ngModel)]="filterUser"
            (ngModelChange)="applyFilters()"
            placeholder="Nom ou email…"
            class="filter-input"
          />
        </div>

        <div class="filter-group">
          <label>Date depuis</label>
          <input
            type="date"
            [(ngModel)]="filterDateFrom"
            (ngModelChange)="applyFilters()"
            class="filter-input"
          />
        </div>

        @if (hasActiveFilters()) {
          <button class="btn-clear" (click)="clearFilters()">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Effacer les filtres
          </button>
        }
      </div>

      <!-- Compteur -->
      <div class="results-count">
        {{ filteredLogs().length }} entrée(s) sur {{ logs().length }}
      </div>

      @if (loading()) {
        <div class="loading">
          <div class="spinner"></div>
        </div>
      } @else if (filteredLogs().length === 0) {
        <div class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <p>Aucune entrée d'audit correspondante</p>
        </div>
      } @else {
        <div class="table-container">
          <table class="audit-table">
            <thead>
              <tr>
                <th>Date / Heure</th>
                <th>Utilisateur</th>
                <th>Rôle</th>
                <th>Action</th>
                <th>Entité</th>
                <th>Détails</th>
              </tr>
            </thead>
            <tbody>
              @for (log of filteredLogs(); track log.id) {
                <tr [class.row-delete]="log.action === 'DELETE'" [class.row-login]="log.action === 'LOGIN'">
                  <td class="date-cell">
                    <span class="date">{{ log.created_at | date:'dd/MM/yyyy' }}</span>
                    <span class="time">{{ log.created_at | date:'HH:mm:ss' }}</span>
                  </td>
                  <td>
                    <div class="user-cell">
                      <span class="user-name-text">{{ log.user_name }}</span>
                      <span class="user-email-text">{{ log.user_email }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="role-tag" [class]="'role-' + log.user_role">
                      {{ roleLabel(log.user_role) }}
                    </span>
                  </td>
                  <td>
                    <span class="action-badge" [style.background]="actionBg(log.action)" [style.color]="actionColor(log.action)">
                      {{ actionLabel(log.action) }}
                    </span>
                  </td>
                  <td>
                    <div class="entity-cell">
                      <span class="entity-type">{{ entityLabel(log.entity_type) }}</span>
                      @if (log.entity_label) {
                        <span class="entity-label">{{ log.entity_label }}</span>
                      }
                    </div>
                  </td>
                  <td>
                    @if (log.details) {
                      <button class="btn-details" (click)="toggleDetails(log.id)" [title]="showDetails() === log.id ? 'Masquer' : 'Voir détails'">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          @if (showDetails() === log.id) {
                            <polyline points="18 15 12 9 6 15"/>
                          } @else {
                            <polyline points="6 9 12 15 18 9"/>
                          }
                        </svg>
                        Détails
                      </button>
                      @if (showDetails() === log.id) {
                        <pre class="details-pre">{{ formatDetails(log.details) }}</pre>
                      }
                    } @else {
                      <span class="no-details">—</span>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Pagination simple -->
        @if (logs().length > pageSize) {
          <div class="pagination">
            <button class="page-btn" [disabled]="currentPage() === 1" (click)="prevPage()">← Précédent</button>
            <span class="page-info">Page {{ currentPage() }} / {{ totalPages() }}</span>
            <button class="page-btn" [disabled]="currentPage() >= totalPages()" (click)="nextPage()">Suivant →</button>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .audit-section { padding: 0; }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-xl);
    }

    .section-header h2 { margin: 0 0 4px; }
    .subtitle { font-size: 0.875rem; color: var(--color-text-light); margin: 0; }

    .filters-bar {
      display: flex;
      gap: var(--spacing-md);
      flex-wrap: wrap;
      align-items: flex-end;
      padding: var(--spacing-lg);
      background: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      margin-bottom: var(--spacing-lg);
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .filter-group label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--color-text-light);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .filter-select, .filter-input {
      padding: var(--spacing-sm) var(--spacing-md);
      border: 1px solid rgba(61,43,31,0.2);
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      min-width: 150px;
    }

    .filter-select:focus, .filter-input:focus {
      outline: none;
      border-color: var(--color-primary);
    }

    .btn-clear {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-sm) var(--spacing-md);
      background: none;
      border: 1px dashed rgba(196,91,74,0.4);
      border-radius: var(--radius-md);
      color: var(--color-error);
      font-size: 0.8rem;
      cursor: pointer;
      align-self: flex-end;
    }

    .btn-clear:hover { background: rgba(196,91,74,0.08); }

    .results-count {
      font-size: 0.875rem;
      color: var(--color-text-light);
      margin-bottom: var(--spacing-md);
    }

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
    .empty-state p { margin: 0; }

    .table-container {
      background: white;
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-md);
      overflow: hidden;
    }

    .audit-table {
      width: 100%;
      border-collapse: collapse;
    }

    .audit-table th, .audit-table td {
      padding: var(--spacing-md) var(--spacing-lg);
      text-align: left;
      border-bottom: 1px solid rgba(61,43,31,0.08);
      vertical-align: top;
    }

    .audit-table th {
      background: var(--color-background);
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--color-text);
    }

    .audit-table tbody tr:hover { background: var(--color-background); }
    .row-delete { border-left: 3px solid var(--color-error); }
    .row-login  { border-left: 3px solid #16a34a; }

    .date-cell { display: flex; flex-direction: column; gap: 2px; }
    .date { font-weight: 600; font-size: 0.875rem; }
    .time { font-size: 0.75rem; color: var(--color-text-light); font-family: monospace; }

    .user-cell { display: flex; flex-direction: column; gap: 2px; }
    .user-name-text { font-weight: 600; font-size: 0.875rem; }
    .user-email-text { font-size: 0.75rem; color: var(--color-text-light); }

    .role-tag {
      padding: 2px 8px;
      border-radius: var(--radius-full);
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .role-administrator { background: #fee2e2; color: #dc2626; }
    .role-manager       { background: #ede9fe; color: #7c3aed; }
    .role-operator      { background: #dbeafe; color: #2563eb; }

    .action-badge {
      display: inline-block;
      padding: 2px 10px;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .entity-cell { display: flex; flex-direction: column; gap: 2px; }
    .entity-type { font-size: 0.8rem; font-weight: 600; color: var(--color-text); }
    .entity-label { font-size: 0.75rem; color: var(--color-text-light); font-family: monospace; }

    .btn-details {
      display: flex;
      align-items: center;
      gap: 4px;
      background: none;
      border: 1px solid rgba(61,43,31,0.2);
      border-radius: var(--radius-sm);
      padding: 2px 8px;
      font-size: 0.75rem;
      cursor: pointer;
      color: var(--color-text-light);
      transition: all 0.15s;
    }

    .btn-details:hover { border-color: var(--color-primary); color: var(--color-primary); }

    .details-pre {
      margin-top: var(--spacing-sm);
      padding: var(--spacing-sm);
      background: var(--color-background);
      border-radius: var(--radius-sm);
      font-size: 0.75rem;
      font-family: monospace;
      color: var(--color-text);
      white-space: pre-wrap;
      max-width: 280px;
      overflow-x: auto;
      border: 1px solid rgba(61,43,31,0.1);
    }

    .no-details { color: var(--color-text-light); font-size: 0.8rem; }

    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-lg);
      padding: var(--spacing-lg);
    }

    .page-btn {
      padding: var(--spacing-sm) var(--spacing-lg);
      border: 1px solid rgba(61,43,31,0.2);
      border-radius: var(--radius-md);
      background: white;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.15s;
    }

    .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .page-btn:not(:disabled):hover { border-color: var(--color-primary); color: var(--color-primary); }

    .page-info { font-size: 0.875rem; color: var(--color-text-light); }

    @media (max-width: 992px) {
      .audit-table { display: block; overflow-x: auto; }
    }

    @media (max-width: 600px) {
      .filters-bar { flex-direction: column; }
      .filter-select, .filter-input { min-width: 100%; }
    }
  `]
})
export class AdminAuditComponent implements OnInit {
  private supabase = inject(SupabaseService);

  logs         = signal<AuditLog[]>([]);
  filteredLogs = signal<AuditLog[]>([]);
  loading      = signal(true);
  showDetails  = signal<string | null>(null);
  currentPage  = signal(1);

  readonly pageSize = 100;

  // Filtres
  filterAction   = '';
  filterEntity   = '';
  filterUser     = '';
  filterDateFrom = '';

  totalPages = () => Math.ceil(this.logs().length / this.pageSize);

  async ngOnInit() {
    await this.loadLogs();
  }

  async loadLogs() {
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase.client
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000);

      if (error) { console.error('Error fetching audit logs:', error); }
      this.logs.set((data ?? []) as AuditLog[]);
      this.applyFilters();
    } finally {
      this.loading.set(false);
    }
  }

  applyFilters() {
    let result = this.logs();

    if (this.filterAction) {
      result = result.filter(l => l.action === this.filterAction);
    }
    if (this.filterEntity) {
      result = result.filter(l => l.entity_type.startsWith(this.filterEntity));
    }
    if (this.filterUser.trim()) {
      const q = this.filterUser.trim().toLowerCase();
      result = result.filter(l =>
        l.user_name.toLowerCase().includes(q) ||
        l.user_email.toLowerCase().includes(q)
      );
    }
    if (this.filterDateFrom) {
      const from = new Date(this.filterDateFrom).getTime();
      result = result.filter(l => new Date(l.created_at).getTime() >= from);
    }

    this.filteredLogs.set(result);
    this.currentPage.set(1);
  }

  hasActiveFilters(): boolean {
    return !!(this.filterAction || this.filterEntity || this.filterUser || this.filterDateFrom);
  }

  clearFilters() {
    this.filterAction = '';
    this.filterEntity = '';
    this.filterUser   = '';
    this.filterDateFrom = '';
    this.applyFilters();
  }

  prevPage() { if (this.currentPage() > 1) this.currentPage.update(p => p - 1); }
  nextPage() { if (this.currentPage() < this.totalPages()) this.currentPage.update(p => p + 1); }

  toggleDetails(id: string) {
    this.showDetails.set(this.showDetails() === id ? null : id);
  }

  formatDetails(details: Record<string, unknown> | null): string {
    if (!details) return '';
    return JSON.stringify(details, null, 2);
  }

  actionLabel(action: string): string {
    return ACTION_LABELS[action as AuditAction] ?? action;
  }

  actionColor(action: string): string {
    return ACTION_COLORS[action as AuditAction] ?? '#6b7280';
  }

  actionBg(action: string): string {
    const c = ACTION_COLORS[action as AuditAction] ?? '#6b7280';
    return c + '18'; // 10% opacity
  }

  entityLabel(type: string): string {
    return ENTITY_LABELS[type] ?? type;
  }

  roleLabel(role: string): string {
    const labels: Record<string, string> = {
      administrator: 'Super-Admin',
      manager:       'Manager',
      operator:      'Opérateur'
    };
    return labels[role] ?? role;
  }
}
