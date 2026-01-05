import { Injectable, signal, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface PageContent {
  id?: string;
  page: string;
  section: string;
  key: string;
  content_fr: string;
  content_en: string;
  content_type: string;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EditModeService {
  private supabase = inject(SupabaseService);

  isEditMode = signal(false);
  private contentCache = new Map<string, PageContent>();

  toggleEditMode(): void {
    this.isEditMode.update(mode => !mode);
  }

  async getContent(page: string, section: string, key: string): Promise<PageContent | null> {
    const cacheKey = `${page}-${section}-${key}`;

    if (this.contentCache.has(cacheKey)) {
      return this.contentCache.get(cacheKey)!;
    }

    const { data, error } = await this.supabase.client
      .from('page_content')
      .select('*')
      .eq('page', page)
      .eq('section', section)
      .eq('key', key)
      .maybeSingle();

    if (error) {
      console.error('Error fetching content:', error);
      return null;
    }

    if (data) {
      this.contentCache.set(cacheKey, data);
    }

    return data;
  }

  async getAllPageContent(page: string): Promise<PageContent[]> {
    const { data, error } = await this.supabase.client
      .from('page_content')
      .select('*')
      .eq('page', page)
      .eq('is_active', true)
      .order('display_order');

    if (error) {
      console.error('Error fetching page content:', error);
      return [];
    }

    return data || [];
  }

  async saveContent(content: PageContent): Promise<boolean> {
    content.updated_at = new Date().toISOString();

    const { error } = await this.supabase.client
      .from('page_content')
      .upsert(content, {
        onConflict: 'page,section,key'
      });

    if (error) {
      console.error('Error saving content:', error);
      return false;
    }

    const cacheKey = `${content.page}-${content.section}-${content.key}`;
    this.contentCache.set(cacheKey, content);

    return true;
  }

  async deleteContent(id: string): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('page_content')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting content:', error);
      return false;
    }

    for (const [key, value] of this.contentCache.entries()) {
      if (value.id === id) {
        this.contentCache.delete(key);
        break;
      }
    }

    return true;
  }

  clearCache(): void {
    this.contentCache.clear();
  }
}
