/*
  # Remove booking_insert_notification trigger

  1. Changes
    - Drop the database trigger `booking_insert_notification` on `bookings`
    - Drop the helper function `notify_booking_insert()`

  2. Reason
    - Email notifications are now triggered directly from the Angular frontend
      by invoking the `send-booking-notification` edge function after insert.
    - The DB trigger relied on a `app.supabase_anon_key` GUC that is not set,
      so it silently returned without sending emails (or was duplicating them).
    - Keeping both caused duplicate sends and a 400 error when the trigger
      fired with an anon key misconfiguration.

  3. Notes
    - No data is affected; only the trigger and helper function are removed.
*/

DROP TRIGGER IF EXISTS booking_insert_notification ON bookings;
DROP FUNCTION IF EXISTS notify_booking_insert();
