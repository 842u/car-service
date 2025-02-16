ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cars can be added only by authenticated user" ON cars
  FOR INSERT TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "cars are visible only for owners" ON cars
  FOR SELECT TO authenticated
    USING (id IN (
      SELECT
        car_id
      FROM
        cars_ownerships
      WHERE
        owner_id = auth.uid()));

CREATE POLICY "cars can be edited only by primary owners" ON cars
  FOR UPDATE TO authenticated
    USING (id IN (
      SELECT
        car_id
      FROM
        cars_ownerships
      WHERE
        owner_id = auth.uid() AND is_primary_owner = TRUE))
      WITH CHECK (id IN (
        SELECT
          car_id
        FROM
          cars_ownerships
        WHERE
          owner_id = auth.uid() AND is_primary_owner = TRUE));

CREATE POLICY "cars can be deleted only by primary owners" ON cars
  FOR DELETE TO authenticated
    USING (id IN (
      SELECT
        car_id
      FROM
        cars_ownerships
      WHERE
        owner_id = auth.uid() AND is_primary_owner = TRUE));
