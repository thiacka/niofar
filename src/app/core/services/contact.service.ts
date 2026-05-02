import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { ContactMessage } from '../models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private supabase = inject(SupabaseService);

  async sendMessage(message: ContactMessage): Promise<{ success: boolean; error?: string }> {
    const { data, error } = await this.supabase.client
      .from('contact_messages')
      .insert({
        name: message.name,
        email: message.email,
        country: message.country,
        message: message.message
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error sending message:', error);
      return { success: false, error: error.message };
    }

    try {
      const { error: fnError } = await this.supabase.client.functions.invoke('send-contact-notification', {
        body: { record: data ?? { ...message, created_at: new Date().toISOString() } },
      });
      if (fnError) console.error('[send-contact-notification] invoke error:', fnError);
    } catch (err) {
      console.error('[send-contact-notification] exception:', err);
    }

    return { success: true };
  }
}
