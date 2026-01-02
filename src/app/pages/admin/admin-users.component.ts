import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../core/services/language.service';
import { UserService } from '../../core/services/user.service';
import { User, CreateUserDto, UpdateUserDto, UserRole } from '../../core/models/user.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-section">
      <div class="section-header">
        <h2>{{ lang.t('admin.usersManagement') }}</h2>
        <button class="btn btn-primary" (click)="openCreateForm()">
          {{ lang.t('admin.addUser') }}
        </button>
      </div>

      @if (loading()) {
        <div class="loading">{{ lang.t('admin.loading') }}</div>
      } @else {
        @if (users().length === 0) {
          <div class="empty-state">{{ lang.t('admin.noUsers') }}</div>
        } @else {
          <div class="table-container">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>{{ lang.t('admin.name') }}</th>
                  <th>{{ lang.t('admin.email') }}</th>
                  <th>{{ lang.t('admin.role') }}</th>
                  <th>{{ lang.t('admin.status') }}</th>
                  <th>{{ lang.t('admin.lastLogin') }}</th>
                  <th>{{ lang.t('admin.actions') }}</th>
                </tr>
              </thead>
              <tbody>
                @for (user of users(); track user.id) {
                  <tr>
                    <td>{{ user.name }}</td>
                    <td>{{ user.email }}</td>
                    <td>
                      <span class="role-badge" [class]="'role-' + user.role">
                        {{ getRoleLabel(user.role) }}
                      </span>
                    </td>
                    <td>
                      <span class="status-badge" [class.active]="user.is_active" [class.inactive]="!user.is_active">
                        {{ user.is_active ? lang.t('admin.active') : lang.t('admin.inactive') }}
                      </span>
                    </td>
                    <td>{{ formatDate(user.last_login) }}</td>
                    <td>
                      <div class="actions">
                        <button class="btn-icon" (click)="openEditForm(user)" [title]="lang.t('admin.edit')">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button class="btn-icon" (click)="toggleStatus(user)" [title]="lang.t('admin.toggleStatus')">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M8 12h8"/>
                          </svg>
                        </button>
                        <button class="btn-icon btn-danger" (click)="deleteUser(user)" [title]="lang.t('admin.delete')">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>{{ editingUser() ? lang.t('admin.editUser') : lang.t('admin.addUser') }}</h3>
              <button class="btn-close" (click)="closeForm()">×</button>
            </div>

            <form (ngSubmit)="saveUser()" class="user-form">
              <div class="form-group">
                <label>{{ lang.t('admin.name') }}</label>
                <input
                  type="text"
                  [(ngModel)]="formData.name"
                  name="name"
                  required
                  class="form-control"
                />
              </div>

              <div class="form-group">
                <label>{{ lang.t('admin.email') }}</label>
                <input
                  type="email"
                  [(ngModel)]="formData.email"
                  name="email"
                  required
                  class="form-control"
                />
              </div>

              <div class="form-group">
                <label>{{ lang.t('admin.role') }}</label>
                <select
                  [(ngModel)]="formData.role"
                  name="role"
                  required
                  class="form-control"
                >
                  <option value="administrator">{{ lang.t('admin.roleAdministrator') }}</option>
                  <option value="editor">{{ lang.t('admin.roleEditor') }}</option>
                  <option value="contributor">{{ lang.t('admin.roleContributor') }}</option>
                </select>
              </div>

              <div class="form-group">
                <label>{{ lang.t('admin.password') }} {{ editingUser() ? '(' + lang.t('admin.leaveEmptyToKeep') + ')' : '' }}</label>
                <input
                  type="password"
                  [(ngModel)]="formData.password"
                  name="password"
                  [required]="!editingUser()"
                  class="form-control"
                  autocomplete="new-password"
                />
              </div>

              <div class="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    [(ngModel)]="formData.is_active"
                    name="is_active"
                  />
                  {{ lang.t('admin.activeAccount') }}
                </label>
              </div>

              @if (editingUser()) {
                <div class="permissions-info">
                  <h4>{{ lang.t('admin.permissions') }}</h4>
                  <ul>
                    @for (permission of getPermissions(formData.role); track permission) {
                      <li>{{ permission }}</li>
                    }
                  </ul>
                </div>
              }

              <div class="form-actions">
                <button type="button" class="btn btn-secondary" (click)="closeForm()">
                  {{ lang.t('admin.cancel') }}
                </button>
                <button type="submit" class="btn btn-primary" [disabled]="saving()">
                  {{ saving() ? lang.t('admin.saving') : lang.t('admin.save') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .admin-section {
      padding: var(--spacing-xl);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-xl);
    }

    .section-header h2 {
      margin: 0;
    }

    .loading,
    .empty-state {
      text-align: center;
      padding: var(--spacing-3xl);
      color: var(--color-text-light);
    }

    .table-container {
      overflow-x: auto;
      background: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
    }

    .admin-table {
      width: 100%;
      border-collapse: collapse;
    }

    .admin-table th,
    .admin-table td {
      padding: var(--spacing-md) var(--spacing-lg);
      text-align: left;
      border-bottom: 1px solid var(--color-border);
    }

    .admin-table th {
      background: var(--color-background-alt);
      font-weight: 600;
      color: var(--color-text);
    }

    .admin-table tbody tr:hover {
      background: var(--color-background-alt);
    }

    .role-badge {
      padding: var(--spacing-xs) var(--spacing-md);
      border-radius: var(--radius-full);
      font-size: 0.875rem;
      font-weight: 500;
    }

    .role-administrator {
      background: #dc2626;
      color: white;
    }

    .role-editor {
      background: #2563eb;
      color: white;
    }

    .role-contributor {
      background: #16a34a;
      color: white;
    }

    .status-badge {
      padding: var(--spacing-xs) var(--spacing-md);
      border-radius: var(--radius-full);
      font-size: 0.875rem;
      font-weight: 500;
    }

    .status-badge.active {
      background: #dcfce7;
      color: #166534;
    }

    .status-badge.inactive {
      background: #fee2e2;
      color: #991b1b;
    }

    .actions {
      display: flex;
      gap: var(--spacing-sm);
    }

    .btn-icon {
      padding: var(--spacing-xs);
      background: none;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      cursor: pointer;
      color: var(--color-text);
      transition: all var(--transition-base);
    }

    .btn-icon:hover {
      background: var(--color-background-alt);
      border-color: var(--color-primary);
      color: var(--color-primary);
    }

    .btn-icon.btn-danger:hover {
      border-color: #dc2626;
      color: #dc2626;
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

    .modal-content {
      background: white;
      border-radius: var(--radius-xl);
      max-width: 600px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-xl);
      border-bottom: 1px solid var(--color-border);
    }

    .modal-header h3 {
      margin: 0;
    }

    .btn-close {
      background: none;
      border: none;
      font-size: 2rem;
      cursor: pointer;
      color: var(--color-text-light);
      line-height: 1;
    }

    .user-form {
      padding: var(--spacing-xl);
    }

    .form-group {
      margin-bottom: var(--spacing-lg);
    }

    .form-group label {
      display: block;
      margin-bottom: var(--spacing-sm);
      font-weight: 500;
      color: var(--color-text);
    }

    .form-control {
      width: 100%;
      padding: var(--spacing-md);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: 1rem;
    }

    .form-control:focus {
      outline: none;
      border-color: var(--color-primary);
    }

    .checkbox-group label {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      cursor: pointer;
    }

    .checkbox-group input[type="checkbox"] {
      width: auto;
    }

    .permissions-info {
      background: var(--color-background-alt);
      padding: var(--spacing-lg);
      border-radius: var(--radius-md);
      margin-bottom: var(--spacing-lg);
    }

    .permissions-info h4 {
      margin: 0 0 var(--spacing-md) 0;
      font-size: 0.875rem;
      text-transform: uppercase;
      color: var(--color-text-light);
    }

    .permissions-info ul {
      margin: 0;
      padding-left: var(--spacing-lg);
    }

    .permissions-info li {
      margin-bottom: var(--spacing-xs);
      font-size: 0.875rem;
    }

    .form-actions {
      display: flex;
      gap: var(--spacing-md);
      justify-content: flex-end;
      margin-top: var(--spacing-xl);
    }
  `]
})
export class AdminUsersComponent implements OnInit {
  lang = inject(LanguageService);
  private userService = inject(UserService);

  users = signal<User[]>([]);
  loading = signal(true);
  showForm = signal(false);
  saving = signal(false);
  editingUser = signal<User | null>(null);

  formData: any = {
    name: '',
    email: '',
    role: 'contributor' as UserRole,
    password: '',
    is_active: true
  };

  async ngOnInit() {
    await this.loadUsers();
  }

  async loadUsers() {
    try {
      this.loading.set(true);
      const data = await this.userService.getAllUsers();
      this.users.set(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      this.loading.set(false);
    }
  }

  openCreateForm() {
    this.editingUser.set(null);
    this.formData = {
      name: '',
      email: '',
      role: 'contributor',
      password: '',
      is_active: true
    };
    this.showForm.set(true);
  }

  openEditForm(user: User) {
    this.editingUser.set(user);
    this.formData = {
      name: user.name,
      email: user.email,
      role: user.role,
      password: '',
      is_active: user.is_active
    };
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingUser.set(null);
  }

  async saveUser() {
    try {
      this.saving.set(true);

      if (this.editingUser()) {
        const updateData: UpdateUserDto = {
          name: this.formData.name,
          email: this.formData.email,
          role: this.formData.role,
          is_active: this.formData.is_active
        };

        if (this.formData.password) {
          updateData.password = this.formData.password;
        }

        await this.userService.updateUser(this.editingUser()!.id, updateData);
      } else {
        const createData: CreateUserDto = {
          name: this.formData.name,
          email: this.formData.email,
          role: this.formData.role,
          password: this.formData.password,
          is_active: this.formData.is_active
        };

        await this.userService.createUser(createData);
      }

      await this.loadUsers();
      this.closeForm();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Erreur lors de l\'enregistrement');
    } finally {
      this.saving.set(false);
    }
  }

  async toggleStatus(user: User) {
    try {
      await this.userService.toggleUserStatus(user.id, !user.is_active);
      await this.loadUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  }

  async deleteUser(user: User) {
    if (!confirm(this.lang.t('admin.confirmDeleteUser'))) {
      return;
    }

    try {
      await this.userService.deleteUser(user.id);
      await this.loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  getRoleLabel(role: string): string {
    return this.userService.getRoleLabel(role);
  }

  getPermissions(role: string): string[] {
    const permissions = this.userService.getRolePermissions(role);

    const labels: Record<string, string> = {
      'all': this.lang.t('admin.permissionAll'),
      'edit_circuits': this.lang.t('admin.permissionEditCircuits'),
      'edit_promotions': this.lang.t('admin.permissionEditPromotions'),
      'edit_images': this.lang.t('admin.permissionEditImages'),
      'view_bookings': this.lang.t('admin.permissionViewBookings'),
      'view_messages': this.lang.t('admin.permissionViewMessages'),
      'view_circuits': this.lang.t('admin.permissionViewCircuits'),
      'view_promotions': this.lang.t('admin.permissionViewPromotions'),
      'view_images': this.lang.t('admin.permissionViewImages'),
      'suggest_content': this.lang.t('admin.permissionSuggestContent')
    };

    return permissions.map(p => labels[p] || p);
  }

  formatDate(date: string | null): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
