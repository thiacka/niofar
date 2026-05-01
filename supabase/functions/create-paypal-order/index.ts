/**
 * Supabase Edge Function : create-paypal-order
 *
 * Crée une commande PayPal (Orders v2) et retourne l'URL d'approbation.
 *
 * Secrets requis :
 *   PAYPAL_CLIENT_ID     → Client ID PayPal (live ou sandbox)
 *   PAYPAL_CLIENT_SECRET → Secret PayPal
 *   SITE_URL             → URL de production (ex: https://niofartourisme.com)
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PayPalAccessToken {
  access_token: string;
}

interface PayPalOrder {
  id: string;
  status: string;
  links: Array<{ href: string; rel: string; method: string }>;
}

async function getPayPalAccessToken(clientId: string, clientSecret: string): Promise<string> {
  // Détecter sandbox vs live d'après le client_id
  const isSandbox = clientId.endsWith('SB') || clientId.includes('sb-');
  const baseUrl = isSandbox ? 'https://api.sandbox.paypal.com' : 'https://api.paypal.com';

  const res = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal auth error: ${err}`);
  }

  const data: PayPalAccessToken = await res.json();
  return data.access_token;
}

async function createPayPalOrder(
  accessToken: string,
  clientId: string,
  reference: string,
  amount: number,
  label: string,
  email: string,
  siteUrl: string
): Promise<string> {
  const isSandbox = clientId.endsWith('SB') || clientId.includes('sb-');
  const baseUrl = isSandbox ? 'https://api.sandbox.paypal.com' : 'https://api.paypal.com';

  const payload = {
    intent: 'CAPTURE',
    purchase_units: [{
      reference_id: reference,
      custom_id: reference,
      description: `NIO FAR — ${label}`,
      amount: {
        currency_code: 'XOF',
        value: String(Math.round(amount)),
      },
      payee: {
        email_address: email,
      },
    }],
    application_context: {
      brand_name: 'NIO FAR Tourisme',
      landing_page: 'LOGIN',
      user_action: 'PAY_NOW',
      return_url: `${siteUrl}/confirmation/${reference}?payment=success`,
      cancel_url: `${siteUrl}/payment/${reference}?payment=cancelled`,
    },
  };

  const res = await fetch(`${baseUrl}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`PayPal order error: ${err}`);
  }

  const order: PayPalOrder = await res.json();

  const approveLink = order.links.find(l => l.rel === 'approve');
  if (!approveLink) {
    throw new Error('No PayPal approval URL found');
  }

  return approveLink.href;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { reference, amount, label, email } = await req.json();

    const clientId     = Deno.env.get('PAYPAL_CLIENT_ID')     ?? '';
    const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET') ?? '';
    const siteUrl      = Deno.env.get('SITE_URL')             ?? 'https://niofartourisme.com';

    if (!clientId || !clientSecret) {
      return new Response(JSON.stringify({ error: 'Missing PayPal credentials' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const accessToken = await getPayPalAccessToken(clientId, clientSecret);
    const approvalUrl = await createPayPalOrder(
      accessToken, clientId, reference, amount, label, email, siteUrl
    );

    return new Response(JSON.stringify({ approval_url: approvalUrl }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('create-paypal-order error:', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
