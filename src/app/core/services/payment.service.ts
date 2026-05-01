import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

export type PaymentMethod = 'paytech' | 'stripe' | 'paypal' | 'later';
export type BookingType = 'excursion' | 'rental' | 'transfer';

export interface PaymentSession {
  method: PaymentMethod;
  redirectUrl?: string;
  reference: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private supabase = inject(SupabaseService);

  /** Appelle l'Edge Function PayTech et retourne l'URL de redirection */
  async initiatePayTech(reference: string, amount: number, label: string, email: string): Promise<{ url: string } | { error: string }> {
    const { data, error } = await this.supabase.client.functions.invoke('create-paytech-payment', {
      body: { reference, amount, label, email }
    });
    if (error) return { error: error.message };
    if (!data?.redirect_url) return { error: 'No redirect URL returned' };
    return { url: data.redirect_url as string };
  }

  /** Appelle l'Edge Function Stripe et retourne l'URL de Checkout */
  async initiateStripe(reference: string, amount: number, label: string, email: string): Promise<{ url: string } | { error: string }> {
    const { data, error } = await this.supabase.client.functions.invoke('create-stripe-session', {
      body: { reference, amount, label, email }
    });
    if (error) return { error: error.message };
    if (!data?.url) return { error: 'No Stripe URL returned' };
    return { url: data.url as string };
  }

  /** Appelle l'Edge Function PayPal et retourne l'URL de redirection Checkout */
  async initiatePayPal(reference: string, amount: number, label: string, email: string): Promise<{ url: string } | { error: string }> {
    const { data, error } = await this.supabase.client.functions.invoke('create-paypal-order', {
      body: { reference, amount, label, email }
    });
    if (error) return { error: error.message };
    if (!data?.approval_url) return { error: 'No PayPal approval URL returned' };
    return { url: data.approval_url as string };
  }

  /** Marque la réservation comme confirmée sans paiement */
  async confirmLater(reference: string, table: 'bookings' | 'rental_bookings' | 'transfer_bookings'): Promise<boolean> {
    const { error } = await this.supabase.client
      .from(table)
      .update({ status: 'pending' })
      .eq('reference_number', reference);
    return !error;
  }

  /** Résout la table Supabase selon le préfixe de la référence */
  resolveTable(reference: string): 'bookings' | 'rental_bookings' | 'transfer_bookings' {
    if (reference.startsWith('NR-')) return 'rental_bookings';
    if (reference.startsWith('NT-')) return 'transfer_bookings';
    return 'bookings';
  }

  /** Charge les infos de réservation pour afficher le récapitulatif sur la page paiement */
  async getBookingSummary(reference: string): Promise<{ title: string; email: string; amount: number } | null> {
    const table = this.resolveTable(reference);
    const { data, error } = await this.supabase.client
      .from(table)
      .select('*')
      .eq('reference_number', reference)
      .maybeSingle();

    if (error || !data) return null;

    const title = data['excursion_title'] || data['rental_title'] || 'Transfert aéroport';
    const email = data['email'] ?? '';
    const amount = data['estimated_total'] ?? 0;

    return { title, email, amount };
  }
}
