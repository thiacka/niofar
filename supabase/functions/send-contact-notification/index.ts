/**
 * Supabase Edge Function : send-contact-notification
 *
 * Déclenchée par un Database Webhook sur INSERT dans la table `contact_messages`.
 * Envoie une notification interne à l'équipe NIO FAR.
 *
 * Configuration requise (Supabase Secrets) :
 *   RESEND_API_KEY   → clé API Resend (https://resend.com)
 *   TEAM_EMAIL       → adresse de l'équipe (ex: contact@niofartourisme.com)
 *   FROM_EMAIL       → adresse expéditeur (ex: noreply@niofartourisme.com)
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API = 'https://api.resend.com/emails';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface ContactPayload {
  record: {
    id: string;
    name: string;
    email: string;
    country: string;
    message: string;
    created_at: string;
  };
}

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  const fromEmail = Deno.env.get('FROM_EMAIL') ?? 'noreply@niofartourisme.com';

  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: `NIO FAR Tourisme <${fromEmail}>`, to, subject, html }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Resend error: ${error}`);
  }
}

function buildContactNotificationHtml(m: ContactPayload['record']): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>
  body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
  .card { max-width: 580px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; }
  .header { background: #2B8A8A; color: white; padding: 20px 24px; }
  .header h2 { margin: 0; font-size: 1.1rem; }
  .body { padding: 24px; }
  .field { margin-bottom: 16px; }
  .field label { display: block; font-size: 0.8rem; color: #888; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
  .field p { margin: 0; font-size: 0.95rem; color: #1A1410; font-weight: 500; }
  .message-box { background: #F5EFE6; border-left: 4px solid #C4682B; padding: 16px; border-radius: 0 8px 8px 0; font-size: 0.95rem; color: #3D2B1F; line-height: 1.6; white-space: pre-wrap; }
  .reply-btn { display: inline-block; margin-top: 20px; background: #C4682B; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 0.9rem; }
</style></head>
<body>
<div class="card">
  <div class="header">
    <h2>📩 Nouveau message de contact — ${m.name}</h2>
  </div>
  <div class="body">
    <div class="field"><label>Nom</label><p>${m.name}</p></div>
    <div class="field"><label>Email</label><p><a href="mailto:${m.email}" style="color:#C4682B;">${m.email}</a></p></div>
    <div class="field"><label>Pays</label><p>${m.country}</p></div>
    <div class="field"><label>Reçu le</label><p>${new Date(m.created_at).toLocaleString('fr-FR')}</p></div>
    <div class="field">
      <label>Message</label>
      <div class="message-box">${m.message}</div>
    </div>
    <a href="mailto:${m.email}?subject=Re:%20Votre%20demande%20NIO%20FAR" class="reply-btn">Répondre →</a>
    <p style="margin-top:16px;">
      <a href="https://nio-far-tourisme.com/admin" style="font-size:0.85rem;color:#888;">Voir dans l'admin</a>
    </p>
  </div>
</div>
</body>
</html>`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const payload: ContactPayload = await req.json();
    const message = payload.record;
    const teamEmail = Deno.env.get('TEAM_EMAIL') ?? 'contact@niofartourisme.com';

    await sendEmail(
      teamEmail,
      `[NIO FAR] Nouveau message de ${message.name} (${message.country})`,
      buildContactNotificationHtml(message)
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (err) {
    console.error('send-contact-notification error:', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});
