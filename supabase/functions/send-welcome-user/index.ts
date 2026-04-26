/**
 * Supabase Edge Function : send-welcome-user
 *
 * Appelée par le frontend (via supabase.functions.invoke) après la création
 * d'un nouvel utilisateur admin. Génère un token de définition de mot de passe,
 * le stocke en base, et envoie un email de bienvenue au nouvel utilisateur.
 *
 * Body attendu (JSON) :
 *   { userId: string, name: string, email: string, role: string, createdBy: string }
 *
 * Secrets requis : RESEND_API_KEY, FROM_EMAIL, SITE_URL
 * Secrets injectés automatiquement : SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API = 'https://api.resend.com/emails';

const ROLE_LABELS: Record<string, string> = {
  administrator: 'Super-Administrateur',
  manager:       'Manager',
  operator:      'Opérateur',
};

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const apiKey    = Deno.env.get('RESEND_API_KEY');
  const fromEmail = Deno.env.get('FROM_EMAIL') ?? 'noreply@niofartourisme.com';

  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: `NIO FAR Tourisme <${fromEmail}>`, to, subject, html }),
  });

  if (!res.ok) throw new Error(`Resend error: ${await res.text()}`);
}

function buildWelcomeEmail(opts: {
  name: string;
  email: string;
  role: string;
  setupUrl: string;
  createdBy: string;
  expiresIn: string;
}): string {
  const roleLabel = ROLE_LABELS[opts.role] ?? opts.role;

  return `
<!DOCTYPE html><html lang="fr">
<head><meta charset="UTF-8"><style>
  body { font-family:Georgia,serif; background:#F5EFE6; margin:0; padding:0; }
  .wrapper { max-width:600px; margin:32px auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,.08); }
  .header { background:linear-gradient(135deg,#3D2B1F,#C4682B); padding:36px 32px; text-align:center; }
  .header h1 { color:#F5D98B; font-size:2rem; margin:0 0 4px; letter-spacing:2px; }
  .header p  { color:rgba(255,255,255,.85); margin:0; font-style:italic; }
  .body { padding:32px; }
  .role-badge { display:inline-block; padding:4px 16px; border-radius:50px; font-size:.85rem; font-weight:700; margin-bottom:20px; }
  .info-box { background:#FDF5E8; border-left:4px solid #C4682B; border-radius:0 8px 8px 0; padding:16px 20px; margin-bottom:24px; }
  .info-box p { margin:4px 0; font-size:.95rem; color:#4A3728; }
  .info-box strong { color:#3D2B1F; }
  .setup-btn {
    display:block; background:linear-gradient(135deg,#C4682B,#A0501F);
    color:#fff; text-align:center; padding:16px 32px; border-radius:50px;
    text-decoration:none; font-weight:700; font-size:1rem; margin:24px 0;
    box-shadow:0 4px 12px rgba(196,104,43,.35);
  }
  .expiry { background:#FEF3CD; border:1px solid #F5D98B; border-radius:8px; padding:12px 16px; margin-bottom:20px; font-size:.85rem; color:#8A6C0A; }
  .url-box { background:#F5F5F5; border-radius:6px; padding:10px 14px; font-family:monospace; font-size:.8rem; color:#666; word-break:break-all; margin-bottom:20px; }
  .footer { background:#3D2B1F; padding:20px 32px; text-align:center; }
  .footer p { color:rgba(255,255,255,.6); font-size:.8rem; margin:4px 0; }
</style></head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>NIO FAR</h1>
    <p>Bienvenue dans l'équipe !</p>
  </div>
  <div class="body">
    <p>Bonjour <strong>${opts.name}</strong>,</p>
    <p>Un compte d'accès au backoffice <strong>NIO FAR Tourisme</strong> vient d'être créé pour vous par <em>${opts.createdBy}</em>.</p>

    <div class="info-box">
      <p><strong>Email de connexion :</strong> ${opts.email}</p>
      <p><strong>Rôle attribué :</strong> ${roleLabel}</p>
    </div>

    <p>Pour accéder à votre compte, vous devez d'abord <strong>définir votre mot de passe</strong> en cliquant sur le bouton ci-dessous :</p>

    <a href="${opts.setupUrl}" class="setup-btn">
      🔑 Définir mon mot de passe
    </a>

    <div class="expiry">
      ⏳ Ce lien est valable <strong>${opts.expiresIn}</strong>. Après expiration, contactez votre administrateur pour obtenir un nouveau lien.
    </div>

    <p style="font-size:.85rem;color:#7A6355;">Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :</p>
    <div class="url-box">${opts.setupUrl}</div>

    <p style="font-size:.85rem;color:#7A6355;">
      Pour toute question, contactez l'administrateur ou écrivez-nous à <a href="mailto:contact@niofartourisme.com" style="color:#C4682B;">contact@niofartourisme.com</a>
    </p>
  </div>
  <div class="footer">
    <p><strong style="color:#F5D98B;">NIO FAR Tourisme</strong> — Backoffice Interne</p>
    <p>Cet email vous a été envoyé automatiquement. Ne pas répondre.</p>
    <p style="margin-top:10px;font-style:italic;color:rgba(255,255,255,.4);">"Nio Far" — Nous sommes ensemble</p>
  </div>
</div>
</body></html>`;
}

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin':  '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, content-type',
      },
    });
  }

  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  try {
    const { userId, name, email, role, createdBy } = await req.json();

    if (!userId || !email) {
      return new Response(JSON.stringify({ error: 'userId and email are required' }), { status: 400 });
    }

    const supabase  = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    const siteUrl   = Deno.env.get('SITE_URL') ?? 'https://niofartourisme.com';

    // Invalider les anciens tokens non utilisés pour cet utilisateur
    await supabase
      .from('password_reset_tokens')
      .update({ used_at: new Date().toISOString() })
      .eq('user_id', userId)
      .is('used_at', null);

    // Créer un nouveau token (valide 48h)
    const { data: tokenRow, error: tokenError } = await supabase
      .from('password_reset_tokens')
      .insert({ user_id: userId })
      .select('token, expires_at')
      .single();

    if (tokenError || !tokenRow) {
      throw new Error(`Failed to create reset token: ${tokenError?.message}`);
    }

    const setupUrl = `${siteUrl}/admin/set-password?token=${tokenRow.token}`;
    const expires  = new Date(tokenRow.expires_at).toLocaleString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    await sendEmail(
      email,
      `[NIO FAR] Bienvenue ${name} — Définissez votre mot de passe`,
      buildWelcomeEmail({
        name,
        email,
        role,
        setupUrl,
        createdBy: createdBy ?? 'un administrateur',
        expiresIn: `48 heures (jusqu'au ${expires})`,
      })
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err) {
    console.error('send-welcome-user error:', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
});
