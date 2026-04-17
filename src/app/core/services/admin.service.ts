import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';

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

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private supabase = inject(SupabaseService);

  // SHA-256 hash of the admin password (computed via Web Crypto API)
  private readonly adminPasswordHash = 'bb1fd9e86eb35bf0218d3e7732678478e0fbdbc81936f7cf3abb34105ae29718';
  isAuthenticated = signal(false);

  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  async login(password: string): Promise<boolean> {
    const hash = await this.hashPassword(password);
    if (hash === this.adminPasswordHash) {
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

  async getRentalBookings(): Promise<RentalBooking[]> {
    const { data, error } = await this.supabase.client
      .from('rental_bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching rental bookings:', error);
      return [];
    }

    return data || [];
  }

  async updateRentalBookingStatus(id: string, status: string): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('rental_bookings')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating rental booking status:', error);
      return false;
    }

    return true;
  }

  async deleteRentalBooking(id: string): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('rental_bookings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting rental booking:', error);
      return false;
    }

    return true;
  }

  async getTransferBookings(): Promise<TransferBooking[]> {
    const { data, error } = await this.supabase.client
      .from('transfer_bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching transfer bookings:', error);
      return [];
    }

    return data || [];
  }

  async updateTransferBookingStatus(id: string, status: string): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('transfer_bookings')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating transfer booking status:', error);
      return false;
    }

    return true;
  }

  async deleteTransferBooking(id: string): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('transfer_bookings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting transfer booking:', error);
      return false;
    }

    return true;
  }
}
