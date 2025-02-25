CREATE FUNCTION private.handle_storage_avatars_insert()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
  AS $$
BEGIN
  PERFORM
    private.delete_files_from_bucket_folder('avatars',(storage.foldername(
      NEW.name))[1], ARRAY[NEW.name]);

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
