CREATE FUNCTION private.delete_user_cars(user_id uuid)
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
  AS $$
DECLARE
  cars_ids_to_delete uuid[];
BEGIN
  RAISE LOG 'Deleting cars of user id: (%)', user_id;

  SELECT
    coalesce(array_agg(car_id), '{}') INTO cars_ids_to_delete
  FROM
    public.cars_ownerships
  WHERE (owner_id = user_id
    AND is_primary_owner = TRUE);

  IF cars_ids_to_delete = '{}' THEN
    RAISE LOG 'No cars to delete, skipping function execution.';
    RETURN;
  END IF;

  RAISE LOG 'Cars to delete: (%)', cars_ids_to_delete;

  DELETE FROM public.cars
  WHERE id = ANY (cars_ids_to_delete);

  RETURN;
END;
$$;

REVOKE ALL ON FUNCTION private.delete_user_cars(uuid) FROM public;

REVOKE ALL ON FUNCTION private.delete_user_cars(uuid) FROM authenticated;

REVOKE ALL ON FUNCTION private.delete_user_cars(uuid) FROM anon;
