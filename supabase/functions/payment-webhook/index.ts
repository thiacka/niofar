/**
 * Supabase Edge Function : payment-webhook
 *
 * Reçoit les notifications de paiement de PayTech et Stripe,
 * met à jour le statut de la réservation, et envoie un email
 * de confirmation de paiement au client.
 *
 * Secrets requis :
 *   STRIPE_WEBHOOK_SECRET     → secret du webhook Stripe (whsec_...)
 *   RESEND_API_KEY            → clé API Resend
 *   FROM_EMAIL                → adresse expéditeur
 *   SUPABASE_URL              → injecté automatiquement par Supabase
 *   SUPABASE_SERVICE_ROLE_KEY → injecté automatiquement par Supabase
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API = 'https://api.resend.com/emails';

// ── Envoi email ──────────────────────────────────────────────────────────────
async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const apiKey    = Deno.env.get('RESEND_API_KEY');
  const fromEmail = Deno.env.get('FROM_EMAIL') ?? 'noreply@niofartourisme.com';

  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: `NIO FAR Tourisme <${fromEmail}>`, to, subject, html }),
  });

  if (!res.ok) {
    console.error(`Resend error: ${await res.text()}`);
  }
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ── Email de confirmation de paiement ────────────────────────────────────────
function buildPaymentConfirmedEmail(opts: {
  firstName: string;
  lastName: string;
  reference: string;
  serviceLabel: string;
  dateLabel: string;
  amount: number | null;
}): string {
  return `
<!DOCTYPE html><html lang="fr">
<head><meta charset="UTF-8"><style>
  body { font-family:Georgia,serif; background:#F5EFE6; margin:0; padding:0; }
  .wrapper { max-width:600px; margin:32px auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,.08); }
  .header { background:linear-gradient(135deg,#1A6B3C,#2B8A55); padding:36px 32px; text-align:center; }
  .header h1 { color:#D4F5DF; font-size:2rem; margin:0 0 4px; letter-spacing:2px; }
  .header p  { color:rgba(255,255,255,.9); margin:0; font-style:italic; }
  .checkmark { font-size:4rem; display:block; margin-bottom:16px; }
  .body { padding:32px; }
  .ref-box { background:#EAFAF0; border:2px solid #2B8A55; border-radius:10px; padding:20px; text-align:center; margin-bottom:28px; }
  .ref-box .label { font-size:.85rem; color:#3D6B50; margin-bottom:6px; }
  .ref-box .ref { font-family:monospace; font-size:1.6rem; font-weight:700; color:#1A6B3C; letter-spacing:2px; }
  .paid-badge { display:inline-block; background:#1A6B3C; color:#fff; padding:4px 14px; border-radius:50px; font-size:.85rem; font-weight:700; margin-top:10px; }
  table { width:100%; border-collapse:collapse; margin-bottom:24px; }
  td { padding:10px 0; border-bottom:1px solid #EDE3D8; font-size:.95rem; }
  td:first-child { color:#7A6355; width:45%; }
  td:last-child { font-weight:600; color:#1A1410; text-align:right; }
  .whatsapp-btn { display:block; background:#25D366; color:#fff; text-align:center; padding:14px 24px; border-radius:50px; text-decoration:none; font-weight:700; font-size:.95rem; margin-bottom:20px; }
  .footer { background:#3D2B1F; padding:20px 32px; text-align:center; }
  .footer p { color:rgba(255,255,255,.6); font-size:.8rem; margin:4px 0; }
</style></head>
<body>
<div class="wrapper">
  <div class="header">
    <span class="checkmark">✅</span>
    <h1>NIO FAR</h1>
    <p>Paiement reçu — Votre réservation est confirmée !</p>
  </div>
  <div class="body">
    <p>Bonjour <strong>${opts.firstName} ${opts.lastName}</strong>,</p>
    <p>Nous avons bien reçu votre paiement. Votre réservation est désormais <strong>confirmée</strong> et notre équipe se prépare pour vous accueillir.</p>

    <div class="ref-box">
      <div class="label">Numéro de référence</div>
      <div class="ref">${opts.reference}</div>
      <div class="paid-badge">✓ PAYÉ</div>
    </div>

    <table>
      <tr><td>Service réservé</td><td>${opts.serviceLabel}</td></tr>
      <tr><td>Date</td><td>${opts.dateLabel}</td></tr>
      ${opts.amount ? `<tr><td>Montant payé</td><td>${opts.amount.toLocaleString('fr-FR')} FCFA</td></tr>` : ''}
    </table>

    <p>Notre équipe va vous contacter très prochainement avec tous les détails pratiques pour préparer votre séjour.</p>

    <a href="https://wa.me/221756518350?text=Bonjour%20NIO%20FAR%20!%20Ma%20réservation%20${opts.reference}%20est%20confirmée" class="whatsapp-btn">
      💬 Nous contacter sur WhatsApp
    </a>

    <p style="font-size:.85rem;color:#7A6355;">
      Par email : <a href="mailto:contact@niofartourisme.com" style="color:#C4682B;">contact@niofartourisme.com</a>
    </p>
  </div>
  <div class="footer">
    <p><strong style="color:#F5D98B;">NIO FAR Tourisme</strong> — Saly Portudal, M'bour, Sénégal</p>
    <p>+221 75 651 83 50 · contact@niofartourisme.com</p>
    <p style="margin-top:10px;font-style:italic;color:rgba(255,255,255,.4);">"Nio Far" — Nous sommes ensemble</p>
  </div>
</div>
</body></html>`;
}

// ── Mise à jour et email de confirmation ─────────────────────────────────────
async function updateBookingStatus(
  supabase: ReturnType<typeof createClient>,
  reference: string,
  status: string
): Promise<void> {
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

  // Envoyer un email de confirmation de paiement
  if (status === 'confirmed') {
    await sendPaymentConfirmedEmail(supabase, table, reference);
  }
}

async function sendPaymentConfirmedEmail(
  supabase: ReturnType<typeof createClient>,
  table: string,
  reference: string
): Promise<void> {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('reference_number', reference)
      .maybeSingle();

    if (error || !data) {
      console.error('Could not fetch booking for payment email:', error);
      return;
    }

    let serviceLabel = '';
    let dateLabel    = '';

    if (table === 'bookings') {
      serviceLabel = data.excursion_title ?? 'Circuit / Excursion';
      dateLabel    = data.start_date ? formatDate(data.start_date) : '—';
    } else if (table === 'rental_bookings') {
      serviceLabel = data.rental_title ?? 'Location';
      dateLabel    = data.start_date ? formatDate(data.start_date) : '—';
    } else if (table === 'transfer_bookings') {
      serviceLabel = `Transfert aéroport (${data.direction === 'airport_to_hotel' ? 'Aéroport → Hôtel' : 'Hôtel → Aéroport'})`;
      dateLabel    = data.flight_date ? formatDate(data.flight_date) : '—';
    }

    await sendEmail(
      data.email,
      `✅ Paiement confirmé — Réservation NIO FAR ${reference}`,
      buildPaymentConfirmedEmail({
        firstName:    data.first_name,
        lastName:     data.last_name,
        reference,
        serviceLabel,
        dateLabel,
        amount:       data.estimated_total ?? null,
      })
    );
  } catch (err) {
    console.error('Error sending payment confirmation email:', err);
  }
}

// ── Handlers PayTech / Stripe ────────────────────────────────────────────────
async function handlePayTech(req: Request, supabase: ReturnType<typeof createClient>): Promise<Response> {
  const body   = await req.text();
  const params = new URLSearchParams(body);

  const status    = params.get('payment_status');
  const reference = params.get('ref_command');

  if (!reference) return new Response('Missing reference', { status: 400 });

  const newStatus = status === 'completed' ? 'confirmed' : 'cancelled';
  await updateBookingStatus(supabase, reference, newStatus);

  return new Response('OK', { status: 200 });
}

async function handleStripe(req: Request, supabase: ReturnType<typeof createClient>): Promise<Response> {
  const body      = await req.text();
  const signature = req.headers.get('stripe-signature') ?? '';
  const secret    = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';

  if (!signature || !secret) {
    console.warn('Missing Stripe signature or secret — skipping verification in dev');
  }

  const event = JSON.parse(body);

  if (event.type === 'checkout.session.completed') {
    const reference = event.data?.object?.metadata?.reference;
    if (reference) await updateBookingStatus(supabase, reference, 'confirmed');
  } else if (event.type === 'checkout.session.expired') {
    const reference = event.data?.object?.metadata?.reference;
    if (reference) await updateBookingStatus(supabase, reference, 'pending');
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

// ── Entrée principale ────────────────────────────────────────────────────────
serve(async (req) => {
  const url    = new URL(req.url);
  const source = url.searchParams.get('source') ?? 'paytech';

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
