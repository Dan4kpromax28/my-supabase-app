CREATE OR REPLACE FUNCTION public.get_price_before_invoice_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  st_time time;
  ed_time time;
  is_ti boolean;
  is_da boolean;
  actual_price integer;
  ad_price integer;
  duration integer;
  duration_val integer;
BEGIN

  SELECT start_time, end_time INTO st_time, ed_time 
  FROM user_subscription
  WHERE NEW.user_subscription_id = user_subscription.id;

  SELECT s.price, s.additional_hour_price, s.is_time, s.is_date, s.duration_value 
  INTO actual_price, ad_price, is_ti, is_da, duration_val 
  FROM subscriptions AS s, user_subscription
  WHERE NEW.user_subscription_id = user_subscription.id AND
  user_subscription.subscription_id = s.id;

  IF is_ti = false AND is_da = false OR is_ti = false AND is_da = true THEN
    NEW.full_price := actual_price;
  ELSE
    duration := EXTRACT(EPOCH FROM ed_time - st_time);
    IF (3600 * duration_val) >= duration THEN
      NEW.full_price := actual_price;
    ELSE
      NEW.full_price := actual_price + ((duration - (3600 * duration_val)) / 3600) * ad_price;
    END IF;
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