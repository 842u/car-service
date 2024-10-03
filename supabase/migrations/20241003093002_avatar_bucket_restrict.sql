CREATE POLICY "only allow image/jpeg and image/png files" ON STORAGE.objects FOR INSERT TO authenticated
WITH
  CHECK (
    bucket_id = 'avatars'
    AND (
      STORAGE.extension (NAME) = 'image/jpeg'
      OR STORAGE.extension (NAME) = 'image/png'
    )
  );
