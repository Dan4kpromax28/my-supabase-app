CREATE OR REPLACE FUNCTION public.validate_subscription_input()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.price < 0 THEN
    RAISE EXCEPTION 'Cena nevar būt negatīva';
  END IF;
  IF NEW.duration_value <= 0 THEN
    RAISE EXCEPTION 'Intervāls nevar būt negatīvs';
  END IF;
  IF NEW.additional_hour_price < 0 THEN
    RAISE EXCEPTION 'Papildus cena nevar būt negatīva';
  END IF;
  IF NEW.restriction_start >= NEW.restriction_end THEN
    RAISE EXCEPTION 'Sākums nevar būt vēlāks nekā beigas';
  END IF;
  IF NOT (NEW.restriction_start::text ~ '^(0[0-9]|1[0-9]|2[0-3]):00:00$')
   OR (NOT (NEW.restriction_end::text ~ '^(0[0-9]|1[0-9]|2[0-3]):00:00$') AND NEW.restriction_end::text != '23:59:59')
  THEN
    RAISE EXCEPTION 'Nepareizais laika formāts';
  END IF;
  IF NEW.is_time AND NEW.is_date THEN
    NEW.duration_type := 'stundas';
  END IF;
  IF (NOT NEW.is_time AND NEW.is_date) OR (NOT NEW.is_time AND NOT NEW.is_date) THEN
    NEW.duration_type := 'dienas';
    NEW.additional_hour_price := NULL;
  END IF;
  NEW.time_restriction := TO_CHAR(NEW.restriction_start, 'HH24:MI') || '-' || TO_CHAR(NEW.restriction_end, 'HH24:MI');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS "check_subscription_input" ON "public"."subscriptions";
CREATE TRIGGER "check_subscription_input"
BEFORE INSERT OR UPDATE
ON "public"."subscriptions"
FOR EACH ROW
EXECUTE FUNCTION "public"."validate_subscription_input"();