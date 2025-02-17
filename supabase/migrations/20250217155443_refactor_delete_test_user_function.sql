DROP FUNCTION delete_test_user();

CREATE FUNCTION delete_test_user(test_user_index integer)
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
    "name" = 'SUPABASE_TEST_USER_EMAIL';

  DELETE FROM auth.users
  WHERE email = test_user_index || test_user_email;
END;
$$;

REVOKE ALL ON FUNCTION delete_test_user(integer) FROM public;

REVOKE ALL ON FUNCTION delete_test_user(integer) FROM authenticated;

REVOKE ALL ON FUNCTION delete_test_user(integer) FROM anon;
