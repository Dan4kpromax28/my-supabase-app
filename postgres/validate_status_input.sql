CREATE OR REPLACE FUNCTION public.validate_status_input()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT (NEW.status = 'valid' OR NEW.status = 'new' OR NEW.status = 'accepted' OR NEW.status = 'invalid' OR NEW.status = 'rejected') THEN
    RAISE EXCEPTION 'Notika kļūda ar statusa ievadi, lūdzu ievadiet pareizo statusu';
  END IF;
  RETURN NEW;
END;
$$;