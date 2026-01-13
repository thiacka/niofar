import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface Rental {
  id: string;
  slug: string;
  type: 'vehicle' | 'incentive' | 'boat';
  category: string;
  name_fr: string;
  name_en: string;
  description_fr: string;
  description_en: string;
  features_fr: string[];
  features_en: string[];
  price_per_day: number;
  price_note_fr: string;
  price_note_en: string;
  capacity: number;
  image_url: string;
  gallery_urls: string[];
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface RentalFormData {
  slug: string;
  type: 'vehicle' | 'incentive' | 'boat';
  category: string;
  name_fr: string;
  name_en: string;
  description_fr: string;
  description_en: string;
  features_fr: string[];
  features_en: string[];
  price_per_day: number;
  price_note_fr: string;
  price_note_en: string;
  capacity: number;
  image_url: string;
  gallery_urls: string[];
  is_active: boolean;
  display_order: number;
}

@Injectable({
  providedIn: 'root'
})
export class RentalService {
  private supabase = inject(SupabaseService);

  async loadRentalsByType(type: 'vehicle' | 'incentive' | 'boat'): Promise<Rental[]> {
    const { data, error } = await this.supabase.client
      .from('rentals')
      .select('*')
      .eq('type', type)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error(`Error loading ${type} rentals:`, error);
      return [];
    }

    return data || [];
  }

  async loadAllRentals(): Promise<Rental[]> {
    const { data, error } = await this.supabase.client
      .from('rentals')
      .select('*')
      .order('type', { ascending: true })
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error loading all rentals:', error);
      return [];
    }

    return data || [];
  }

  async getRentalBySlug(slug: string): Promise<Rental | null> {
    const { data, error } = await this.supabase.client
      .from('rentals')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('Error loading rental:', error);
      return null;
    }

    return data;
  }

  async createRental(formData: RentalFormData): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('rentals')
      .insert([{
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('Error creating rental:', error);
      return false;
    }

    return true;
  }

  async updateRental(id: string, formData: Partial<RentalFormData>): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('rentals')
      .update({
        ...formData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating rental:', error);
      return false;
    }

    return true;
  }

  async toggleRentalStatus(id: string, isActive: boolean): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('rentals')
      .update({
        is_active: !isActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error toggling rental status:', error);
      return false;
    }

    return true;
  }

  async deleteRental(id: string): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('rentals')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting rental:', error);
      return false;
    }

    return true;
  }
}
