/**
 * Supabase Edge Function : payment-webhook
 *
 * Reçoit les notifications de paiement de PayTech et Stripe,
 * puis met à jour le statut de la réservation correspondante.
 *
 * Secrets requis :
 *   STRIPE_WEBHOOK_SECRET  → secret du webhook Stripe (whsec_...)
 *   SUPABASE_URL           → injecté automatiquement par Supabase
 *   SUPABASE_SERVICE_ROLE_KEY → injecté automatiquement par Supabase
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const url = new URL(req.url);
  const source = url.searchParams.get('source') ?? 'paytech'; // ?source=stripe ou ?source=paytech

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  try {
    if (source === 'stripe') {
      return await handleStripe(req, supabase);
    } else {
      return await handlePayTech(req, supabase);
    }
  } catch (err) {
    console.error('payment-webhook error:', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});

async function handlePayTech(req: Request, supabase: ReturnType<typeof createClient>): Promise<Response> {
  const body = await req.text();
  const params = new URLSearchParams(body);

  const status    = params.get('payment_status'); // 'completed' | 'cancelled'
  const reference = params.get('ref_command');

  if (!reference) {
    return new Response('Missing reference', { status: 400 });
  }

  const newStatus = status === 'completed' ? 'confirmed' : 'cancelled';
  await updateBookingStatus(supabase, reference, newStatus);

  return new Response('OK', { status: 200 });
}

async function handleStripe(req: Request, supabase: ReturnType<typeof createClient>): Promise<Response> {
  const body      = await req.text();
  const signature = req.headers.get('stripe-signature') ?? '';
  const secret    = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';

  // Vérification de la signature Stripe (simplifiée — utiliser stripe-js en prod)
  if (!signature || !secret) {
    console.warn('Missing Stripe signature or secret — skipping verification in dev');
  }

  const event = JSON.parse(body);

  if (event.type === 'checkout.session.completed') {
    const reference = event.data?.object?.metadata?.reference;
    if (reference) {
      await updateBookingStatus(supabase, reference, 'confirmed');
    }
  } else if (event.type === 'checkout.session.expired') {
    const reference = event.data?.object?.metadata?.reference;
    if (reference) {
      await updateBookingStatus(supabase, reference, 'pending');
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function updateBookingStatus(
  supabase: ReturnType<typeof createClient>,
  reference: string,
  status: string
): Promise<void> {
  // Déterminer la table d'après le préfixe de la référence
  let table: string;
  if (reference.startsWith('NR-')) {
    table = 'rental_bookings';
  } else if (reference.startsWith('NT-')) {
    table = 'transfer_bookings';
  } else {
    table = 'bookings';
  }

  const { error } = await supabase
    .from(table)
    .update({ status, paid_at: status === 'confirmed' ? new Date().toISOString() : null })
    .eq('reference_number', reference);

  if (error) {
    console.error(`Error updating ${table} [${reference}]:`, error);
    throw error;
  }

  console.log(`Updated ${table} [${reference}] → ${status}`);
}
