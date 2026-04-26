import { Injectable, inject, signal, computed } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { UserService } from './user.service';
import { User, UserRole } from '../models/user.model';

export interface Booking {
  id: string;
  excursion_id: string;
  excursion_title: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  country: string;
  start_date: string;
  end_date: string | null;
  adults: number;
  children: number;
  special_requests: string | null;
  estimated_total: number;
  status: string;
  reference_number: string;
  created_at: string;
  paid_at: string | null;
}

export interface RentalBooking {
  id: string;
  rental_id: string;
  rental_title: string;
  rental_type: 'vehicle' | 'incentive' | 'boat';
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  country: string;
  start_date: string;
  days: number;
  with_driver: boolean;
  pickup_location: string | null;
  special_requests: string | null;
  estimated_total: number;
  status: string;
  reference_number: string;
  created_at: string;
  paid_at: string | null;
}

export interface TransferBooking {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  country: string;
  direction: 'airport_to_hotel' | 'hotel_to_airport';
  flight_date: string;
  flight_time: string;
  flight_number: string | null;
  hotel_name: string;
  passengers: number;
  luggage: number;
  vehicle_type: string;
  special_requests: string | null;
  status: string;
  reference_number: string;
  created_at: string;
  paid_at: string | null;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  country: string;
  message: string;
  created_at: string;
}

// ─── Permissions par rôle ─────────────────────────────────────────────────────
export type AdminTab =
  | 'dashboard' | 'bookings' | 'messages'
  | 'circuits' | 'excursions' | 'rentals' | 'promotions' | 'images'
  | 'users' | 'content' | 'audit';

const ROLE_TABS: Record<UserRole, AdminTab[]> = {
  administrator: [
    'dashboard', 'bookings', 'messages',
    'circuits', 'excursions', 'rentals', 'promotions', 'images',
    'users', 'content', 'audit'
  ],
  // Manager : gestion complète circuits/excursions/locations + bookings + utilisateurs (sans suppression)
  manager: [
    'dashboard', 'bookings', 'messages',
    'circuits', 'excursions', 'rentals',
    'users', 'audit'
  ],
  operator: [
    'bookings', 'messages',
    'circuits', 'excursions', 'rentals', 'promotions', 'images', 'content'
  ]
};

// ─── Session storage key ──────────────────────────────────────────────────────
const SESSION_KEY = 'nio-far-admin-user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private supabase = inject(SupabaseService);
  private userService = inject(UserService);

  // ── Auth state ──────────────────────────────────────────────────────────────
  isAuthenticated = signal(false);
  currentUser = signal<User | null>(null);

  isAdmin    = computed(() => this.currentUser()?.role === 'administrator');
  isManager  = computed(() => this.currentUser()?.role === 'manager');
  isOperator = computed(() => this.currentUser()?.role === 'operator');

  /** Renvoie les onglets autorisés pour l'utilisateur connecté */
  allowedTabs = computed<AdminTab[]>(() => {
    const user = this.currentUser();
    if (!user) return [];
    return ROLE_TABS[user.role] ?? [];
  });

  canAccessTab(tab: AdminTab): boolean {
    return this.allowedTabs().includes(tab);
  }

  /** Onglet par défaut selon le rôle */
  getDefaultTab(): AdminTab {
    return this.isOperator() ? 'bookings' : 'dashboard';
  }

  /** L'utilisateur peut-il modifier les réservations ? (tous les rôles sauf lecture pure) */
  canEditBookings = computed(() => true);

  /** Le manager ne peut pas supprimer des utilisateurs ni gérer les admins */
  canManageUser(targetRole: string): boolean {
    if (this.isAdmin()) return true;
    // Manager : peut bloquer/débloquer uniquement les operators
    if (this.isManager()) return targetRole === 'operator';
    return false;
  }

  canDeleteUser(): boolean {
    return this.isAdmin();
  }

  canCreateUser(): boolean {
    return this.isAdmin() || this.isManager();
  }

  // ── Connexion email + mot de passe ──────────────────────────────────────────
  async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const user = await this.userService.verifyCredentials(email.trim().toLowerCase(), password);
      if (user) {
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({
          id: user.id, email: user.email,
          name: user.name, role: user.role, is_active: user.is_active
        }));
        return { success: true };
      }
      return { success: false, error: 'Email ou mot de passe incorrect' };
    } catch {
      return { success: false, error: 'Une erreur est survenue, veuillez réessayer' };
    }
  }

  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    sessionStorage.removeItem(SESSION_KEY);
  }

  checkAuth(): boolean {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        const userData = JSON.parse(stored) as User;
        this.currentUser.set(userData);
        this.isAuthenticated.set(true);
        return true;
      } catch {
        sessionStorage.removeItem(SESSION_KEY);
      }
    }
    return false;
  }

  // ── Réservations circuits ────────────────────────────────────────────────────
  async getBookings(): Promise<Booking[]> {
    const { data, error } = await this.supabase.client
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) { console.error('Error fetching bookings:', error); return []; }
    return data || [];
  }

  async updateBookingStatus(id: string, status: string): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('bookings').update({ status }).eq('id', id);
    if (error) { console.error('Error updating booking status:', error); return false; }
    return true;
  }

  async deleteBooking(id: string): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('bookings').delete().eq('id', id);
    if (error) { console.error('Error deleting booking:', error); return false; }
    return true;
  }

  // ── Messages de contact ──────────────────────────────────────────────────────
  async getContactMessages(): Promise<ContactMessage[]> {
    const { data, error } = await this.supabase.client
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) { console.error('Error fetching contact messages:', error); return []; }
    return data || [];
  }

  async deleteContactMessage(id: string): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('contact_messages').delete().eq('id', id);
    if (error) { console.error('Error deleting contact message:', error); return false; }
    return true;
  }

  // ── Locations ────────────────────────────────────────────────────────────────
  async getRentalBookings(): Promise<RentalBooking[]> {
    const { data, error } = await this.supabase.client
      .from('rental_bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) { console.error('Error fetching rental bookings:', error); return []; }
    return data || [];
  }

  async updateRentalBookingStatus(id: string, status: string): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('rental_bookings').update({ status }).eq('id', id);
    if (error) { console.error('Error updating rental booking status:', error); return false; }
    return true;
  }

  async deleteRentalBooking(id: string): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('rental_bookings').delete().eq('id', id);
    if (error) { console.error('Error deleting rental booking:', error); return false; }
    return true;
  }

  // ── Transferts ───────────────────────────────────────────────────────────────
  async getTransferBookings(): Promise<TransferBooking[]> {
    const { data, error } = await this.supabase.client
      .from('transfer_bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) { console.error('Error fetching transfer bookings:', error); return []; }
    return data || [];
  }

  async updateTransferBookingStatus(id: string, status: string): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('transfer_bookings').update({ status }).eq('id', id);
    if (error) { console.error('Error updating transfer booking status:', error); return false; }
    return true;
  }

  async deleteTransferBooking(id: string): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('transfer_bookings').delete().eq('id', id);
    if (error) { console.error('Error deleting transfer booking:', error); return false; }
    return true;
  }
}
