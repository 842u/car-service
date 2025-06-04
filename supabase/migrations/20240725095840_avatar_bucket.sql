INSERT INTO STORAGE.buckets(id, NAME, public, file_size_limit, allowed_mime_types)
  VALUES ('avatars', 'avatars', TRUE, 5242880, ARRAY['image/jpeg',
    'image/png', 'image/svg+xml', 'image/webp']);


/*
 * From supabase v2.24.3 RLS is enabled by default for tables in auth, storage, and realtime schemas.
 ! To avoid error this line was commented out:
 ! ALTER TABLE STORAGE.buckets ENABLE ROW LEVEL SECURITY;
 * For more check:
 * https://github.com/supabase/cli/issues/3599#issuecomment-2927614759
 * https://github.com/orgs/supabase/discussions/34270
 */
CREATE POLICY "public read access to avatars bucket" ON STORAGE.objects
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
