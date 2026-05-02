import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { ContactMessage } from '../models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private supabase = inject(SupabaseService);

  async sendMessage(message: ContactMessage): Promise<{ success: boolean; error?: string }> {
    const { error } = await this.supabase.client
      .from('contact_messages')
      .insert({
        name: message.name,
        email: message.email,
        country: message.country,
        message: message.message
      });

    if (error) {
      console.error('Error sending message:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  }
}
