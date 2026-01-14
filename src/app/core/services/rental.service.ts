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
      .rpc('get_rentals_by_type', { rental_type: type });

    if (error) {
      console.error(`Error loading ${type} rentals:`, error);
      return [];
    }

    return (data as Rental[]) || [];
  }

  async loadAllRentals(): Promise<Rental[]> {
    const { data, error } = await this.supabase.client
      .rpc('get_all_rentals');

    if (error) {
      console.error('Error loading all rentals:', error);
      return [];
    }

    return (data as Rental[]) || [];
  }

  async getRentalBySlug(slug: string): Promise<Rental | null> {
    const { data, error } = await this.supabase.client
      .rpc('get_active_rentals');

    if (error) {
      console.error('Error loading rental:', error);
      return null;
    }

    const rentals = (data as Rental[]) || [];
    return rentals.find(r => r.slug === slug) || null;
  }

  async createRental(formData: RentalFormData): Promise<boolean> {
    const { error } = await this.supabase.client
      .rpc('create_rental', {
        p_slug: formData.slug,
        p_type: formData.type,
        p_category: formData.category,
        p_name_fr: formData.name_fr,
        p_name_en: formData.name_en,
        p_description_fr: formData.description_fr,
        p_description_en: formData.description_en,
        p_features_fr: formData.features_fr,
        p_features_en: formData.features_en,
        p_price_per_day: formData.price_per_day,
        p_price_note_fr: formData.price_note_fr,
        p_price_note_en: formData.price_note_en,
        p_capacity: formData.capacity,
        p_image_url: formData.image_url,
        p_gallery_urls: formData.gallery_urls,
        p_is_active: formData.is_active,
        p_display_order: formData.display_order
      });

    if (error) {
      console.error('Error creating rental:', error);
      return false;
    }

    return true;
  }

  async updateRental(id: string, formData: Partial<RentalFormData>): Promise<boolean> {
    const { error } = await this.supabase.client
      .rpc('update_rental', {
        p_id: id,
        p_slug: formData.slug,
        p_type: formData.type,
        p_category: formData.category,
        p_name_fr: formData.name_fr,
        p_name_en: formData.name_en,
        p_description_fr: formData.description_fr,
        p_description_en: formData.description_en,
        p_features_fr: formData.features_fr,
        p_features_en: formData.features_en,
        p_price_per_day: formData.price_per_day,
        p_price_note_fr: formData.price_note_fr,
        p_price_note_en: formData.price_note_en,
        p_capacity: formData.capacity,
        p_image_url: formData.image_url,
        p_gallery_urls: formData.gallery_urls,
        p_is_active: formData.is_active,
        p_display_order: formData.display_order
      });

    if (error) {
      console.error('Error updating rental:', error);
      return false;
    }

    return true;
  }

  async toggleRentalStatus(id: string, isActive: boolean): Promise<boolean> {
    const { error } = await this.supabase.client
      .rpc('update_rental', {
        p_id: id,
        p_is_active: !isActive
      });

    if (error) {
      console.error('Error toggling rental status:', error);
      return false;
    }

    return true;
  }

  async deleteRental(id: string): Promise<boolean> {
    const { error } = await this.supabase.client
      .rpc('delete_rental', { p_id: id });

    if (error) {
      console.error('Error deleting rental:', error);
      return false;
    }

    return true;
  }
}
