import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface Excursion {
  id: string;
  slug: string;
  title_fr: string;
  title_en: string;
  description_fr: string;
  description_en: string;
  duration_fr: string;
  duration_en: string;
  price: number;
  price_note_fr: string;
  price_note_en: string;
  highlights_fr: string[];
  highlights_en: string[];
  image_url: string;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface ExcursionFormData {
  slug: string;
  title_fr: string;
  title_en: string;
  description_fr: string;
  description_en: string;
  duration_fr: string;
  duration_en: string;
  price: number;
  price_note_fr: string;
  price_note_en: string;
  highlights_fr: string[];
  highlights_en: string[];
  image_url: string;
  is_active: boolean;
  display_order: number;
}

@Injectable({
  providedIn: 'root'
})
export class ExcursionService {
  private supabase = inject(SupabaseService);

  async loadExcursions(): Promise<Excursion[]> {
    const { data, error } = await this.supabase.client
      .from('excursions')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error loading excursions:', error);
      return [];
    }

    return data || [];
  }

  async getExcursionBySlug(slug: string): Promise<Excursion | null> {
    const { data, error } = await this.supabase.client
      .from('excursions')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('Error loading excursion:', error);
      return null;
    }

    return data;
  }

  async loadAllExcursions(): Promise<Excursion[]> {
    const { data, error } = await this.supabase.client
      .from('excursions')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error loading all excursions:', error);
      return [];
    }

    return data || [];
  }

  async createExcursion(formData: ExcursionFormData): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('excursions')
      .insert([{
        ...formData,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('Error creating excursion:', error);
      return false;
    }

    return true;
  }

  async updateExcursion(id: string, formData: Partial<ExcursionFormData>): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('excursions')
      .update({
        ...formData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating excursion:', error);
      return false;
    }

    return true;
  }

  async toggleExcursionStatus(id: string, isActive: boolean): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('excursions')
      .update({
        is_active: !isActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error toggling excursion status:', error);
      return false;
    }

    return true;
  }

  async deleteExcursion(id: string): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('excursions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting excursion:', error);
      return false;
    }

    return true;
  }
}
