import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { User, CreateUserDto, UpdateUserDto } from '../models/user.model';

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

    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }

    return data as User[];
  }

  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await this.supabase.client
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user:', error);
      throw error;
    }

    return data as User | null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.supabase.client
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user by email:', error);
      throw error;
    }

    return data as User | null;
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    const passwordHash = await this.hashPassword(userData.password);

    const { data, error } = await this.supabase.client
      .from('users')
      .insert({
        email: userData.email,
        name: userData.name,
        role: userData.role,
        password_hash: passwordHash,
        is_active: userData.is_active ?? true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      throw error;
    }

    return data as User;
  }

  async updateUser(id: string, userData: UpdateUserDto): Promise<User> {
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (userData.email !== undefined) updateData.email = userData.email;
    if (userData.name !== undefined) updateData.name = userData.name;
    if (userData.role !== undefined) updateData.role = userData.role;
    if (userData.is_active !== undefined) updateData.is_active = userData.is_active;

    if (userData.password) {
      updateData.password_hash = await this.hashPassword(userData.password);
    }

    const { data, error } = await this.supabase.client
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      throw error;
    }

    return data as User;
  }

  async deleteUser(id: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async toggleUserStatus(id: string, isActive: boolean): Promise<User> {
    const { data, error } = await this.supabase.client
      .from('users')
      .update({
        is_active: isActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }

    return data as User;
  }

  async updateLastLogin(id: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('users')
      .update({
        last_login: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating last login:', error);
    }
  }

  async verifyCredentials(email: string, password: string): Promise<User | null> {
    const { data, error } = await this.supabase.client
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    const isValid = await this.verifyPassword(password, data.password_hash);

    if (isValid) {
      await this.updateLastLogin(data.id);
      return data as User;
    }

    return null;
  }

  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    const passwordHash = await this.hashPassword(password);
    return passwordHash === hash;
  }

  getRoleLabel(role: string): string {
    const labels: Record<string, { en: string; fr: string }> = {
      'administrator': { en: 'Administrator', fr: 'Administrateur' },
      'editor': { en: 'Editor', fr: 'Éditeur' },
      'contributor': { en: 'Contributor', fr: 'Contributeur' }
    };
    return labels[role]?.fr || role;
  }

  getRolePermissions(role: string): string[] {
    const permissions: Record<string, string[]> = {
      'administrator': ['all'],
      'editor': ['edit_circuits', 'edit_promotions', 'edit_images', 'view_bookings', 'view_messages'],
      'contributor': ['view_circuits', 'view_promotions', 'view_images', 'suggest_content']
    };
    return permissions[role] || [];
  }

  hasPermission(user: User | null, permission: string): boolean {
    if (!user || !user.is_active) return false;

    const permissions = this.getRolePermissions(user.role);
    return permissions.includes('all') || permissions.includes(permission);
  }
}
