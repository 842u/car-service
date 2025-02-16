CREATE FUNCTION private.delete_user_avatars(user_id uuid)
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
  AS $$
DECLARE
  avatar_files_to_delete text[];
  avatar_file_name text;
  service_role_key text;
  api_url text;
  avatar_url text;
  request_headers extensions.http_header[];
  request_status int;
BEGIN
  RAISE log 'Deleting avatars for user: (%).', user_id;

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
    coalesce(array_agg("name"), '{}') INTO avatar_files_to_delete
  FROM
    storage.objects
  WHERE
    bucket_id = 'avatars'
    AND "owner" = user_id;

  IF avatar_files_to_delete = '{}' THEN
    RAISE LOG 'No avatars to delete, skipping function execution.';
    RETURN;
  END IF;

  RAISE LOG 'Avatars to delete: (%)', avatar_files_to_delete;

  FOREACH avatar_file_name IN ARRAY avatar_files_to_delete LOOP
    avatar_url := api_url || '/storage/v1/object/avatars/' || avatar_file_name;
    request_headers := ARRAY[extensions.http_header('Authorization',
      'Bearer ' || service_role_key)];

    RAISE LOG 'Deleting avatar from URL: (%)', avatar_url;

    SELECT
      "status"
    FROM
      extensions.http(('DELETE', avatar_url, request_headers, NULL,
	NULL)::extensions.http_request) INTO request_status;

    RAISE LOG 'DELETE request_status: (%).', request_status;

    IF request_status NOT BETWEEN 200 AND 299 THEN
      RAISE EXCEPTION 'HTTP DELETE request failed for avatar (%) with status code (%).', avatar_file_name, request_status;
    END IF;
  END LOOP;

  RETURN;
END;
$$;

REVOKE ALL ON FUNCTION private.delete_user_avatars(uuid) FROM public;

REVOKE ALL ON FUNCTION private.delete_user_avatars(uuid) FROM authenticated;

REVOKE ALL ON FUNCTION private.delete_user_avatars(uuid) FROM anon;
