CREATE FUNCTION private.handle_storage_cars_images_insert()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
  AS $$
DECLARE
  api_url text;
BEGIN
  PERFORM
    private.delete_files_from_bucket_folder('cars_images',(storage.foldername(
      NEW.name))[1], ARRAY[NEW.name]);

  SELECT
    decrypted_secret INTO api_url
  FROM
    vault.decrypted_secrets
  WHERE
    name = 'SUPABASE_URL';

  UPDATE
    public.cars
  SET
    image_url = api_url || '/storage/v1/object/public/cars_images/' || NEW.name
  WHERE
    id =(storage.foldername(NEW.name))[1]::uuid;

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
