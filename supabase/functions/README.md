# Supabase Edge Functions — NIO FAR

## Fonctions disponibles

### `send-booking-notification`
Déclenchée après chaque nouvelle réservation (`bookings` INSERT).
Envoie un email de confirmation au client et une notification à l'équipe.

### `send-rental-notification`
Déclenchée après chaque nouvelle location (`rental_bookings` INSERT).
Envoie un email de confirmation au client (type véhicule/bateau/incentive) et une notification à l'équipe.

### `send-transfer-notification`
Déclenchée après chaque nouveau transfert aéroport (`transfer_bookings` INSERT).
Envoie un email de confirmation au client et une notification à l'équipe.

### `send-contact-notification`
Déclenchée après chaque nouveau message de contact. Envoie une notification à l'équipe.

### `send-welcome-user`
Appelée par le frontend après la création d'un nouvel utilisateur admin.
Génère un token de définition de mot de passe (48h), le stocke dans `password_reset_tokens`,
et envoie un email de bienvenue avec le lien `/admin/set-password?token=...`.

### `reset-password`
Appelée par la page `/admin/set-password` (Angular).
Valide le token, met à jour le `password_hash` de l'utilisateur, invalide le token.

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
**Envoie également un email de confirmation de paiement au client** (vert, badge "PAYÉ").
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
supabase functions deploy send-rental-notification
supabase functions deploy send-transfer-notification
supabase functions deploy send-contact-notification
supabase functions deploy send-welcome-user
supabase functions deploy reset-password
supabase functions deploy create-paytech-payment
supabase functions deploy create-stripe-session
supabase functions deploy payment-webhook
```

### 3. Configurer les secrets
```bash
# Notifications email (Resend — https://resend.com)
supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxxxxx
supabase secrets set TEAM_EMAIL=reservations@niofartourisme.com
supabase secrets set FROM_EMAIL=noreply@niofartourisme.com
supabase secrets set SITE_URL=https://niofartourisme.com

# PayTech — https://paytech.sn/dashboard
supabase secrets set PAYTECH_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
supabase secrets set PAYTECH_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Stripe — https://dashboard.stripe.com/apikeys
supabase secrets set STRIPE_SECRET_KEY=sk_live_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
```

### 4. Appliquer la migration SQL
```bash
supabase db push
# ou manuellement dans Supabase SQL Editor :
# supabase/migrations/20260426090000_create_password_reset_tokens.sql
```

### 5. Configurer les Database Webhooks (Supabase Dashboard → Database → Webhooks)

**Webhook 1 — Nouvelles réservations (circuits/excursions)**
- Table : `bookings` — Event : `INSERT`
- URL : `https://ukecyldurjcnpcxdhfcc.supabase.co/functions/v1/send-booking-notification`

**Webhook 2 — Nouvelles locations**
- Table : `rental_bookings` — Event : `INSERT`
- URL : `https://ukecyldurjcnpcxdhfcc.supabase.co/functions/v1/send-rental-notification`

**Webhook 3 — Nouveaux transferts aéroport**
- Table : `transfer_bookings` — Event : `INSERT`
- URL : `https://ukecyldurjcnpcxdhfcc.supabase.co/functions/v1/send-transfer-notification`

**Webhook 4 — Nouveaux messages de contact**
- Table : `contact_messages` — Event : `INSERT`
- URL : `https://ukecyldurjcnpcxdhfcc.supabase.co/functions/v1/send-contact-notification`

Header à ajouter sur **chaque webhook** :
```
Authorization: Bearer <SUPABASE_ANON_KEY>
```

### 6. Configurer les webhooks de paiement

**PayTech IPN** — configurer dans le dashboard PayTech :
```
URL IPN : https://ukecyldurjcnpcxdhfcc.supabase.co/functions/v1/payment-webhook?source=paytech
```

**Stripe Webhook** — configurer dans le dashboard Stripe > Webhooks :
```
URL : https://ukecyldurjcnpcxdhfcc.supabase.co/functions/v1/payment-webhook?source=stripe
Événements : checkout.session.completed, checkout.session.expired
```
Copier le `Signing secret` (whsec_...) et le définir comme secret `STRIPE_WEBHOOK_SECRET`.

### 7. Colonnes SQL à ajouter si pas encore présentes
```sql
ALTER TABLE bookings          ADD COLUMN IF NOT EXISTS paid_at timestamptz;
ALTER TABLE rental_bookings   ADD COLUMN IF NOT EXISTS paid_at timestamptz;
ALTER TABLE transfer_bookings ADD COLUMN IF NOT EXISTS paid_at timestamptz;
```

---

## Flux emails résumé

| Événement                         | Email client              | Email équipe |
|-----------------------------------|---------------------------|--------------|
| Nouvelle réservation circuit      | ✅ Confirmation (FR/EN)   | ✅ Notification |
| Nouvelle location                 | ✅ Confirmation (FR)      | ✅ Notification |
| Nouveau transfert aéroport        | ✅ Confirmation (FR)      | ✅ Notification |
| Paiement confirmé (PayTech/Stripe)| ✅ Confirmation paiement  | —            |
| Création d'un compte admin        | ✅ Bienvenue + lien setup | —            |
| Renvoi invitation (bouton admin)  | ✅ Nouveau lien setup     | —            |
