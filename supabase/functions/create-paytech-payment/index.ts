/**
 * Supabase Edge Function : create-paytech-payment
 *
 * Crée une session de paiement PayTech et retourne l'URL de redirection.
 * Docs PayTech : https://paytech.sn/documentation
 *
 * Secrets requis :
 *   PAYTECH_API_KEY      → clé publique PayTech
 *   PAYTECH_API_SECRET   → clé secrète PayTech
 *   SITE_URL             → URL de production (ex: https://niofartourisme.com)
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const PAYTECH_URL = 'https://paytech.sn/api/payment/request-payment';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { reference, amount, label, email } = await req.json();

    const apiKey    = Deno.env.get('PAYTECH_API_KEY')    ?? '';
    const apiSecret = Deno.env.get('PAYTECH_API_SECRET') ?? '';
    const siteUrl   = Deno.env.get('SITE_URL')           ?? 'https://niofartourisme.com';

    const payload = {
      item_name: label,
      item_price: String(amount),
      currency: 'XOF',
      ref_command: reference,
      command_name: `NIO FAR — ${label}`,
      env: 'prod',
      ipn_url:     `${siteUrl}/api/payment-webhook`,
      success_url: `${siteUrl}/confirmation/${reference}?payment=success`,
      cancel_url:  `${siteUrl}/payment/${reference}?payment=cancelled`,
      custom_field: JSON.stringify({ reference, email }),
    };

    const res = await fetch(PAYTECH_URL, {
      method: 'POST',
      headers: {
        'Content-Type':    'application/json',
        'API_KEY':         apiKey,
        'API_SECRET_KEY':  apiSecret,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok || data.success !== 1) {
      console.error('PayTech error:', data);
      return new Response(JSON.stringify({ error: data.message ?? 'PayTech error' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ redirect_url: data.redirect_url }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('create-paytech-payment error:', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
