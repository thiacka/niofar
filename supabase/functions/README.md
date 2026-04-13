# Supabase Edge Functions — NIO FAR

## Fonctions disponibles

### `send-booking-notification`
Déclencher après chaque nouvelle réservation. Envoie :
- Email de confirmation au client
- Email de notification à l'équipe NIO FAR

### `send-contact-notification`
Déclencher après chaque nouveau message de contact. Envoie :
- Email de notification à l'équipe NIO FAR

## Déploiement

### 1. Installer Supabase CLI
```bash
npm install -g supabase
supabase login
supabase link --project-ref ukecyldurjcnpcxdhfcc
```

### 2. Déployer les fonctions
```bash
supabase functions deploy send-booking-notification
supabase functions deploy send-contact-notification
```

### 3. Configurer les secrets
```bash
supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxxxxx
supabase secrets set TEAM_EMAIL=reservations@niofartourisme.com
supabase secrets set FROM_EMAIL=noreply@niofartourisme.com
```

Obtenir une clé API Resend gratuite sur https://resend.com (3 000 emails/mois offerts).

### 4. Configurer les Database Webhooks dans Supabase Dashboard

**Webhook 1 — Nouvelles réservations**
- Table : `bookings`
- Event : `INSERT`
- URL : `https://ukecyldurjcnpcxdhfcc.supabase.co/functions/v1/send-booking-notification`

**Webhook 2 — Nouveaux messages de contact**
- Table : `contact_messages`
- Event : `INSERT`
- URL : `https://ukecyldurjcnpcxdhfcc.supabase.co/functions/v1/send-contact-notification`

Dans les deux cas, ajouter le header :
```
Authorization: Bearer <SUPABASE_ANON_KEY>
```
