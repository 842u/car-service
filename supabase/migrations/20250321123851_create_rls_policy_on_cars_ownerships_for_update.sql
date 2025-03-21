CREATE POLICY "only primary owner can update ownership records of their car" ON
  public.cars_ownerships
  FOR UPDATE TO authenticated
    USING (car_id IN (
      SELECT
        car_id
      FROM
        public.cars_ownerships
      WHERE
        owner_id = auth.uid() AND is_primary_owner = TRUE));
