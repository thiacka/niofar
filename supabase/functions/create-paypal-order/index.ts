/**
 * Supabase Edge Function : create-paypal-order
 *
 * Crée un ordre PayPal et retourne l'URL d'approbation pour redirection.
 * Docs : https://developer.paypal.com/docs/api/orders/v2/
 *
 * Secrets requis :
 *   PAYPAL_CLIENT_ID
 *   PAYPAL_CLIENT_SECRET
 *   PAYPAL_ENV         → 'live' ou 'sandbox' (defaut: 'live')
 *   SITE_URL           → URL de production
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

function getBaseUrl(): string {
  const env = (Deno.env.get('PAYPAL_ENV') ?? 'live').toLowerCase();
  return env === 'sandbox'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';
}

async function getAccessToken(): Promise<string> {
  const clientId = Deno.env.get('PAYPAL_CLIENT_ID') ?? '';
  const secret   = Deno.env.get('PAYPAL_CLIENT_SECRET') ?? '';
  if (!clientId || !secret) throw new Error('PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET not configured');

  const creds = btoa(`${clientId}:${secret}`);
  const res = await fetch(`${getBaseUrl()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${creds}`,
      'Content-Type':  'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`PayPal auth error: ${JSON.stringify(data)}`);
  return data.access_token as string;
}

// XOF (FCFA) is not supported by PayPal. Approx conversion to EUR (1 EUR = 655.957 XOF).
// Amounts are rounded to 2 decimals as PayPal requires.
function convertXofToEur(xof: number): string {
  return (xof / 655.957).toFixed(2);
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const { reference, amount, label, email } = await req.json();
    if (!reference || !amount) {
      return new Response(JSON.stringify({ error: 'Missing reference or amount' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const siteUrl = Deno.env.get('SITE_URL') ?? 'https://niofartourisme.com';
    const token = await getAccessToken();
    const eurAmount = convertXofToEur(Number(amount));

    const orderRes = await fetch(`${getBaseUrl()}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: reference,
          description: `NIO FAR — ${label ?? 'Réservation'}`,
          custom_id: reference,
          amount: {
            currency_code: 'EUR',
            value: eurAmount,
          },
        }],
        payer: email ? { email_address: email } : undefined,
        application_context: {
          brand_name: 'NIO FAR Tourisme',
          user_action: 'PAY_NOW',
          return_url: `${siteUrl}/confirmation/${reference}?payment=success&provider=paypal`,
          cancel_url: `${siteUrl}/payment/${reference}?payment=cancelled`,
        },
      }),
    });

    const order = await orderRes.json();
    if (!orderRes.ok) {
      console.error('PayPal create order error:', order);
      return new Response(JSON.stringify({ error: order.message ?? 'PayPal error', details: order }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const approveLink = (order.links ?? []).find((l: { rel: string; href: string }) => l.rel === 'approve');
    if (!approveLink) {
      return new Response(JSON.stringify({ error: 'No approve link returned by PayPal' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ url: approveLink.href, order_id: order.id }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('create-paypal-order error:', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
