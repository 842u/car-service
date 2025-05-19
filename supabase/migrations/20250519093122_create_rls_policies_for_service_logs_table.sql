ALTER TABLE service_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "car service logs can be read only by car owners" ON service_logs
  FOR SELECT TO authenticated
    USING ((car_id IN (
      SELECT
        cars_ownerships.car_id
      FROM
        cars_ownerships
      WHERE (cars_ownerships.owner_id = auth.uid()))));

CREATE POLICY "car service logs can be created only by car owners" ON service_logs
  FOR INSERT TO authenticated
    WITH CHECK ((car_id IN (
      SELECT
        cars_ownerships.car_id
      FROM
        cars_ownerships
      WHERE (cars_ownerships.owner_id = auth.uid()))));

CREATE POLICY "car service logs can be updated by service log creator" ON service_logs
  FOR UPDATE TO authenticated
    USING (created_by = auth.uid())
    WITH CHECK (created_by = auth.uid());

CREATE POLICY "all car service logs can be updated by primary car owner" ON service_logs
  FOR UPDATE TO authenticated
    USING (car_id IN (
      SELECT
        cars_ownerships.car_id
      FROM
        cars_ownerships
      WHERE
        cars_ownerships.owner_id = auth.uid() AND cars_ownerships.is_primary_owner = TRUE))
      WITH CHECK (car_id IN (
        SELECT
          cars_ownerships.car_id
        FROM
          cars_ownerships
        WHERE
          cars_ownerships.owner_id = auth.uid() AND cars_ownerships.is_primary_owner = TRUE));

CREATE POLICY "car service logs can be deleted by service log creator" ON service_logs
  FOR DELETE TO authenticated
    USING (created_by = auth.uid());

CREATE POLICY "all car service logs can be deleted by primary car owner" ON service_logs
  FOR DELETE TO authenticated
    USING (car_id IN (
      SELECT
        cars_ownerships.car_id
      FROM
        cars_ownerships
      WHERE
        cars_ownerships.owner_id = auth.uid() AND cars_ownerships.is_primary_owner = TRUE));
