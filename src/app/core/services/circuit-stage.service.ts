import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface CircuitStage {
  id: string;
  excursion_id: string;
  day_number: number;
  stage_number: number;
  title_fr: string;
  title_en: string;
  description_fr: string;
  description_en: string;
  images: string[];
  duration_minutes: number;
  start_time: string | null;
  end_time: string | null;
  location_fr: string;
  location_en: string;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface CircuitStageFormData {
  excursion_id: string;
  day_number: number;
  stage_number: number;
  title_fr: string;
  title_en: string;
  description_fr: string;
  description_en: string;
  images: string[];
  duration_minutes: number;
  start_time: string | null;
  end_time: string | null;
  location_fr: string;
  location_en: string;
  display_order: number;
}

@Injectable({
  providedIn: 'root'
})
export class CircuitStageService {
  private supabase = inject(SupabaseService);

  async getStagesByExcursionId(excursionId: string): Promise<CircuitStage[]> {
    const { data, error } = await this.supabase.client
      .from('circuit_stages')
      .select('*')
      .eq('excursion_id', excursionId)
      .order('day_number', { ascending: true })
      .order('stage_number', { ascending: true });

    if (error) {
      console.error('Error loading circuit stages:', error);
      return [];
    }

    return data || [];
  }

  async getStagesByDay(excursionId: string, dayNumber: number): Promise<CircuitStage[]> {
    const { data, error } = await this.supabase.client
      .from('circuit_stages')
      .select('*')
      .eq('excursion_id', excursionId)
      .eq('day_number', dayNumber)
      .order('stage_number', { ascending: true });

    if (error) {
      console.error('Error loading stages for day:', error);
      return [];
    }

    return data || [];
  }

  async createStage(formData: CircuitStageFormData): Promise<CircuitStage | null> {
    const { data, error } = await this.supabase.client
      .from('circuit_stages')
      .insert([{
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating circuit stage:', error);
      return null;
    }

    return data;
  }

  async updateStage(id: string, formData: Partial<CircuitStageFormData>): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('circuit_stages')
      .update({
        ...formData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating circuit stage:', error);
      return false;
    }

    return true;
  }

  async deleteStage(id: string): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('circuit_stages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting circuit stage:', error);
      return false;
    }

    return true;
  }

  async deleteStagesByExcursion(excursionId: string): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('circuit_stages')
      .delete()
      .eq('excursion_id', excursionId);

    if (error) {
      console.error('Error deleting stages for excursion:', error);
      return false;
    }

    return true;
  }
}
