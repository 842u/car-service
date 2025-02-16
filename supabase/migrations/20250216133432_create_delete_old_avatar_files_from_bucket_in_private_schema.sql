/*
 * Deleting "files" from the bucket via SQL only deletes records from the
 * objects table, so it should be done via Storage API client libraries
 * or directly via http request to not orphan files in actual storage:
 * https://supabase.com/docs/guides/storage/management/delete-objects
 * https://github.com/orgs/supabase/discussions/7067
 * https://github.com/orgs/supabase/discussions/3124
 * https://github.com/GaryAustin1/supa-file-helper/blob/main/main.sql
 */
CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;

CREATE FUNCTION private.delete_old_avatar_files_from_bucket()
  RETURNS TRIGGER
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
  RAISE log 'Deleting old avatars for user: (%).', NEW.owner;

  SELECT
    decrypted_secret INTO service_role_key
  FROM
    vault.decrypted_secrets
  WHERE
    name = 'SUPABASE_SERVICE_ROLE_KEY';

  SELECT
    decrypted_secret INTO api_url
  FROM
    vault.decrypted_secrets
  WHERE
    name = 'SUPABASE_URL';

  SELECT
    coalesce(array_agg(name), '{}') INTO avatar_files_to_delete
  FROM
    storage.objects
  WHERE
    bucket_id = 'avatars'
    AND "owner" = NEW.owner
    AND "name" != NEW.name;

  IF avatar_files_to_delete = '{}' THEN
    RAISE LOG 'No avatars to delete, skipping function execution.';
    RETURN NEW;
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

  RETURN NEW;
END;
$$;

CREATE TRIGGER delete_old_avatar_files_from_bucket
  BEFORE INSERT ON STORAGE.objects
  FOR EACH ROW
  WHEN(NEW.bucket_id = 'avatars')
  EXECUTE PROCEDURE private.delete_old_avatar_files_from_bucket();

REVOKE ALL ON FUNCTION private.delete_old_avatar_files_from_bucket() FROM public;

REVOKE ALL ON FUNCTION private.delete_old_avatar_files_from_bucket() FROM authenticated;

REVOKE ALL ON FUNCTION private.delete_old_avatar_files_from_bucket() FROM anon;
