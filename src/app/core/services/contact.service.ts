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
      .single();

    if (error) {
      console.error('Error sending message:', error);
      return { success: false, error: error.message };
    }

    // Appel direct de l'edge function pour envoyer l'email (le trigger pg_net est un backup)
    this.supabase.client.functions.invoke('send-contact-notification', {
      body: { record: data }
    }).catch(err => console.error('Failed to send contact notification email:', err));

    return { success: true };
  }
}
