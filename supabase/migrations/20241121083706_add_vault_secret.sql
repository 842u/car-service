CREATE FUNCTION add_vault_secret(secret_name text, secret_value text)
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
  AS $$
BEGIN
  PERFORM
    vault.create_secret(secret_value, secret_name);
END;
$$;

REVOKE ALL ON FUNCTION add_vault_secret(text, text) FROM public;

REVOKE ALL ON FUNCTION add_vault_secret(text, text) FROM authenticated;

REVOKE ALL ON FUNCTION add_vault_secret(text, text) FROM anon;
