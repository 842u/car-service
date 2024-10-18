CREATE POLICY "only allow image/jpeg and image/png files" ON STORAGE.objects
  FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'avatars'
    AND (STORAGE.extension(name) = 'image/jpeg' OR STORAGE.extension(name) =
      'image/png'));
