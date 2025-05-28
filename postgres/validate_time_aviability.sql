CREATE OR REPLACE FUNCTION public.validate_time_aviability()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  if_is_time boolean;
  if_is_date boolean;
  st_time time;
  ed_time time;
  new_r RECORD;
BEGIN
  SELECT is_date, is_time,restriction_start,restriction_end INTO if_is_date, if_is_time,st_time,ed_time 
  FROM subscriptions WHERE id = NEW.subscription_id;

  IF if_is_date AND if_is_time THEN
    IF NEW.start_date IS NULL THEN
      RAISE EXCEPTION 'Jāizvēlas datumu';
    END IF;

    IF NEW.start_time IS NULL OR NEW.end_time IS NULL THEN
      RAISE EXCEPTION 'Laiki nevar but tuksie';
    END IF;

    IF NEW.start_time >= ed_time OR NEW.start_time < st_time THEN
      RAISE EXCEPTION 'Sākuma laiks nav korekts';
    END IF;

    IF NEW.end_time <= st_time OR NEW.end_time > ed_time THEN
      RAISE EXCEPTION 'Beigu laiks nav korekts';
    END IF;

    IF NOT (NEW.start_time::text ~ '^(0[0-9]|1[0-9]|2[0-3]):00:00$')
     OR NOT (NEW.end_time::text ~ '^(0[0-9]|1[0-9]|2[0-3]):00:00$') THEN
      RAISE EXCEPTION 'Nepareizs laika formāts';
    END IF;

    IF NEW.start_time >= NEW.end_time THEN
      RAISE EXCEPTION 'Sākuma laiks nevar būt vēlāks par beigu laiku';
    END IF;

    FOR new_r IN
      SELECT start_time, end_time
      FROM user_subscription
      WHERE start_date = NEW.start_date
      AND subscription_id = NEW.subscription_id
    LOOP
      IF NOT ((NEW.end_time <= new_r.start_time) OR (NEW.start_time >= new_r.end_time)) THEN
        RAISE EXCEPTION 'Laika intervāls nav korekts, izvēlieties korektu';
      END IF;
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS "full_price_calculation" ON "public"."invoice";
CREATE TRIGGER "full_price_calculation"
BEFORE INSERT
ON "public"."invoice"
FOR EACH ROW
EXECUTE FUNCTION "public"."get_price_before_invoice_insert"();