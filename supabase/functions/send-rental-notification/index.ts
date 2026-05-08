/**
 * Supabase Edge Function : send-rental-notification
 *
 * Envoie deux emails via Gmail SMTP :
 *  1. Confirmation au client (FR)
 *  2. Notification interne a l'equipe NIO FAR
 *
 * Secrets requis : MAIL_HOST, MAIL_PORT, MAIL_USERNAME, MAIL_PASSWORD,
 *                  MAIL_FROM, TEAM_EMAIL
 */

import nodemailer from "npm:nodemailer@6.9.16";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RentalRecord {
  id: string;
  reference_number: string;
  rental_title: string;
  rental_type: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  country: string;
  start_date: string;
  days: number;
  with_driver: boolean;
  pickup_location: string | null;
  special_requests: string | null;
  estimated_total: number;
  status: string;
  created_at: string;
}

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

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function rentalTypeLabel(type: string): string {
  const map: Record<string, string> = {
    vehicle: "V\u00e9hicule",
    incentive: "Incentive / \u00c9v\u00e9nement",
    boat: "Bateau / Pirogue",
  };
  return map[type] ?? type;
}

function buildClientEmail(r: RentalRecord): string {
  return `
<!DOCTYPE html><html lang="fr">
<head><meta charset="UTF-8"><style>
  body { font-family: Georgia, serif; background:#F5EFE6; margin:0; padding:0; }
  .wrapper { max-width:600px; margin:32px auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,.08); }
  .header { background:linear-gradient(135deg,#3D2B1F,#C4682B); padding:36px 32px; text-align:center; }
  .header h1 { color:#F5D98B; font-size:2rem; margin:0 0 4px; letter-spacing:2px; }
  .header p  { color:rgba(255,255,255,.85); margin:0; font-style:italic; }
  .body { padding:32px; }
  .ref-box { background:#FDF5E8; border:2px solid #C4682B; border-radius:10px; padding:20px; text-align:center; margin-bottom:28px; }
  .ref-box .label { font-size:.85rem; color:#7A6355; margin-bottom:6px; }
  .ref-box .ref { font-family:monospace; font-size:1.6rem; font-weight:700; color:#C4682B; letter-spacing:2px; }
  table { width:100%; border-collapse:collapse; margin-bottom:24px; }
  td { padding:10px 0; border-bottom:1px solid #EDE3D8; font-size:.95rem; }
  td:first-child { color:#7A6355; width:45%; }
  td:last-child { font-weight:600; color:#1A1410; text-align:right; }
  .total td { border-top:2px solid #C4682B; border-bottom:none; font-size:1.05rem; }
  .steps { background:#F5EFE6; border-radius:10px; padding:20px 24px; margin-bottom:24px; }
  .steps h3 { color:#3D2B1F; margin:0 0 14px; font-size:1rem; }
  .step { display:flex; align-items:flex-start; gap:12px; margin-bottom:10px; font-size:.9rem; color:#4A3728; }
  .step-num { background:#C4682B; color:#fff; border-radius:50%; width:22px; height:22px; display:flex; align-items:center; justify-content:center; font-size:.75rem; font-weight:700; flex-shrink:0; }
  .whatsapp-btn { display:block; background:#25D366; color:#fff; text-align:center; padding:14px 24px; border-radius:50px; text-decoration:none; font-weight:700; font-size:.95rem; margin-bottom:20px; }
  .footer { background:#3D2B1F; padding:20px 32px; text-align:center; }
  .footer p { color:rgba(255,255,255,.6); font-size:.8rem; margin:4px 0; }
</style></head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>NIO FAR</h1>
    <p>Votre r\u00e9servation de location est confirm\u00e9e !</p>
  </div>
  <div class="body">
    <p>Bonjour <strong>${r.first_name} ${r.last_name}</strong>,</p>
    <p>Merci pour votre r\u00e9servation. Nous sommes ravis de vous proposer ce service au S\u00e9n\u00e9gal.</p>

    <div class="ref-box">
      <div class="label">Votre num\u00e9ro de r\u00e9f\u00e9rence</div>
      <div class="ref">${r.reference_number}</div>
      <div style="font-size:.8rem;color:#7A6355;margin-top:6px;">Conservez ce num\u00e9ro pour toute correspondance</div>
    </div>

    <table>
      <tr><td>Type de location</td><td>${rentalTypeLabel(r.rental_type)}</td></tr>
      <tr><td>V\u00e9hicule / Service</td><td>${r.rental_title}</td></tr>
      <tr><td>Date de d\u00e9but</td><td>${formatDate(r.start_date)}</td></tr>
      <tr><td>Dur\u00e9e</td><td>${r.days} jour(s)</td></tr>
      <tr><td>Avec chauffeur</td><td>${r.with_driver ? "Oui" : "Non"}</td></tr>
      ${r.pickup_location ? `<tr><td>Lieu de prise en charge</td><td>${r.pickup_location}</td></tr>` : ""}
      <tr><td>Pays</td><td>${r.country}</td></tr>
      ${r.phone ? `<tr><td>T\u00e9l\u00e9phone</td><td>${r.phone}</td></tr>` : ""}
      ${r.special_requests ? `<tr><td>Demandes sp\u00e9ciales</td><td>${r.special_requests}</td></tr>` : ""}
      <tr class="total"><td>Montant estim\u00e9</td><td>${r.estimated_total.toLocaleString("fr-FR")} FCFA</td></tr>
    </table>

    <div class="steps">
      <h3>Prochaines \u00e9tapes</h3>
      <div class="step"><span class="step-num">1</span><span>Notre \u00e9quipe va examiner votre demande et vous contacter sous 24h.</span></div>
      <div class="step"><span class="step-num">2</span><span>Vous recevrez les d\u00e9tails de paiement et les informations pratiques.</span></div>
      <div class="step"><span class="step-num">3</span><span>Profitez de votre exp\u00e9rience au S\u00e9n\u00e9gal !</span></div>
    </div>

    <a href="https://wa.me/221756518350?text=Bonjour%20NIO%20FAR%20!%20Question%20concernant%20ma%20r%C3%A9servation%20${r.reference_number}" class="whatsapp-btn">
      Nous contacter sur WhatsApp
    </a>

    <p style="font-size:.85rem;color:#7A6355;">
      Par email : <a href="mailto:contact@niofartourisme.com" style="color:#C4682B;">contact@niofartourisme.com</a>
    </p>
  </div>
  <div class="footer">
    <p><strong style="color:#F5D98B;">NIO FAR Tourisme</strong> — Saly Portudal, M'bour, S\u00e9n\u00e9gal</p>
    <p>+221 75 651 83 50 · contact@niofartourisme.com</p>
    <p style="margin-top:10px;font-style:italic;color:rgba(255,255,255,.4);">"Nio Far" — Nous sommes ensemble</p>
  </div>
</div>
</body></html>`;
}

function buildTeamEmail(r: RentalRecord): string {
  return `
<!DOCTYPE html><html>
<head><meta charset="UTF-8"><style>
  body { font-family:Arial,sans-serif; background:#f4f4f4; margin:0; padding:20px; }
  .card { max-width:600px; margin:0 auto; background:#fff; border-radius:8px; overflow:hidden; }
  .header { background:#3D2B1F; color:#F5D98B; padding:20px 24px; }
  .header h2 { margin:0; font-size:1.2rem; }
  .body { padding:24px; }
  table { width:100%; border-collapse:collapse; }
  td { padding:8px 0; border-bottom:1px solid #eee; font-size:.9rem; }
  td:first-child { color:#666; width:40%; }
  td:last-child { font-weight:600; }
  .badge { display:inline-block; background:#FDF5E8; color:#C4682B; border:1px solid #C4682B; border-radius:4px; padding:2px 8px; font-size:.8rem; font-family:monospace; }
</style></head>
<body>
<div class="card">
  <div class="header">
    <h2>Nouvelle location — <span class="badge" style="color:#F5D98B;border-color:#F5D98B;background:rgba(255,255,255,.1)">${r.reference_number}</span></h2>
  </div>
  <div class="body">
    <table>
      <tr><td>Client</td><td>${r.first_name} ${r.last_name}</td></tr>
      <tr><td>Email</td><td><a href="mailto:${r.email}">${r.email}</a></td></tr>
      <tr><td>T\u00e9l\u00e9phone</td><td>${r.phone ?? "\u2014"}</td></tr>
      <tr><td>Pays</td><td>${r.country}</td></tr>
      <tr><td>Type</td><td>${rentalTypeLabel(r.rental_type)}</td></tr>
      <tr><td>V\u00e9hicule</td><td>${r.rental_title}</td></tr>
      <tr><td>Date de d\u00e9but</td><td>${formatDate(r.start_date)}</td></tr>
      <tr><td>Dur\u00e9e</td><td>${r.days} jour(s)</td></tr>
      <tr><td>Avec chauffeur</td><td>${r.with_driver ? "Oui" : "Non"}</td></tr>
      ${r.pickup_location ? `<tr><td>Lieu de prise en charge</td><td>${r.pickup_location}</td></tr>` : ""}
      <tr><td>Montant estim\u00e9</td><td><strong>${r.estimated_total.toLocaleString("fr-FR")} FCFA</strong></td></tr>
      ${r.special_requests ? `<tr><td>Demandes sp\u00e9ciales</td><td>${r.special_requests}</td></tr>` : ""}
      <tr><td>Re\u00e7u le</td><td>${new Date(r.created_at).toLocaleString("fr-FR")}</td></tr>
    </table>
    <p style="margin-top:20px;">
      <a href="https://niofartourisme.com/admin" style="background:#C4682B;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:bold;">Voir dans l'admin</a>
    </p>
  </div>
</div>
</body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }
  if (req.method !== "POST")
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders,
    });
  try {
    const payload = await req.json();
    const record: RentalRecord = payload.record ?? payload;

    if (!record?.email || !record?.reference_number) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const teamEmail =
      Deno.env.get("TEAM_EMAIL") ?? "reservations@niofartourisme.com";

    const results = await Promise.allSettled([
      sendEmail(
        record.email,
        `Confirmation de votre location NIO FAR — ${record.reference_number}`,
        buildClientEmail(record),
      ),
      sendEmail(
        teamEmail,
        `[NIO FAR] Nouvelle location — ${record.reference_number} — ${record.first_name} ${record.last_name}`,
        buildTeamEmail(record),
      ),
    ]);

    const failed = results.filter((r) => r.status === "rejected");
    if (failed.length > 0)
      console.error("send-rental-notification failures:", failed);

    return new Response(
      JSON.stringify({
        success: failed.length === 0,
        client_email: results[0].status,
        team_email: results[1].status,
        errors: failed.map((f: any) => String(f.reason)),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error("send-rental-notification error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
