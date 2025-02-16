ALTER TABLE cars_ownerships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "car ownership are visible only for owners" ON cars_ownerships
  FOR SELECT TO authenticated
    USING (owner_id = auth.uid());

CREATE POLICY "co-owner ownership can be deleted by primary owner" ON cars_ownerships
  FOR DELETE TO authenticated
    USING (car_id IN (
      SELECT
        car_id
      FROM
        cars_ownerships
      WHERE
        owner_id = auth.uid() AND is_primary_owner = TRUE)
        AND is_primary_owner = FALSE);

CREATE POLICY "co-owner can delete his ownership" ON cars_ownerships
  FOR DELETE TO authenticated
    USING (owner_id = auth.uid()
      AND is_primary_owner = FALSE);
