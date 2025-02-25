CREATE FUNCTION private.handle_cars_delete()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
  AS $$
BEGIN
  PERFORM
    private.delete_files_from_bucket_folder('cars_images', OLD.id::text);

  RETURN OLD;
END;
$$;

CREATE TRIGGER handle_cars_delete
  BEFORE DELETE ON cars
  FOR EACH ROW
  EXECUTE PROCEDURE private.handle_cars_delete();

REVOKE ALL ON FUNCTION private.handle_cars_delete() FROM public;

REVOKE ALL ON FUNCTION private.handle_cars_delete() FROM authenticated;

REVOKE ALL ON FUNCTION private.handle_cars_delete() FROM anon;
