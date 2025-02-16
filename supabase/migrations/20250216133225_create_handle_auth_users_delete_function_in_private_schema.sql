CREATE FUNCTION private.handle_auth_users_delete()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
  AS $$
BEGIN
  PERFORM
    private.delete_user_cars(OLD.id);

  PERFORM
    private.delete_user_avatars(OLD.id);

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
