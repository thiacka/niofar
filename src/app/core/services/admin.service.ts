import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface Booking {
  id: string;
  circuit_id: string;
  circuit_title: string;
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
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  country: string;
  message: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private supabase = inject(SupabaseService);

  private adminPasswordHash = 'niofar2024admin';
  isAuthenticated = signal(false);

  login(password: string): boolean {
    if (password === this.adminPasswordHash) {
      this.isAuthenticated.set(true);
      sessionStorage.setItem('admin-auth', 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    this.isAuthenticated.set(false);
    sessionStorage.removeItem('admin-auth');
  }

  checkAuth(): boolean {
    const auth = sessionStorage.getItem('admin-auth');
    if (auth === 'true') {
      this.isAuthenticated.set(true);
      return true;
    }
    return false;
  }

  async getBookings(): Promise<Booking[]> {
    const { data, error } = await this.supabase.client
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }

    return data || [];
  }

  async updateBookingStatus(id: string, status: string): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('bookings')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating booking status:', error);
      return false;
    }

    return true;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    const { data, error } = await this.supabase.client
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contact messages:', error);
      return [];
    }

    return data || [];
  }

  async deleteBooking(id: string): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting booking:', error);
      return false;
    }

    return true;
  }

  async deleteContactMessage(id: string): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting contact message:', error);
      return false;
    }

    return true;
  }
}
