CREATE OR REPLACE FUNCTION delete_test_user()
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
  AS $$
DECLARE
  test_user_email text;
BEGIN
  SELECT
    decrypted_secret INTO test_user_email
  FROM
    vault.decrypted_secrets
  WHERE
    "name" = 'EMAIL_AUTH_TEST_EMAIL';

  DELETE FROM auth.users
  WHERE email = test_user_email;
END;
$$;

REVOKE ALL ON FUNCTION delete_test_user() FROM public;

REVOKE ALL ON FUNCTION delete_test_user() FROM authenticated;

REVOKE ALL ON FUNCTION delete_test_user() FROM anon;
