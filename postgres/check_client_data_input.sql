CREATE OR REPLACE FUNCTION check_client_data_input()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
	BEGIN
		IF NEW.name IS NULL OR (char_length(NEW.name) < 2 OR char_length(NEW.name) > 30) THEN
			RAISE EXCEPTION 'Nekorekta vārda ievade';
		END IF;

		IF NEW.surname IS NULL OR (char_length(NEW.surname) < 2 OR char_length(NEW.surname) > 30) THEN
			RAISE EXCEPTION 'Nekorekta uzvārda ievade';
		END IF;

		IF NEW.email IS NULL OR NEW.email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
			RAISE EXCEPTION 'Nekorekta e-pasta ievade';
		END IF;

		IF NEW.phone_number IS NULL OR NEW.phone_number !~* '^\+?[0-9]{8,15}$' THEN
			RAISE EXCEPTION 'Nekorekta telefona numura ievade';
		END IF;

		RETURN NEW;
	END;
$$

DROP TRIGGER IF EXISTS "check_client_data" ON "public"."client";
CREATE TRIGGER "check_client_data"
BEFORE UPDATE OR INSERT
ON "public"."client"
FOR EACH ROW
EXECUTE FUNCTION "public"."check_client_data_input"();