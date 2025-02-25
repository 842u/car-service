INSERT INTO storage.buckets(id, NAME, public, file_size_limit, allowed_mime_types)
  VALUES ('cars_images', 'cars_images', TRUE, 1024 * 1024 * 3,
    ARRAY['image/jpeg', 'image/png']);
