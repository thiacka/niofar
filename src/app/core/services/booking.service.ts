import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface BookingRequest {
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
}

export interface BookingResponse {
  id: string;
  reference_number: string;
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
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private supabase = inject(SupabaseService);

  async createBooking(booking: BookingRequest): Promise<{ success: boolean; data?: BookingResponse; error?: string }> {
    const { data, error } = await this.supabase.client
      .from('bookings')
      .insert(booking)
      .select()
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  }

  async getBookingByReference(reference: string): Promise<BookingResponse | null> {
    const { data, error } = await this.supabase.client
      .from('bookings')
      .select('*')
      .eq('reference_number', reference)
      .maybeSingle();

    if (error) {
      console.error('Error fetching booking:', error);
      return null;
    }

    return data;
  }
}
