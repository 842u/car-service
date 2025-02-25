CREATE FUNCTION private.handle_cars_insert()
  RETURNS TRIGGER
  SECURITY DEFINER
  LANGUAGE plpgsql
  SET search_path = ''
  AS $$
BEGIN
  INSERT INTO public.cars_ownerships(car_id, owner_id, is_primary_owner)
    VALUES(NEW.id, auth.uid(), TRUE);

  RETURN NEW;
END;
$$;

CREATE TRIGGER handle_cars_insert
  AFTER INSERT ON cars
  FOR EACH ROW
  EXECUTE PROCEDURE private.handle_cars_insert();

REVOKE ALL ON FUNCTION private.handle_cars_insert() FROM public;

REVOKE ALL ON FUNCTION private.handle_cars_insert() FROM authenticated;

REVOKE ALL ON FUNCTION private.handle_cars_insert() FROM anon;
