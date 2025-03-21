CREATE FUNCTION switch_primary_car_owner(new_primary_owner_id uuid, target_car_id uuid)
  RETURNS uuid
  LANGUAGE plpgsql
  SET search_path = ''
  AS $$
DECLARE
  current_primary_owner uuid;
  new_owner_exists boolean;
BEGIN
  SELECT
    owner_id INTO current_primary_owner
  FROM
    public.cars_ownerships
  WHERE
    car_id = target_car_id
    AND is_primary_owner = TRUE;

  IF current_primary_owner IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Only the current primary owner can grant primary ownership.';
  END IF;

  SELECT
    EXISTS (
      SELECT
        1
      FROM
        public.cars_ownerships
      WHERE
        car_id = target_car_id
        AND owner_id = new_primary_owner_id) INTO new_owner_exists;

  IF NOT new_owner_exists THEN
    INSERT INTO public.cars_ownerships(car_id, owner_id, is_primary_owner)
      VALUES (target_car_id, new_primary_owner_id, TRUE);
  ELSE
    UPDATE
      public.cars_ownerships
    SET
      is_primary_owner = TRUE
    WHERE
      car_id = target_car_id
      AND owner_id = new_primary_owner_id;
  END IF;

  UPDATE
    public.cars_ownerships
  SET
    is_primary_owner = FALSE
  WHERE
    car_id = target_car_id
    AND is_primary_owner = TRUE
    AND owner_id = current_primary_owner;

  RETURN new_primary_owner_id;

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'An error occurred: %', SQLERRM;

END;

$$;

REVOKE ALL ON FUNCTION switch_primary_car_owner(uuid, uuid) FROM public;

REVOKE ALL ON FUNCTION switch_primary_car_owner(uuid, uuid) FROM authenticated;

REVOKE ALL ON FUNCTION switch_primary_car_owner(uuid, uuid) FROM anon;

GRANT EXECUTE ON FUNCTION switch_primary_car_owner(uuid, uuid) TO authenticated;
