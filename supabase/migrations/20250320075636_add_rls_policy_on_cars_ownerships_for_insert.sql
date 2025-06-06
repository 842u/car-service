CREATE POLICY "only primary car owner can add co-owners" ON public.cars_ownerships
  FOR INSERT TO authenticated
    WITH CHECK (owner_id IN (
      SELECT
        car_id
      FROM
        public.cars_ownerships
      WHERE
        auth.uid() = owner_id AND is_primary_owner = TRUE));
