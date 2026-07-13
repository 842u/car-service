-- Restore the single-primary backstop and correct the promote swap.
--
-- The partial unique index that guarantees one primary owner per car had been
-- dropped, leaving nothing at the database level to stop a car from having two
-- primary owners or none. Recreate it, then replace the promote function so it
-- works with the index: run as the definer (bypassing RLS), self-check the
-- caller is the current primary, demote the current primary first (zero
-- primaries is allowed by the partial index), then promote the target. The
-- target must already be a co-owner: a plain UPDATE that raises when no row
-- matched, no insert-a-stranger path.

CREATE UNIQUE INDEX one_primary_owner_per_car ON public.cars_ownerships(car_id)
WHERE
  is_primary_owner = TRUE;

CREATE OR REPLACE FUNCTION switch_primary_car_owner(new_primary_owner_id uuid, target_car_id uuid)
  RETURNS uuid
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
  AS $$
DECLARE
  current_primary_owner uuid;
  promoted_owner_id uuid;
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

  UPDATE
    public.cars_ownerships
  SET
    is_primary_owner = FALSE
  WHERE
    car_id = target_car_id
    AND owner_id = current_primary_owner;

  UPDATE
    public.cars_ownerships
  SET
    is_primary_owner = TRUE
  WHERE
    car_id = target_car_id
    AND owner_id = new_primary_owner_id
  RETURNING
    owner_id INTO promoted_owner_id;

  IF promoted_owner_id IS NULL THEN
    RAISE EXCEPTION 'The target owner is not a co-owner of this car.';
  END IF;

  RETURN promoted_owner_id;
END;
$$;

REVOKE ALL ON FUNCTION switch_primary_car_owner(uuid, uuid) FROM public;

REVOKE ALL ON FUNCTION switch_primary_car_owner(uuid, uuid) FROM authenticated;

REVOKE ALL ON FUNCTION switch_primary_car_owner(uuid, uuid) FROM anon;

GRANT EXECUTE ON FUNCTION switch_primary_car_owner(uuid, uuid) TO authenticated;
