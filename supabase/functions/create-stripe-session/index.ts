/**
 * Supabase Edge Function : create-stripe-session
 *
 * Crée une session Stripe Checkout et retourne l'URL de redirection.
 * Docs Stripe : https://stripe.com/docs/api/checkout/sessions
 *
 * Secrets requis :
 *   STRIPE_SECRET_KEY  → clé secrète Stripe (sk_live_... ou sk_test_...)
 *   SITE_URL           → URL de production (ex: https://niofartourisme.com)
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

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

    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY') ?? '';
    const siteUrl   = Deno.env.get('SITE_URL')          ?? 'https://niofartourisme.com';

    // Stripe attend les montants en centimes (EUR) ou en unités entières (XOF)
    // XOF est une devise sans décimales — montant en unités directement
    const params = new URLSearchParams({
      'payment_method_types[]':                      'card',
      'line_items[0][price_data][currency]':          'xof',
      'line_items[0][price_data][unit_amount]':        String(Math.round(amount)),
      'line_items[0][price_data][product_data][name]': `NIO FAR — ${label}`,
      'line_items[0][quantity]':                       '1',
      mode:                                            'payment',
      customer_email:                                  email,
      success_url:  `${siteUrl}/confirmation/${reference}?payment=success`,
      cancel_url:   `${siteUrl}/payment/${reference}?payment=cancelled`,
      'metadata[reference]':                           reference,
    });

    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type':  'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const session = await res.json();

    if (!res.ok || !session.url) {
      console.error('Stripe error:', session);
      return new Response(JSON.stringify({ error: session.error?.message ?? 'Stripe error' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('create-stripe-session error:', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
