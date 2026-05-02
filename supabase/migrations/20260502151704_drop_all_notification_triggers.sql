/*
  # Remove all notification triggers

  1. Changes
    - Drop `rental_booking_insert_notification` on `rental_bookings`
    - Drop `transfer_booking_insert_notification` on `transfer_bookings`
    - Drop `contact_message_insert_notification` on `contact_messages`
    - Drop associated helper functions if they exist

  2. Reason
    - All notifications are now sent directly from the frontend by invoking
      edge functions. DB triggers relied on an unset GUC (`app.supabase_anon_key`)
      and caused silent failures / duplicates.

  3. Notes
    - No data is affected.
*/

DROP TRIGGER IF EXISTS rental_booking_insert_notification ON rental_bookings;
DROP TRIGGER IF EXISTS transfer_booking_insert_notification ON transfer_bookings;
DROP TRIGGER IF EXISTS contact_message_insert_notification ON contact_messages;

DROP FUNCTION IF EXISTS notify_rental_booking_insert();
DROP FUNCTION IF EXISTS notify_transfer_booking_insert();
DROP FUNCTION IF EXISTS notify_contact_message_insert();
