CREATE POLICY "only authenticated users can read from cars_images bucket" ON
  storage.objects
  FOR SELECT TO authenticated
    USING (bucket_id = 'cars_images');

CREATE POLICY "only primary car owner can insert car image" ON storage.objects
  FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'cars_images'
    AND (storage.foldername(name))[1]::uuid IN (
      SELECT
        car_id
      FROM
        cars_ownerships
      WHERE
        owner_id = auth.uid() AND is_primary_owner = TRUE));

CREATE POLICY "only primary car owner can update car image" ON storage.objects
  FOR UPDATE TO authenticated
    USING (bucket_id = 'cars_images'
      AND (storage.foldername(name))[1]::uuid IN (
        SELECT
          car_id
        FROM
          cars_ownerships
        WHERE
          owner_id = auth.uid() AND is_primary_owner = TRUE))
        WITH CHECK (bucket_id = 'cars_images'
        AND (storage.foldername(name))[1]::uuid IN (
          SELECT
            car_id
          FROM
            cars_ownerships
          WHERE
            owner_id = auth.uid() AND is_primary_owner = TRUE));

CREATE POLICY "only primary car owner can delete car image" ON storage.objects
  FOR DELETE TO authenticated
    USING (bucket_id = 'cars_images'
      AND (storage.foldername(name))[1]::uuid IN (
        SELECT
          car_id
        FROM
          cars_ownerships
        WHERE
          owner_id = auth.uid() AND is_primary_owner = TRUE));
