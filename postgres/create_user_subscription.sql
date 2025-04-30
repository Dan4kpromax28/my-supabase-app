CREATE OR REPLACE FUNCTION create_user_subscription(
	cl_name text, cl_surname text, cl_email text, cl_phone texy, cl_subscription bigint, cl_information text, 
	cl_start_date date, cl_start_time time, cl_end_time
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
	DECLARE 
		my_client_id BIGINT;
	BEGIN
		SELECT id INTO my_client_id FROM client WHERE email = cl_email;
		IF my_client_id IS NULL THEN 
			INSERT INTO client(name, surname, email, phone_number)
			VALUES (cl_name, cl_surname, cl_email, cl_phone)
			RETURNING id INTO my_client_id;
		ELSE 
			UPDATE client SET name = cl_name, surname = cl_surname, phone_number = cl_phone WHERE id = my_client_id;
		END IF;
				INSERT INTO user_subscription(client_id, subscription_id, information, start_date, start_time, end_time)
		VALUES (my_client_id, cl_subscription, cl_information, cl_start_date, cl_start_time, cl_end_time);
	END;
$$;