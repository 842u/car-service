CREATE FUNCTION delete_test_user_by_email(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  DELETE FROM auth.users
  WHERE email = user_email;
END;
$function$;

REVOKE ALL ON FUNCTION delete_test_user_by_email(text) FROM public;

REVOKE ALL ON FUNCTION delete_test_user_by_email(text) FROM authenticated;

REVOKE ALL ON FUNCTION delete_test_user_by_email(text) FROM anon;
