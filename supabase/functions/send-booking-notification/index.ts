/**
 * Supabase Edge Function : send-booking-notification
 *
 * Déclenchée par un Database Webhook sur INSERT dans la table `bookings`.
 * Envoie deux emails via l'API Resend :
 *  1. Confirmation au client (FR ou EN selon la langue détectée)
 *  2. Notification interne à l'équipe NIO FAR
 *
 * Configuration requise (Supabase Secrets) :
 *   RESEND_API_KEY   → clé API Resend (https://resend.com)
 *   TEAM_EMAIL       → adresse de l'équipe (ex: reservations@niofartourisme.com)
 *   FROM_EMAIL       → adresse expéditeur (ex: noreply@niofartourisme.com)
 */

const RESEND_API = 'https://api.resend.com/emails';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface BookingPayload {
  record: {
    id: string;
    reference_number: string;
    excursion_title: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    country: string;
    start_date: string;
    end_date: string | null;
    adults: number;
    children: number;
    special_requests: string | null;
    estimated_total: number;
    status: string;
    created_at: string;
  };
}

function buildFrom(): string {
  let raw = (Deno.env.get('FROM_EMAIL') ?? 'noreply@niofartourisme.com').trim();
  raw = raw.replace(/^['"`]+|['"`]+$/g, '').trim();
  if (raw.includes('<') && raw.includes('>')) return raw;
  return `NIO FAR Tourisme <${raw}>`;
}

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured');

  const from = buildFrom();
  console.log(`Sending email from=${from} to=${to}`);

  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error(`Resend API error (${res.status}) sending to ${to}:`, error);
    throw new Error(`Resend error: ${error}`);
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}

function buildClientEmailFr(b: BookingPayload['record']): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><style>
  body { font-family: Georgia, serif; background: #F5EFE6; margin: 0; padding: 0; }
  .wrapper { max-width: 600px; margin: 32px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
  .header { background: linear-gradient(135deg, #3D2B1F, #C4682B); padding: 36px 32px; text-align: center; }
  .header h1 { color: #F5D98B; font-size: 2rem; margin: 0 0 4px; letter-spacing: 2px; }
  .header p { color: rgba(255,255,255,0.85); margin: 0; font-style: italic; }
  .body { padding: 32px; }
  .ref-box { background: #FDF5E8; border: 2px solid #C4682B; border-radius: 10px; padding: 20px; text-align: center; margin-bottom: 28px; }
  .ref-box .label { font-size: 0.85rem; color: #7A6355; margin-bottom: 6px; }
  .ref-box .ref { font-family: monospace; font-size: 1.6rem; font-weight: 700; color: #C4682B; letter-spacing: 2px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  td { padding: 10px 0; border-bottom: 1px solid #EDE3D8; font-size: 0.95rem; }
  td:first-child { color: #7A6355; width: 45%; }
  td:last-child { font-weight: 600; color: #1A1410; text-align: right; }
  .total td { border-top: 2px solid #C4682B; border-bottom: none; font-size: 1.05rem; }
  .steps { background: #F5EFE6; border-radius: 10px; padding: 20px 24px; margin-bottom: 24px; }
  .steps h3 { color: #3D2B1F; margin: 0 0 14px; font-size: 1rem; }
  .step { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 10px; font-size: 0.9rem; color: #4A3728; }
  .step-num { background: #C4682B; color: white; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; flex-shrink: 0; }
  .whatsapp-btn { display: block; background: #25D366; color: white; text-align: center; padding: 14px 24px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 0.95rem; margin-bottom: 20px; }
  .footer { background: #3D2B1F; padding: 20px 32px; text-align: center; }
  .footer p { color: rgba(255,255,255,0.6); font-size: 0.8rem; margin: 4px 0; }
</style></head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>NIO FAR</h1>
    <p>Votre voyage au Sénégal est confirmé !</p>
  </div>
  <div class="body">
    <p>Bonjour <strong>${b.first_name} ${b.last_name}</strong>,</p>
    <p>Merci pour votre réservation. Nous sommes ravis de vous accueillir pour cette expérience au cœur du Sénégal.</p>

    <div class="ref-box">
      <div class="label">Votre numéro de référence</div>
      <div class="ref">${b.reference_number}</div>
      <div style="font-size:0.8rem;color:#7A6355;margin-top:6px;">Conservez ce numéro pour toute correspondance</div>
    </div>

    <table>
      <tr><td>Excursion / Circuit</td><td>${b.excursion_title}</td></tr>
      <tr><td>Date de départ</td><td>${formatDate(b.start_date)}</td></tr>
      ${b.end_date ? `<tr><td>Date de retour</td><td>${formatDate(b.end_date)}</td></tr>` : ''}
      <tr><td>Voyageurs</td><td>${b.adults} adulte(s)${b.children > 0 ? `, ${b.children} enfant(s)` : ''}</td></tr>
      <tr><td>Pays</td><td>${b.country}</td></tr>
      ${b.phone ? `<tr><td>Téléphone</td><td>${b.phone}</td></tr>` : ''}
      ${b.special_requests ? `<tr><td>Demandes spéciales</td><td>${b.special_requests}</td></tr>` : ''}
      <tr class="total"><td>Montant estimé</td><td>${b.estimated_total.toLocaleString('fr-FR')} FCFA</td></tr>
    </table>

    <div class="steps">
      <h3>Prochaines étapes</h3>
      <div class="step"><span class="step-num">1</span><span>Notre équipe va examiner votre demande et vous contacter sous 24h.</span></div>
      <div class="step"><span class="step-num">2</span><span>Vous recevrez les détails de paiement et les informations pratiques.</span></div>
      <div class="step"><span class="step-num">3</span><span>Préparez-vous pour une aventure inoubliable au Sénégal !</span></div>
    </div>

    <a href="https://wa.me/221756518350?text=Bonjour%20NIO%20FAR%20!%20J'ai%20une%20question%20concernant%20ma%20r%C3%A9servation%20${b.reference_number}" class="whatsapp-btn">
      💬 Nous contacter sur WhatsApp
    </a>

    <p style="font-size:0.85rem;color:#7A6355;">
      Vous pouvez également nous joindre par email à <a href="mailto:contact@niofartourisme.com" style="color:#C4682B;">contact@niofartourisme.com</a>
    </p>
  </div>
  <div class="footer">
    <p><strong style="color:#F5D98B;">NIO FAR Tourisme</strong> — Saly Portudal, M'bour, Sénégal</p>
    <p>+221 75 651 83 50 · contact@niofartourisme.com</p>
    <p style="margin-top:10px;font-style:italic;color:rgba(255,255,255,0.4);">"Nio Far" — Nous sommes ensemble</p>
  </div>
</div>
</body>
</html>`;
}

function buildTeamNotificationHtml(b: BookingPayload['record']): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>
  body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
  .card { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; }
  .header { background: #3D2B1F; color: #F5D98B; padding: 20px 24px; }
  .header h2 { margin: 0; font-size: 1.2rem; }
  .body { padding: 24px; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 8px 0; border-bottom: 1px solid #eee; font-size: 0.9rem; }
  td:first-child { color: #666; width: 40%; }
  td:last-child { font-weight: 600; }
  .badge { display: inline-block; background: #FDF5E8; color: #C4682B; border: 1px solid #C4682B; border-radius: 4px; padding: 2px 8px; font-size: 0.8rem; font-family: monospace; }
</style></head>
<body>
<div class="card">
  <div class="header">
    <h2>🔔 Nouvelle réservation — <span class="badge" style="color:#F5D98B;border-color:#F5D98B;background:rgba(255,255,255,0.1)">${b.reference_number}</span></h2>
  </div>
  <div class="body">
    <table>
      <tr><td>Client</td><td>${b.first_name} ${b.last_name}</td></tr>
      <tr><td>Email</td><td><a href="mailto:${b.email}">${b.email}</a></td></tr>
      <tr><td>Téléphone</td><td>${b.phone ?? '—'}</td></tr>
      <tr><td>Pays</td><td>${b.country}</td></tr>
      <tr><td>Excursion / Circuit</td><td>${b.excursion_title}</td></tr>
      <tr><td>Date de départ</td><td>${formatDate(b.start_date)}</td></tr>
      ${b.end_date ? `<tr><td>Date de retour</td><td>${formatDate(b.end_date)}</td></tr>` : ''}
      <tr><td>Voyageurs</td><td>${b.adults} adulte(s)${b.children > 0 ? `, ${b.children} enfant(s)` : ''}</td></tr>
      <tr><td>Montant estimé</td><td><strong>${b.estimated_total.toLocaleString('fr-FR')} FCFA</strong></td></tr>
      ${b.special_requests ? `<tr><td>Demandes spéciales</td><td>${b.special_requests}</td></tr>` : ''}
      <tr><td>Reçu le</td><td>${new Date(b.created_at).toLocaleString('fr-FR')}</td></tr>
    </table>
    <p style="margin-top:20px;">
      <a href="https://nio-far-tourisme.com/admin" style="background:#C4682B;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:bold;">Voir dans l'admin →</a>
    </p>
  </div>
</div>
</body>
</html>`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    // Accept both direct call ({...record}) and webhook format ({record: {...}})
    const booking: BookingPayload['record'] = payload.record ?? payload;

    if (!booking?.email || !booking?.reference_number) {
      return new Response(JSON.stringify({ error: 'Invalid payload: missing booking fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const teamEmail = Deno.env.get('TEAM_EMAIL') ?? 'reservations@niofartourisme.com';

    const results = await Promise.allSettled([
      sendEmail(
        booking.email,
        `Confirmation de votre réservation NIO FAR — ${booking.reference_number}`,
        buildClientEmailFr(booking)
      ),
      sendEmail(
        teamEmail,
        `[NIO FAR] Nouvelle réservation — ${booking.reference_number} — ${booking.first_name} ${booking.last_name}`,
        buildTeamNotificationHtml(booking)
      ),
    ]);

    const failed = results.filter((r) => r.status === 'rejected');
    if (failed.length > 0) {
      console.error('send-booking-notification failures:', failed);
    }

    return new Response(
      JSON.stringify({
        success: failed.length === 0,
        client_email: results[0].status,
        team_email: results[1].status,
        errors: failed.map((f: any) => String(f.reason)),
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('send-booking-notification error:', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
