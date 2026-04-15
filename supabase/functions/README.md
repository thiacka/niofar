# Supabase Edge Functions — NIO FAR

## Fonctions disponibles

### `send-booking-notification`
Déclenchée après chaque nouvelle réservation (`bookings` INSERT).
Envoie un email de confirmation au client et une notification à l'équipe.

### `send-contact-notification`
Déclenchée après chaque nouveau message de contact. Envoie une notification à l'équipe.

### `create-paytech-payment`
Crée une session de paiement PayTech (Orange Money, Wave, carte locale).
Appelée par le frontend depuis la page `/payment/:reference`.
Retourne une `redirect_url` vers la page de paiement hébergée PayTech.

### `create-stripe-session`
Crée une session Stripe Checkout (Visa, Mastercard, Amex — cartes internationales).
Appelée par le frontend depuis la page `/payment/:reference`.
Retourne l'`url` de la page Stripe Checkout.

### `payment-webhook`
Reçoit les callbacks de PayTech et Stripe après paiement.
Met à jour le statut de la réservation (`confirmed` / `cancelled`) dans Supabase.
- PayTech : POST sans signature (IPN classique)
- Stripe : POST avec vérification de signature `stripe-signature`

---

## Déploiement

### 1. Installer Supabase CLI
```bash
npm install -g supabase
supabase login
supabase link --project-ref ukecyldurjcnpcxdhfcc
```

### 2. Déployer toutes les fonctions
```bash
supabase functions deploy send-booking-notification
supabase functions deploy send-contact-notification
supabase functions deploy create-paytech-payment
supabase functions deploy create-stripe-session
supabase functions deploy payment-webhook
```

### 3. Configurer les secrets

**Notifications email (Resend)**
```bash
supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxxxxx
supabase secrets set TEAM_EMAIL=reservations@niofartourisme.com
supabase secrets set FROM_EMAIL=noreply@niofartourisme.com
```

**PayTech** — Obtenir les clés sur https://paytech.sn/dashboard
```bash
supabase secrets set PAYTECH_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
supabase secrets set PAYTECH_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Stripe** — Obtenir les clés sur https://dashboard.stripe.com/apikeys
```bash
supabase secrets set STRIPE_SECRET_KEY=STRIPE_SECRET_REDACTED
supabase secrets set STRIPE_WEBHOOK_SECRET=WEBHOOK_SECRET_REDACTED
```

**URL du site**
```bash
supabase secrets set SITE_URL=https://niofartourisme.com
```

### 4. Configurer les Database Webhooks (Supabase Dashboard)

**Webhook 1 — Nouvelles réservations**
- Table : `bookings` — Event : `INSERT`
- URL : `https://ukecyldurjcnpcxdhfcc.supabase.co/functions/v1/send-booking-notification`

**Webhook 2 — Nouveaux messages de contact**
- Table : `contact_messages` — Event : `INSERT`
- URL : `https://ukecyldurjcnpcxdhfcc.supabase.co/functions/v1/send-contact-notification`

Header à ajouter sur chaque webhook :
```
Authorization: Bearer <SUPABASE_ANON_KEY>
```

### 5. Configurer les webhooks de paiement

**PayTech IPN** — configurer dans le dashboard PayTech :
```
URL IPN : https://ukecyldurjcnpcxdhfcc.supabase.co/functions/v1/payment-webhook?source=paytech
```

**Stripe Webhook** — configurer dans le dashboard Stripe > Webhooks :
```
URL : https://ukecyldurjcnpcxdhfcc.supabase.co/functions/v1/payment-webhook?source=stripe
Événements à écouter : checkout.session.completed, checkout.session.expired
```
Copier le `Signing secret` (whsec_...) et le définir comme secret `STRIPE_WEBHOOK_SECRET`.

### 6. Colonnes SQL à ajouter aux tables de réservation

```sql
-- Sur les 3 tables de réservation
ALTER TABLE bookings         ADD COLUMN IF NOT EXISTS paid_at timestamptz;
ALTER TABLE rental_bookings  ADD COLUMN IF NOT EXISTS paid_at timestamptz;
ALTER TABLE transfer_bookings ADD COLUMN IF NOT EXISTS paid_at timestamptz;
```
