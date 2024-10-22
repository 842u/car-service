CREATE OR REPLACE FUNCTION delete_avatar_on_user_delete()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
  AS $$
DECLARE
  deleted_user_id uuid;
  files_to_delete text[];
  file_name text;
  service_role_key text;
  api_url text;
  file_url text;
  request_headers extensions.http_header[];
  request_status int;
BEGIN
  SELECT
    OLD.id INTO deleted_user_id;

  RAISE log 'Deleting avatars for user: %', OLD.id;

  SELECT
    decrypted_secret INTO service_role_key
  FROM
    vault.decrypted_secrets
  WHERE
    "name" = 'SUPABASE_SERVICE_ROLE_KEY';

  SELECT
    decrypted_secret INTO api_url
  FROM
    vault.decrypted_secrets
  WHERE
    "name" = 'SUPABASE_URL';

  SELECT
    coalesce(array_agg("name"), '{}') INTO files_to_delete
  FROM
    storage.objects
  WHERE
    bucket_id = 'avatars'
    AND "owner" = deleted_user_id;

  FOREACH file_name IN ARRAY files_to_delete LOOP
    file_url := api_url || '/storage/v1/object/avatars/' || file_name;
    request_headers := ARRAY[extensions.http_header('Authorization',
      'Bearer ' || service_role_key)];

    RAISE LOG 'Deleting file from URL: %', file_url;

    SELECT
      "status"
    FROM
      extensions.http(('DELETE', file_url, request_headers, NULL,
	NULL)::extensions.http_request) INTO request_status;

    RAISE LOG 'DELETE request_status: %', request_status;

    IF request_status NOT BETWEEN 200 AND 299 THEN
      RAISE EXCEPTION 'HTTP DELETE request failed for file % with status code %', file_name, request_status;
    END IF;
  END LOOP;

  RETURN OLD;
END;
$$;

CREATE OR REPLACE TRIGGER on_user_delete
  BEFORE DELETE ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE delete_avatar_on_user_delete();

REVOKE ALL ON FUNCTION delete_avatar_on_user_delete() FROM public;

REVOKE ALL ON FUNCTION delete_avatar_on_user_delete() FROM authenticated;

REVOKE ALL ON FUNCTION delete_avatar_on_user_delete() FROM anon;
