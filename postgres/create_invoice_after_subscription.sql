CREATE OR REPLACE FUNCTION public.create_invoice_after_subscription()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN

    INSERT INTO invoice (
        user_subscription_id,
        created_at,
        number_id,
        full_price
    )
    VALUES (
        NEW.id,
        now(),
        'MOM' || NEW.id::text,  
        (
          SELECT s.price
          FROM subscriptions s, user_subscription u
          WHERE s.id = u.subscription_id 
          AND u.id = NEW.id
        )
    );
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS "after_user_subscription_insert" ON "public"."user_subscription";

CREATE TRIGGER "after_user_subscription_insert"
AFTER INSERT
ON "public"."user_subscription"
FOR EACH ROW
EXECUTE FUNCTION "public"."create_invoice_after_subscription"();