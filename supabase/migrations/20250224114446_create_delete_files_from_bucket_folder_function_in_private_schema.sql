CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;

CREATE FUNCTION private.delete_files_from_bucket_folder(target_bucket_id text,
  target_folder_name text, excluded_files text[] DEFAULT NULL)
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
  AS $$
DECLARE
  files_to_delete text[];
  file_name text;
  service_role_key text;
  api_url text;
  file_url text;
  request_headers extensions.http_header[];
  request_status int;
BEGIN
  RAISE log 'Deleting files from bucket: (%), folder: (%).', target_bucket_id, target_folder_name;

  SELECT
    decrypted_secret INTO service_role_key
  FROM
    vault.decrypted_secrets
  WHERE
    name = 'SUPABASE_SERVICE_ROLE_KEY';


  /*
   On local development instance, use docker internal container url to properly handle http request.
   */
  SELECT
    coalesce((
      SELECT
        decrypted_secret
      FROM vault.decrypted_secrets
      WHERE
        name = 'SUPABASE_DOCKER_INTERNAL_API_URL'),(
      SELECT
        decrypted_secret
      FROM vault.decrypted_secrets
      WHERE
        name = 'SUPABASE_URL')) INTO api_url;

  SELECT
    coalesce(array_agg(name), '{}') INTO files_to_delete
  FROM
    storage.objects
  WHERE
    bucket_id = target_bucket_id
    AND (storage.foldername(name))[1] = target_folder_name
    AND (excluded_files IS NULL
      OR array_length(excluded_files, 1) = 0
      OR "name" NOT IN (
        SELECT
          unnest(excluded_files)));

  IF files_to_delete = '{}' THEN
    RAISE LOG 'No Files to delete, skipping function execution.';
    RETURN;
  END IF;

  RAISE LOG 'Files to delete: (%)', files_to_delete;

  FOREACH file_name IN ARRAY files_to_delete LOOP
    file_url := api_url || '/storage/v1/object/' || target_bucket_id || '/'
      || file_name;
    request_headers := ARRAY[extensions.http_header('Authorization',
      'Bearer ' || service_role_key)];

    RAISE LOG 'Deleting file from URL: (%)', file_url;

    SELECT
      "status"
    FROM
      extensions.http(('DELETE', file_url, request_headers, NULL,
	NULL)::extensions.http_request) INTO request_status;

    RAISE LOG 'DELETE request_status: (%).', request_status;

    IF request_status NOT BETWEEN 200 AND 299 THEN
      RAISE EXCEPTION 'HTTP DELETE request failed for file (%) with status code (%).', file_name, request_status;
    END IF;
  END LOOP;

  RETURN;
END;
$$;

REVOKE ALL ON FUNCTION private.delete_files_from_bucket_folder(text, text,
  text[]) FROM public;

REVOKE ALL ON FUNCTION private.delete_files_from_bucket_folder(text, text,
  text[]) FROM authenticated;

REVOKE ALL ON FUNCTION private.delete_files_from_bucket_folder(text, text,
  text[]) FROM anon;
