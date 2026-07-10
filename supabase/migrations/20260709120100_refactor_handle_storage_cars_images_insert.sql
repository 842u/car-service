DROP TRIGGER handle_storage_cars_images_insert ON storage.objects;

DROP FUNCTION private.handle_storage_cars_images_insert();

CREATE FUNCTION private.handle_storage_cars_images_insert()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
  AS $$
BEGIN
  PERFORM
    private.delete_files_from_bucket_folder('cars_images',(storage.foldername(
      NEW.name))[1], ARRAY[NEW.name]);

  RETURN NEW;
END;
$$;

CREATE TRIGGER handle_storage_cars_images_insert
  BEFORE INSERT ON storage.objects
  FOR EACH ROW
  WHEN(NEW.bucket_id = 'cars_images')
  EXECUTE PROCEDURE private.handle_storage_cars_images_insert();

REVOKE ALL ON FUNCTION private.handle_storage_cars_images_insert() FROM public;

REVOKE ALL ON FUNCTION private.handle_storage_cars_images_insert() FROM authenticated;

REVOKE ALL ON FUNCTION private.handle_storage_cars_images_insert() FROM anon;
