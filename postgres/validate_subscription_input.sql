CREATE OR REPLACE FUNCTION validate_subscription_input()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
    BEGIN 
        IF NEW.start_date > NEW.end_date THEN 
            RAISE EXCEPTION 'Sakuma datums nevar but velak bar beiga datumu';
        END IF;
        IF NEW.start_date <= (NOW() AT TIME ZONE 'Europe/Riga')::date THEN 
            RAISE EXCEPTION 'Nevar izveleties laiku kas ir sodien var agrak';
        END IF;
    RETURN NEW;
END;
$$

CREATE TRIGGER check_day_input
BEFORE INSERT OR UPDATE ON user_subscriptions
FOR EACH ROW
EXECUTE FUNCTION validate_subscription_input();