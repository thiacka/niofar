import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Promotion, PromotionFormData } from './circuit.service';

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
  is_multi_day: boolean;
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
  promotions = signal<Promotion[]>([]);

  async loadExcursions(): Promise<Excursion[]> {
    const { data, error } = await this.supabase.client
      .from('excursions')
      .select('*')
      .eq('is_active', true)
      .eq('is_multi_day', false)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error loading excursions:', error);
      return [];
    }

    return data || [];
  }

  async loadMultiDayTours(): Promise<Excursion[]> {
    const { data, error } = await this.supabase.client
      .from('excursions')
      .select('*')
      .eq('is_active', true)
      .eq('is_multi_day', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error loading multi-day tours:', error);
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
