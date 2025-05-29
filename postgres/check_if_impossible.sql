CREATE OR REPLACE FUNCTION public.check_if_is_impossible()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT NEW.is_date AND NEW.is_time THEN
    RAISE EXCEPTION 'Nevar tā izdarīt';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS "check_if_impossible" ON "public"."subscriptions";
CREATE TRIGGER "check_if_impossible"
BEFORE INSERT
ON "public"."subscriptions"
FOR EACH ROW
EXECUTE FUNCTION "public"."check_if_is_impossible"();