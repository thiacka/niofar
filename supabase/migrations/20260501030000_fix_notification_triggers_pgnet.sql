-- ============================================================
-- FIX: Suppression des triggers pg_net cassés
-- ============================================================
-- Les triggers pg_net étaient trop fragiles :
--   • Nécessitent l'extension pg_net
--   • Nécessitent de stocker l'anon key dans Postgres
--   • Appels HTTP asynchrones non fiables
--
-- Le mécanisme PRIMAIRE et FIABLE est désormais l'appel direct
-- depuis le frontend (booking.service.ts, contact.service.ts)
-- via supabase.functions.invoke() qui gère l'authentification.
-- ============================================================

-- 1. Booking
DROP TRIGGER IF EXISTS booking_insert_notification ON bookings;
DROP FUNCTION IF EXISTS notify_booking_insert();

-- 2. Rental
DROP TRIGGER IF EXISTS rental_booking_insert_notification ON rental_bookings;
DROP FUNCTION IF EXISTS notify_rental_booking_insert();

-- 3. Transfer
DROP TRIGGER IF EXISTS transfer_booking_insert_notification ON transfer_bookings;
DROP FUNCTION IF EXISTS notify_transfer_booking_insert();

-- 4. Contact
DROP TRIGGER IF EXISTS contact_message_insert_notification ON contact_messages;
DROP FUNCTION IF EXISTS notify_contact_message_insert();
