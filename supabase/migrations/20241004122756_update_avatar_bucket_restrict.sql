UPDATE
  STORAGE.buckets
SET
  file_size_limit = 1024 * 1024 * 3,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png']
WHERE
  id = 'avatars';
