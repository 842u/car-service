/*
 * To mitigate:
 * ERROR: 42P17: infinite recursion detected in policy for relation "cars_ownerships"
 * https://github.com/orgs/supabase/discussions/3328
 */
CREATE FUNCTION private.is_user_owner_of_car(target_user_id uuid, target_car_id uuid)
  RETURNS bool
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
  AS $$
DECLARE
  is_owner boolean;
BEGIN
  SELECT
    EXISTS (
      SELECT
        1
      FROM
        public.cars_ownerships
      WHERE
        car_id = target_car_id
        AND owner_id = target_user_id) INTO is_owner;

  RETURN is_owner;
END;
$$;

REVOKE ALL ON FUNCTION private.is_user_owner_of_car(uuid, uuid) FROM public;

REVOKE ALL ON FUNCTION private.is_user_owner_of_car(uuid, uuid) FROM authenticated;

REVOKE ALL ON FUNCTION private.is_user_owner_of_car(uuid, uuid) FROM anon;

GRANT EXECUTE ON FUNCTION private.is_user_owner_of_car(uuid, uuid) TO authenticated;
