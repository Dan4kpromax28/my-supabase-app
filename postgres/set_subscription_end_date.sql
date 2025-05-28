CREATE OR REPLACE FUNCTION public.set_subscription_end_date()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    sub_name TEXT;
    time BOOLEAN;
    date BOOLEAN;
    duration NUMERIC;
BEGIN
    SELECT name, is_time, is_date, duration_value INTO sub_name, time, date, duration 
    FROM subscriptions 
    WHERE id = NEW.subscription_id;

    IF NOT time AND date THEN
        IF NEW.start_date IS NULL THEN
            RAISE EXCEPTION 'Sakuma datums nevar but tukss';
        END IF;
        NEW.end_date := NEW.start_date + (duration || ' days')::INTERVAL;
        NEW.start_time := NULL;
        NEW.end_time := NULL;
    END IF;
    RETURN NEW;
END;
$$;