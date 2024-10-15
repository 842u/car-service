INSERT INTO STORAGE.buckets(id, NAME, public, file_size_limit, allowed_mime_types)
  VALUES ('avatars', 'avatars', TRUE, 5242880, ARRAY['image/jpeg',
    'image/png', 'image/svg+xml', 'image/webp']);

ALTER TABLE STORAGE.buckets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read acces to avatars bucket" ON STORAGE.objects
  FOR SELECT TO authenticated, anon
    USING (bucket_id = 'avatars');

CREATE POLICY "only owner user can insert files into his folder" ON STORAGE.objects
  FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'avatars'
    AND ((STORAGE.foldername(name))[1] =(
      SELECT
        auth.uid()::text)));

CREATE POLICY "only owner user can update files in his folder" ON STORAGE.objects
  FOR UPDATE TO authenticated
    USING (bucket_id = 'avatars'
      AND ((STORAGE.foldername(name))[1] =(
        SELECT
          auth.uid()::text)));

CREATE POLICY "only owner user can delete files in his folder" ON STORAGE.objects
  FOR DELETE TO authenticated
    USING (bucket_id = 'avatars'
      AND ((STORAGE.foldername(name))[1] =(
        SELECT
          auth.uid()::text)));
