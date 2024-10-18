/*
 * Deleting "files" from the bucket via SQL only deletes records from the
 * objects table, so it should be done via Storage API client libraries
 * or directly via http request to not orphan files in actual storage:
 * https://supabase.com/docs/guides/storage/management/delete-objects
 * https://github.com/orgs/supabase/discussions/7067
 * https://github.com/orgs/supabase/discussions/3124
 * https://github.com/GaryAustin1/supa-file-helper/blob/main/main.sql
 */
DROP TRIGGER IF EXISTS on_avatar_upload ON storage.objects;

DROP FUNCTION IF EXISTS clean_old_avatar_files();

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
  auth_headers jsonb;
  file_url text;
  request_id int;
BEGIN
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
    COALESCE(array_agg(name), '{}') INTO files_to_delete
  FROM
    storage.objects
  WHERE
    bucket_id = 'avatars'
    AND "owner" = NEW.owner
    AND "name" != NEW.name;

  RAISE LOG 'Files to delete: (%)', files_to_delete;

  FOREACH file_name IN ARRAY files_to_delete LOOP
    file_url := api_url || '/storage/v1/object/avatars/' || file_name;
    auth_headers := jsonb_build_object('Authorization', 'Bearer ' || service_role_key);

    RAISE LOG 'Deleting file from URL: %', file_url;

    SELECT
      net.http_delete(url := file_url, headers := auth_headers) INTO request_id;

    RAISE LOG 'DELETE request_id: %', request_id;
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
