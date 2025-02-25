CREATE POLICY "cars are visible for creators" ON cars
  FOR SELECT TO authenticated
    USING (created_by = auth.uid());
