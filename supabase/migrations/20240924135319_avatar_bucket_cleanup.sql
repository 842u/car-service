-- name is hashed file
CREATE
OR REPLACE FUNCTION clean_old_avatar_files () RETURNS TRIGGER AS $$
BEGIN
DELETE FROM STORAGE.objects WHERE bucket_id = 'avatars' and name != new.name;
return new;
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE TRIGGER on_avatar_upload BEFORE INSERT ON STORAGE.objects FOR EACH ROW WHEN (NEW.bucket_id = 'avatars')
EXECUTE PROCEDURE clean_old_avatar_files ();
