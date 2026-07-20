-- Close the direct write paths: the server now writes as service-role, which
-- bypasses RLS, and the browser keeps reading direct under the SELECT
-- policies. Every write policy is dropped and every write privilege is
-- revoked from authenticated and anon, so RLS stops deciding writes and
-- starts refusing them.
--
-- Dropping the policies is not sufficient on its own. With RLS enabled and no
-- matching policy, INSERT fails loudly, but UPDATE and DELETE succeed against
-- zero matched rows rather than erroring, which is indistinguishable over
-- PostgREST from a legitimate no-op write. The REVOKE below is what makes a
-- direct write fail loudly instead of lying about it, and it also covers
-- TRUNCATE, which RLS never governs. It also renders a re-added write policy
-- inert, since a policy grants nothing without the underlying privilege.

-- cars
DROP POLICY IF EXISTS "cars can be added only by authenticated user" ON public.cars;
DROP POLICY IF EXISTS "cars can be edited only by primary owners" ON public.cars;
DROP POLICY IF EXISTS "cars can be deleted only by primary owners" ON public.cars;

-- cars_ownerships
DROP POLICY IF EXISTS "only primary car owner can add co-owners" ON public.cars_ownerships;
DROP POLICY IF EXISTS "primary owner can birth their own ownership row" ON public.cars_ownerships;
DROP POLICY IF EXISTS "only primary owner can update ownership records of their car" ON public.cars_ownerships;
DROP POLICY IF EXISTS "co-owner ownership can be deleted by primary owner" ON public.cars_ownerships;
DROP POLICY IF EXISTS "co-owner can delete his ownership" ON public.cars_ownerships;

-- service_logs. Neither creator policy carries an ownership predicate, so
-- dropping them also closes the hole where a co-owner removed from a car kept
-- write access to the logs they authored there: authorship does not outlive
-- ownership.
DROP POLICY IF EXISTS "car service logs can be created only by car owners" ON public.service_logs;
DROP POLICY IF EXISTS "car service logs can be updated by service log creator" ON public.service_logs;
DROP POLICY IF EXISTS "all car service logs can be updated by primary car owner" ON public.service_logs;
DROP POLICY IF EXISTS "car service logs can be deleted by service log creator" ON public.service_logs;
DROP POLICY IF EXISTS "all car service logs can be deleted by primary car owner" ON public.service_logs;

-- users
DROP POLICY IF EXISTS "user can be inserted by owner authenticated identity" ON public.users;
DROP POLICY IF EXISTS "user can be updated by owner authenticated identity" ON public.users;

-- Revoke the write privileges, including TRUNCATE, from both roles. SELECT
-- stays granted, so browser reads are untouched. Nothing writes as anon:
-- sign-up goes through the admin auth client and the service-role
-- repository.
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.cars FROM authenticated, anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.cars_ownerships FROM authenticated, anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.service_logs FROM authenticated, anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.users FROM authenticated, anon;

-- Make the RPCs server-only. service_role needs no explicit grant here: it
-- already calls other REVOKE-ALL'd functions successfully (delete_test_user_by_email)
-- via privileges granted outside these migrations, at the platform level.
REVOKE EXECUTE ON FUNCTION create_car_with_primary_owner(jsonb, jsonb) FROM authenticated, anon;
REVOKE EXECUTE ON FUNCTION promote_primary_car_owner(uuid, uuid) FROM authenticated, anon;

-- Rewrite promote to run as its caller (service-role) with no authorization
-- decision. The auth.uid() check is stripped: it breaks under service-role
-- anyway (auth.uid() is NULL), and once the execute grant is gone the
-- function is unreachable by a user JWT, so the check has nothing left to
-- guard.
--
-- SECURITY INVOKER, not DEFINER. The only caller left is service-role, which
-- has rolbypassrls and bypasses RLS on its own, so DEFINER buys nothing here.
-- It would cost the fail-safe direction: if a future migration re-granted
-- EXECUTE to authenticated, DEFINER would run as the definer with the check
-- gone and hand any user unconditional promotion, whereas INVOKER runs as the
-- caller, finds no write privilege, and fails closed.
--
-- The final RAISE is kept and is not an authorization leftover. The RPC path
-- never goes through the application's row-count guard, so without it a
-- promote naming a non-co-owner would demote the current primary, promote
-- nobody, and commit, leaving the car with no primary owner (the partial
-- unique index forbids two primaries, not zero).
CREATE OR REPLACE FUNCTION promote_primary_car_owner(new_primary_owner_id uuid, target_car_id uuid)
  RETURNS uuid
  LANGUAGE plpgsql
  SECURITY INVOKER
  SET search_path = ''
  AS $$
DECLARE
  promoted_owner_id uuid;
BEGIN
  UPDATE
    public.cars_ownerships
  SET
    is_primary_owner = FALSE
  WHERE
    car_id = target_car_id
    AND is_primary_owner = TRUE;

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
