DROP TRIGGER handle_auth_users_delete ON auth.users;

DROP FUNCTION private.handle_auth_users_delete();

CREATE FUNCTION private.handle_auth_users_delete()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
  AS $$
BEGIN
  PERFORM
    private.delete_files_from_bucket_folder('avatars', OLD.id::text);

  PERFORM
    private.delete_user_cars(OLD.id);

  RETURN OLD;
END;
$$;

CREATE TRIGGER handle_auth_users_delete
  BEFORE DELETE ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE private.handle_auth_users_delete();

REVOKE ALL ON FUNCTION private.handle_auth_users_delete() FROM public;

REVOKE ALL ON FUNCTION private.handle_auth_users_delete() FROM authenticated;

REVOKE ALL ON FUNCTION private.handle_auth_users_delete() FROM anon;
