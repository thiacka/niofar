import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { User, UserRole, CreateUserDto, UpdateUserDto } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private supabase = inject(SupabaseService);

  async getAllUsers(): Promise<User[]> {
    const { data, error } = await this.supabase.client
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) { console.error('Error fetching users:', error); throw error; }
    return data as User[];
  }

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await this.supabase.client
      .from('users').select('*').eq('id', id).maybeSingle();

    if (error) { console.error('Error fetching user:', error); throw error; }
    return data as User | null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.supabase.client
      .from('users').select('*').eq('email', email).maybeSingle();

    if (error) { console.error('Error fetching user by email:', error); throw error; }
    return data as User | null;
  }

  async createUser(userData: CreateUserDto, createdByName?: string): Promise<User> {
    const passwordHash = await this.hashPassword(userData.password);

    const { data, error } = await this.supabase.client
      .from('users')
      .insert({
        email: userData.email.trim().toLowerCase(),
        name: userData.name,
        role: userData.role,
        password_hash: passwordHash,
        is_active: userData.is_active ?? true
      })
      .select()
      .single();

    if (error) { console.error('Error creating user:', error); throw error; }

    // Envoyer l'email de bienvenue avec lien de définition de mot de passe
    const newUser = data as User;
    this.sendWelcomeEmail(newUser, createdByName).catch(err =>
      console.warn('Welcome email failed (non-bloquant):', err)
    );

    return newUser;
  }

  private async sendWelcomeEmail(user: User, createdByName?: string): Promise<void> {
    const { error } = await this.supabase.client.functions.invoke('send-welcome-user', {
      body: {
        userId:    user.id,
        name:      user.name,
        email:     user.email,
        role:      user.role,
        createdBy: createdByName ?? 'un administrateur',
      },
    });
    if (error) throw error;
  }

  async resendWelcomeEmail(user: User, createdByName?: string): Promise<void> {
    await this.sendWelcomeEmail(user, createdByName);
  }

  async updateUser(id: string, userData: UpdateUserDto): Promise<User> {
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString()
    };

    if (userData.email !== undefined) updateData['email'] = userData.email.trim().toLowerCase();
    if (userData.name !== undefined)  updateData['name']  = userData.name;
    if (userData.role !== undefined)  updateData['role']  = userData.role;
    if (userData.is_active !== undefined) updateData['is_active'] = userData.is_active;
    if (userData.password) updateData['password_hash'] = await this.hashPassword(userData.password);

    const { data, error } = await this.supabase.client
      .from('users').update(updateData).eq('id', id).select().single();

    if (error) { console.error('Error updating user:', error); throw error; }
    return data as User;
  }

  async deleteUser(id: string): Promise<void> {
    const { error } = await this.supabase.client.from('users').delete().eq('id', id);
    if (error) { console.error('Error deleting user:', error); throw error; }
  }

  async toggleUserStatus(id: string, isActive: boolean): Promise<User> {
    const { data, error } = await this.supabase.client
      .from('users')
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq('id', id).select().single();

    if (error) { console.error('Error toggling user status:', error); throw error; }
    return data as User;
  }

  async updateLastLogin(id: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('users')
      .update({ last_login: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) console.error('Error updating last login:', error);
  }

  async verifyCredentials(email: string, password: string): Promise<User | null> {
    const { data, error } = await this.supabase.client
      .from('users')
      .select('*')
      .eq('email', email.trim().toLowerCase())
      .eq('is_active', true)
      .maybeSingle();

    if (error || !data) return null;

    const isValid = await this.verifyPassword(password, data['password_hash']);
    if (isValid) {
      await this.updateLastLogin(data['id']);
      return data as User;
    }
    return null;
  }

  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    return (await this.hashPassword(password)) === hash;
  }

  // ── Labels et permissions ────────────────────────────────────────────────────
  getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      administrator: 'Super-administrateur',
      manager:       'Manager',
      operator:      'Opérateur'
    };
    return labels[role] ?? role;
  }

  getRoleBadgeColor(role: UserRole): string {
    const colors: Record<UserRole, string> = {
      administrator: '#dc2626',
      manager:       '#7c3aed',
      operator:      '#2563eb'
    };
    return colors[role] ?? '#6b7280';
  }

  getRolePermissions(role: string): string[] {
    const permissions: Record<string, string[]> = {
      administrator: ['all'],
      manager: [
        'view_dashboard', 'view_bookings', 'view_messages', 'view_audit'
      ],
      operator: [
        'manage_bookings', 'view_messages', 'delete_messages',
        'edit_circuits', 'edit_excursions', 'edit_rentals',
        'edit_promotions', 'edit_images', 'edit_content'
      ]
    };
    return permissions[role] ?? [];
  }

  hasPermission(user: User | null, permission: string): boolean {
    if (!user || !user.is_active) return false;
    const perms = this.getRolePermissions(user.role);
    return perms.includes('all') || perms.includes(permission);
  }
}
