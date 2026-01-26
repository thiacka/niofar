import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface ItineraryDay {
  day: number;
  title_fr: string;
  title_en: string;
  description_fr: string;
  description_en: string;
  location_fr?: string;
  location_en?: string;
  accommodation_fr?: string;
  accommodation_en?: string;
  meals_fr?: string;
  meals_en?: string;
  excursion_id?: string;
  image_url?: string;
}

export interface Circuit {
  id: string;
  slug: string;
  image_url: string;
  duration_en: string;
  duration_fr: string;
  duration_days: number;
  title_en: string;
  title_fr: string;
  description_en: string;
  description_fr: string;
  highlights_en: string[];
  highlights_fr: string[];
  itinerary: ItineraryDay[];
  included_services_fr: string[];
  included_services_en: string[];
  accommodation_type_fr: string | null;
  accommodation_type_en: string | null;
  min_participants: number;
  max_participants: number;
  price: number;
  price_note_en: string;
  price_note_fr: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Promotion {
  id: string;
  circuit_id: string | null;
  code: string;
  name_en: string;
  name_fr: string;
  description_en: string;
  description_fr: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_travelers: number;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  usage_limit: number | null;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export type CircuitFormData = Omit<Circuit, 'id' | 'created_at' | 'updated_at'>;
export type PromotionFormData = Omit<Promotion, 'id' | 'created_at' | 'updated_at' | 'usage_count'>;

@Injectable({
  providedIn: 'root'
})
export class CircuitService {
  private supabase = inject(SupabaseService);

  circuits = signal<Circuit[]>([]);
  promotions = signal<Promotion[]>([]);
  isLoading = signal(false);

  async loadCircuits(): Promise<Circuit[]> {
    const { data, error } = await this.supabase.client
      .from('circuits')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching circuits:', error);
      return [];
    }

    this.circuits.set(data || []);
    return data || [];
  }

  async loadAllCircuits(): Promise<Circuit[]> {
    const { data, error } = await this.supabase.client
      .from('circuits')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching all circuits:', error);
      return [];
    }

    return data || [];
  }

  async getCircuitBySlug(slug: string): Promise<Circuit | null> {
    const { data, error } = await this.supabase.client
      .from('circuits')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error('Error fetching circuit:', error);
      return null;
    }

    return data;
  }

  async createCircuit(circuit: CircuitFormData): Promise<Circuit | null> {
    const { data, error } = await this.supabase.client
      .from('circuits')
      .insert(circuit)
      .select()
      .single();

    if (error) {
      console.error('Error creating circuit:', error);
      return null;
    }

    return data;
  }

  async updateCircuit(id: string, circuit: Partial<CircuitFormData>): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('circuits')
      .update({ ...circuit, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error updating circuit:', error);
      return false;
    }

    return true;
  }

  async deleteCircuit(id: string): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('circuits')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting circuit:', error);
      return false;
    }

    return true;
  }

  async loadPromotions(): Promise<Promotion[]> {
    const { data, error } = await this.supabase.client
      .from('promotions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching promotions:', error);
      return [];
    }

    this.promotions.set(data || []);
    return data || [];
  }

  async loadAllPromotions(): Promise<Promotion[]> {
    const { data, error } = await this.supabase.client
      .from('promotions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all promotions:', error);
      return [];
    }

    return data || [];
  }

  async getPromotionByCode(code: string): Promise<Promotion | null> {
    const { data, error } = await this.supabase.client
      .from('promotions')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('Error fetching promotion:', error);
      return null;
    }

    return data;
  }

  async createPromotion(promotion: PromotionFormData): Promise<Promotion | null> {
    const { data, error } = await this.supabase.client
      .from('promotions')
      .insert({ ...promotion, code: promotion.code.toUpperCase() })
      .select()
      .single();

    if (error) {
      console.error('Error creating promotion:', error);
      return null;
    }

    return data;
  }

  async updatePromotion(id: string, promotion: Partial<PromotionFormData>): Promise<boolean> {
    const updateData = { ...promotion, updated_at: new Date().toISOString() };
    if (promotion.code) {
      updateData.code = promotion.code.toUpperCase();
    }

    const { error } = await this.supabase.client
      .from('promotions')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating promotion:', error);
      return false;
    }

    return true;
  }

  async deletePromotion(id: string): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('promotions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting promotion:', error);
      return false;
    }

    return true;
  }

  async incrementPromotionUsage(id: string): Promise<boolean> {
    const { error } = await this.supabase.client
      .rpc('increment_promotion_usage', { promotion_id: id });

    if (error) {
      console.error('Error incrementing promotion usage:', error);
      return false;
    }

    return true;
  }

  calculateDiscount(promotion: Promotion, originalPrice: number): number {
    if (promotion.discount_type === 'percentage') {
      return Math.round(originalPrice * (promotion.discount_value / 100));
    }
    return promotion.discount_value;
  }
}
