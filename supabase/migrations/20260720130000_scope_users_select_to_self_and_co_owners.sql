-- "users visible for everyone" has no TO clause, so it also applies to anon.
-- The anon key is public (shipped in the client bundle), so any
-- unauthenticated request can read every email address, id, and username in
-- the table today. Nothing in the product needs that reach: the only two
-- places a user's row is ever read are their own profile and the
-- ownerships table's owner badges, both scoped to a car's owners. Making
-- profiles public instead of car-scoped would keep the exact exposure this
-- migration exists to close, for a feature nothing uses.
--
-- The replacement is row-level, matching how cars' own SELECT policy reaches
-- across to cars_ownerships: a plain subquery against a different table,
-- no SECURITY DEFINER helper, since only a policy that queries its own
-- table risks recursion. A co-owner's full row, including email, is
-- visible to their co-owners; narrowing that further to name and avatar
-- would need a view, and nothing here asks for it. The subquery reads
-- cars_ownerships live, so removing a co-owner revokes visibility
-- immediately, with no extra step.
DROP POLICY "users visible for everyone" ON public.users;

CREATE POLICY "users can see their own row and co-owners of a shared car" ON public.users
  FOR SELECT TO authenticated
    USING (id = auth.uid ()
      OR id IN (
        SELECT
          owner_id
        FROM
          cars_ownerships
        WHERE
          car_id IN (
            SELECT
              car_id
            FROM
              cars_ownerships
            WHERE
              owner_id = auth.uid ())));
