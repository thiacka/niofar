/**
 * Supabase Edge Function : send-welcome-user
 *
 * Genere un token de definition de mot de passe, le stocke en base,
 * et envoie un email de bienvenue au nouvel utilisateur via Gmail SMTP.
 *
 * Body attendu (JSON) :
 *   { userId: string, name: string, email: string, role: string, createdBy: string }
 *
 * Secrets requis : MAIL_HOST, MAIL_PORT, MAIL_USERNAME, MAIL_PASSWORD, MAIL_FROM, SITE_URL
 * Secrets injectes automatiquement : SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import nodemailer from "npm:nodemailer@6.9.16";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ROLE_LABELS: Record<string, string> = {
  administrator: "Super-Administrateur",
  manager: "Manager",
  operator: "Op\u00e9rateur",
};

function getTransporter() {
  return nodemailer.createTransport({
    host: Deno.env.get("MAIL_HOST") ?? "smtp.gmail.com",
    port: Number(Deno.env.get("MAIL_PORT") ?? "587"),
    secure: false,
    auth: {
      user: Deno.env.get("MAIL_USERNAME"),
      pass: Deno.env.get("MAIL_PASSWORD"),
    },
  });
}

function getFrom(): string {
  const fromEmail = Deno.env.get("MAIL_FROM") ?? "noreply@niofartourisme.com";
  return `NIO FAR Tourisme <${fromEmail}>`;
}

async function sendEmail(
  to: string,
  subject: string,
  html: string,
): Promise<void> {
  const transporter = getTransporter();
  console.log(`Sending email to=${to}`);
  await transporter.sendMail({ from: getFrom(), to, subject, html });
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
    <p>Bienvenue dans l'\u00e9quipe !</p>
  </div>
  <div class="body">
    <p>Bonjour <strong>${opts.name}</strong>,</p>
    <p>Un compte d'acc\u00e8s au backoffice <strong>NIO FAR Tourisme</strong> vient d'\u00eatre cr\u00e9\u00e9 pour vous par <em>${opts.createdBy}</em>.</p>

    <div class="info-box">
      <p><strong>Email de connexion :</strong> ${opts.email}</p>
      <p><strong>R\u00f4le attribu\u00e9 :</strong> ${roleLabel}</p>
    </div>

    <p>Pour acc\u00e9der \u00e0 votre compte, vous devez d'abord <strong>d\u00e9finir votre mot de passe</strong> en cliquant sur le bouton ci-dessous :</p>

    <a href="${opts.setupUrl}" class="setup-btn">
      D\u00e9finir mon mot de passe
    </a>

    <div class="expiry">
      Ce lien est valable <strong>${opts.expiresIn}</strong>. Apr\u00e8s expiration, contactez votre administrateur pour obtenir un nouveau lien.
    </div>

    <p style="font-size:.85rem;color:#7A6355;">Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :</p>
    <div class="url-box">${opts.setupUrl}</div>

    <p style="font-size:.85rem;color:#7A6355;">
      Pour toute question, contactez l'administrateur ou \u00e9crivez-nous \u00e0 <a href="mailto:contact@niofartourisme.com" style="color:#C4682B;">contact@niofartourisme.com</a>
    </p>
  </div>
  <div class="footer">
    <p><strong style="color:#F5D98B;">NIO FAR Tourisme</strong> — Backoffice Interne</p>
    <p>Cet email vous a \u00e9t\u00e9 envoy\u00e9 automatiquement. Ne pas r\u00e9pondre.</p>
    <p style="margin-top:10px;font-style:italic;color:rgba(255,255,255,.4);">"Nio Far" — Nous sommes ensemble</p>
  </div>
</div>
</body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const { userId, name, email, role, createdBy } = await req.json();

    if (!userId || !email) {
      return new Response(
        JSON.stringify({ error: "userId and email are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const siteUrl =
      Deno.env.get("SITE_URL") ?? "https://niofartourisme.com";

    await supabase
      .from("password_reset_tokens")
      .update({ used_at: new Date().toISOString() })
      .eq("user_id", userId)
      .is("used_at", null);

    const { data: tokenRow, error: tokenError } = await supabase
      .from("password_reset_tokens")
      .insert({ user_id: userId })
      .select("token, expires_at")
      .single();

    if (tokenError || !tokenRow) {
      throw new Error(
        `Failed to create reset token: ${tokenError?.message}`,
      );
    }

    const setupUrl = `${siteUrl}/admin/set-password?token=${tokenRow.token}`;
    const expires = new Date(tokenRow.expires_at).toLocaleString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    await sendEmail(
      email,
      `[NIO FAR] Bienvenue ${name} — D\u00e9finissez votre mot de passe`,
      buildWelcomeEmail({
        name,
        email,
        role,
        setupUrl,
        createdBy: createdBy ?? "un administrateur",
        expiresIn: `48 heures (jusqu'au ${expires})`,
      }),
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-welcome-user error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
