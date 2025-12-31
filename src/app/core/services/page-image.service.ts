import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface PageImage {
  id: string;
  page: 'home' | 'services' | 'experiences' | 'why-nio-far';
  section: string;
  image_url: string;
  alt_text_en: string;
  alt_text_fr: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type PageName = 'home' | 'services' | 'experiences' | 'why-nio-far';

@Injectable({
  providedIn: 'root'
})
export class PageImageService {
  private supabase = inject(SupabaseService);

  private imagesCache = signal<Map<string, PageImage[]>>(new Map());

  async getImagesByPage(page: PageName): Promise<PageImage[]> {
    const cached = this.imagesCache().get(page);
    if (cached) {
      return cached;
    }

    const { data, error } = await this.supabase.client
      .from('page_images')
      .select('*')
      .eq('page', page)
      .eq('is_active', true)
      .order('section')
      .order('display_order');

    if (error) {
      console.error('Error fetching page images:', error);
      return [];
    }

    const images = data as PageImage[];
    this.imagesCache.update(cache => {
      const newCache = new Map(cache);
      newCache.set(page, images);
      return newCache;
    });

    return images;
  }

  async getImagesBySection(page: PageName, section: string): Promise<PageImage[]> {
    const pageImages = await this.getImagesByPage(page);
    return pageImages.filter(img => img.section === section);
  }

  async getFirstImage(page: PageName, section: string): Promise<PageImage | null> {
    const images = await this.getImagesBySection(page, section);
    return images.length > 0 ? images[0] : null;
  }

  async getAllImages(): Promise<PageImage[]> {
    const { data, error } = await this.supabase.client
      .from('page_images')
      .select('*')
      .order('page')
      .order('section')
      .order('display_order');

    if (error) {
      console.error('Error fetching all images:', error);
      return [];
    }

    return data as PageImage[];
  }

  async updateImage(id: string, updates: Partial<PageImage>): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('page_images')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error updating image:', error);
      return false;
    }

    this.clearCache();
    return true;
  }

  async createImage(image: Omit<PageImage, 'id' | 'created_at' | 'updated_at'>): Promise<PageImage | null> {
    const { data, error } = await this.supabase.client
      .from('page_images')
      .insert(image)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error creating image:', error);
      return null;
    }

    this.clearCache();
    return data as PageImage;
  }

  async deleteImage(id: string): Promise<boolean> {
    const { error } = await this.supabase.client
      .from('page_images')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }

    this.clearCache();
    return true;
  }

  clearCache(): void {
    this.imagesCache.set(new Map());
  }
}
