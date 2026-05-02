import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface BookingRequest {
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
}

export interface RentalBookingRequest {
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
}

export interface TransferBookingRequest {
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
}

export interface BookingResponse {
  id: string;
  reference_number: string;
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
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private supabase = inject(SupabaseService);

  async createBooking(booking: BookingRequest): Promise<{ success: boolean; data?: BookingResponse; error?: string }> {
    const reference = `NB-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const { data, error } = await this.supabase.client
      .from('bookings')
      .insert({ ...booking, reference_number: reference, status: 'pending' })
      .select()
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      return { success: false, error: error.message };
    }

    this.triggerNotification('send-booking-notification', data);

    return { success: true, data };
  }

  async createRentalBooking(booking: RentalBookingRequest): Promise<{ success: boolean; reference?: string; error?: string }> {
    const reference = `NR-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const { data, error } = await this.supabase.client
      .from('rental_bookings')
      .insert({ ...booking, reference_number: reference, status: 'pending' })
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error creating rental booking:', error);
      return { success: false, error: error.message };
    }

    this.triggerNotification('send-rental-notification', data ?? { ...booking, reference_number: reference, status: 'pending', created_at: new Date().toISOString() });

    return { success: true, reference };
  }

  async createTransferBooking(booking: TransferBookingRequest): Promise<{ success: boolean; reference?: string; error?: string }> {
    const reference = `NT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const { data, error } = await this.supabase.client
      .from('transfer_bookings')
      .insert({ ...booking, reference_number: reference, status: 'pending' })
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error creating transfer booking:', error);
      return { success: false, error: error.message };
    }

    this.triggerNotification('send-transfer-notification', data ?? { ...booking, reference_number: reference, status: 'pending', created_at: new Date().toISOString() });

    return { success: true, reference };
  }

  private async triggerNotification(functionName: string, record: unknown): Promise<void> {
    try {
      const { data, error } = await this.supabase.client.functions.invoke(functionName, {
        body: { record },
      });
      if (error) {
        console.error(`[${functionName}] invoke error:`, error);
      } else {
        console.log(`[${functionName}] sent:`, data);
      }
    } catch (err) {
      console.error(`[${functionName}] exception:`, err);
    }
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
