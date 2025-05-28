CREATE OR REPLACE FUNCTION public.check_day_input()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.start_date > NEW.end_date THEN
    RAISE EXCEPTION 'Sākuma datums nevar būt vēlāk par beigu datumu';
  END IF;
  IF NEW.start_date <= (NOW() AT TIME ZONE 'Europe/Riga')::date THEN
    RAISE EXCEPTION 'Nevar izvēlēties laiku, kas ir šodien vai agrāk';
  END IF;
RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS "check_day_input_trigger" ON "public"."user_subscription";
CREATE TRIGGER "check_day_input_trigger"
BEFORE UPDATE OR INSERT
ON "public"."user_subscription"
FOR EACH ROW
EXECUTE FUNCTION "public"."check_day_input"();