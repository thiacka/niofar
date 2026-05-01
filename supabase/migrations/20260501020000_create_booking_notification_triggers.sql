-- Enable pg_net extension for HTTP requests from PostgreSQL
CREATE EXTENSION IF NOT EXISTS pg_net;

-- ============================================================
-- 1. Booking notifications (circuits / excursions)
-- ============================================================
CREATE OR REPLACE FUNCTION notify_booking_insert()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM net.http_post(
    url := 'http://kong:8000/functions/v1/send-booking-notification',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object('record', row_to_json(NEW))
  );
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
BEGIN
  PERFORM net.http_post(
    url := 'http://kong:8000/functions/v1/send-rental-notification',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object('record', row_to_json(NEW))
  );
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
BEGIN
  PERFORM net.http_post(
    url := 'http://kong:8000/functions/v1/send-transfer-notification',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object('record', row_to_json(NEW))
  );
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
BEGIN
  PERFORM net.http_post(
    url := 'http://kong:8000/functions/v1/send-contact-notification',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object('record', row_to_json(NEW))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS contact_message_insert_notification ON contact_messages;
CREATE TRIGGER contact_message_insert_notification
  AFTER INSERT ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_contact_message_insert();
