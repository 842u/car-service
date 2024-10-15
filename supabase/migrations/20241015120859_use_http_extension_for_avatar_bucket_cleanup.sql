/*
 * Deleting "files" from the bucket via SQL only deletes records from the
 * objects table, so it should be done via Storage API client libraries
 * or directly via http request to not orphan files in actual storage:
 * https://supabase.com/docs/guides/storage/management/delete-objects
 * https://github.com/orgs/supabase/discussions/7067
 * https://github.com/orgs/supabase/discussions/3124
 * https://github.com/GaryAustin1/supa-file-helper/blob/main/main.sql
 */
/*
 * To ensure data integrity in case of file deletion errors,
 * asynchronous http requests from "pg_net" extension,
 * was changed to synchronous http requests from "http" extension.
 */
CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;

CREATE OR REPLACE FUNCTION delete_old_avatar_files_from_bucket()
  RETURNS TRIGGER
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
    AND "owner" = NEW.owner
    AND "name" != NEW.name;

  RAISE LOG 'Files to delete: (%)', files_to_delete;

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
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER delete_old_avatar_files_from_bucket
  BEFORE INSERT ON STORAGE.objects
  FOR EACH ROW
  WHEN(NEW.bucket_id = 'avatars')
  EXECUTE PROCEDURE delete_old_avatar_files_from_bucket();

REVOKE ALL ON FUNCTION delete_old_avatar_files_from_bucket() FROM public;

REVOKE ALL ON FUNCTION delete_old_avatar_files_from_bucket() FROM authenticated;

REVOKE ALL ON FUNCTION delete_old_avatar_files_from_bucket() FROM anon;
