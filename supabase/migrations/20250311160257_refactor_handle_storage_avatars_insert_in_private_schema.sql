DROP TRIGGER handle_storage_avatars_insert ON storage.objects;

DROP FUNCTION private.handle_storage_avatars_insert();

CREATE FUNCTION private.handle_storage_avatars_insert()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
  AS $$
DECLARE
  api_url text;
BEGIN
  PERFORM
    private.delete_files_from_bucket_folder('avatars',(storage.foldername(
      NEW.name))[1], ARRAY[NEW.name]);

  SELECT
    decrypted_secret
  FROM
    vault.decrypted_secrets
  WHERE
    name = 'SUPABASE_URL' INTO api_url;

  UPDATE
    public.profiles
  SET
    avatar_url = api_url || '/storage/v1/object/public/avatars/' || NEW.name
  WHERE
    id =(storage.foldername(NEW.name))[1]::uuid;

  RETURN NEW;
END;
$$;

CREATE TRIGGER handle_storage_avatars_insert
  BEFORE INSERT ON storage.objects
  FOR EACH ROW
  WHEN(NEW.bucket_id = 'avatars')
  EXECUTE PROCEDURE private.handle_storage_avatars_insert();

REVOKE ALL ON FUNCTION private.handle_storage_avatars_insert() FROM public;

REVOKE ALL ON FUNCTION private.handle_storage_avatars_insert() FROM authenticated;

REVOKE ALL ON FUNCTION private.handle_storage_avatars_insert() FROM anon;
