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

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private supabase = inject(SupabaseService);

  async createBooking(booking: BookingRequest): Promise<{ success: boolean; error?: string }> {
    const { error } = await this.supabase.client
      .from('bookings')
      .insert(booking);

    if (error) {
      console.error('Error creating booking:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  }
}
