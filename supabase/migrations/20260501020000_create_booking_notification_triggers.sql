-- ============================================================
-- Email notification triggers (BACKUP mechanism)
-- ============================================================
-- IMPORTANT: Le mécanisme PRIMAIRE d'envoi d'emails est désormais
-- l'appel direct depuis le frontend (booking.service.ts) via
-- supabase.functions.invoke(). Ces triggers sont un backup au cas
-- où le frontend échoue ou l'utilisateur ferme l'onglet.
--
-- Pour que les triggers fonctionnent, il faut :
-- 1. L'extension pg_net activée
-- 2. L'URL externe de Supabase (pas http://kong:8000)
-- 3. Le header Authorization: Bearer <anon-key>
--
-- Configuration requise (à exécuter UNE FOIS dans l'éditeur SQL Supabase) :
--   ALTER DATABASE postgres SET "app.supabase_url" TO 'https://ukecyldurjcnpcxdhfcc.supabase.co';
--   ALTER DATABASE postgres SET "app.supabase_anon_key" TO 'eyJhbGciOiJIUzI1NiIs...';
-- Puis redémarrer la connexion PostgreSQL.
-- ============================================================

-- Enable pg_net extension for HTTP requests from PostgreSQL
CREATE EXTENSION IF NOT EXISTS pg_net;

-- ============================================================
-- 1. Booking notifications (circuits / excursions)
-- ============================================================
CREATE OR REPLACE FUNCTION notify_booking_insert()
RETURNS TRIGGER AS $$
DECLARE
  base_url TEXT := coalesce(current_setting('app.supabase_url', true), 'https://ukecyldurjcnpcxdhfcc.supabase.co');
  anon_key TEXT := coalesce(current_setting('app.supabase_anon_key', true), '');
  response RECORD;
BEGIN
  IF anon_key = '' THEN
    RAISE WARNING 'notify_booking_insert: app.supabase_anon_key not set — skipping HTTP call';
    RETURN NEW;
  END IF;

  SELECT * INTO response FROM net.http_post(
    url := base_url || '/functions/v1/send-booking-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || anon_key
    ),
    body := jsonb_build_object('record', row_to_json(NEW))
  );

  IF response.status >= 300 THEN
    RAISE WARNING 'notify_booking_insert: HTTP % — %', response.status, response.content;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS booking_insert_notification ON bookings;
CREATE TRIGGER booking_insert_notification
  AFTER INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_booking_insert();

-- ============================================================
-- 2. Rental booking notifications
-- ============================================================
CREATE OR REPLACE FUNCTION notify_rental_booking_insert()
RETURNS TRIGGER AS $$
DECLARE
  base_url TEXT := coalesce(current_setting('app.supabase_url', true), 'https://ukecyldurjcnpcxdhfcc.supabase.co');
  anon_key TEXT := coalesce(current_setting('app.supabase_anon_key', true), '');
  response RECORD;
BEGIN
  IF anon_key = '' THEN
    RAISE WARNING 'notify_rental_booking_insert: app.supabase_anon_key not set — skipping HTTP call';
    RETURN NEW;
  END IF;

  SELECT * INTO response FROM net.http_post(
    url := base_url || '/functions/v1/send-rental-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || anon_key
    ),
    body := jsonb_build_object('record', row_to_json(NEW))
  );

  IF response.status >= 300 THEN
    RAISE WARNING 'notify_rental_booking_insert: HTTP % — %', response.status, response.content;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS rental_booking_insert_notification ON rental_bookings;
CREATE TRIGGER rental_booking_insert_notification
  AFTER INSERT ON rental_bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_rental_booking_insert();

-- ============================================================
-- 3. Transfer booking notifications
-- ============================================================
CREATE OR REPLACE FUNCTION notify_transfer_booking_insert()
RETURNS TRIGGER AS $$
DECLARE
  base_url TEXT := coalesce(current_setting('app.supabase_url', true), 'https://ukecyldurjcnpcxdhfcc.supabase.co');
  anon_key TEXT := coalesce(current_setting('app.supabase_anon_key', true), '');
  response RECORD;
BEGIN
  IF anon_key = '' THEN
    RAISE WARNING 'notify_transfer_booking_insert: app.supabase_anon_key not set — skipping HTTP call';
    RETURN NEW;
  END IF;

  SELECT * INTO response FROM net.http_post(
    url := base_url || '/functions/v1/send-transfer-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || anon_key
    ),
    body := jsonb_build_object('record', row_to_json(NEW))
  );

  IF response.status >= 300 THEN
    RAISE WARNING 'notify_transfer_booking_insert: HTTP % — %', response.status, response.content;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS transfer_booking_insert_notification ON transfer_bookings;
CREATE TRIGGER transfer_booking_insert_notification
  AFTER INSERT ON transfer_bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_transfer_booking_insert();

-- ============================================================
-- 4. Contact message notifications
-- ============================================================
CREATE OR REPLACE FUNCTION notify_contact_message_insert()
RETURNS TRIGGER AS $$
DECLARE
  base_url TEXT := coalesce(current_setting('app.supabase_url', true), 'https://ukecyldurjcnpcxdhfcc.supabase.co');
  anon_key TEXT := coalesce(current_setting('app.supabase_anon_key', true), '');
  response RECORD;
BEGIN
  IF anon_key = '' THEN
    RAISE WARNING 'notify_contact_message_insert: app.supabase_anon_key not set — skipping HTTP call';
    RETURN NEW;
  END IF;

  SELECT * INTO response FROM net.http_post(
    url := base_url || '/functions/v1/send-contact-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || anon_key
    ),
    body := jsonb_build_object('record', row_to_json(NEW))
  );

  IF response.status >= 300 THEN
    RAISE WARNING 'notify_contact_message_insert: HTTP % — %', response.status, response.content;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS contact_message_insert_notification ON contact_messages;
CREATE TRIGGER contact_message_insert_notification
  AFTER INSERT ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_contact_message_insert();
