DROP TRIGGER IF EXISTS on_avatar_upload ON STORAGE.objects;

DROP FUNCTION IF EXISTS clean_old_avatar_files ();

CREATE FUNCTION clean_old_avatar_files () RETURNS TRIGGER AS $$
BEGIN
    -- Delete all files in the 'avatars' bucket within the user's folder, except the file being uploaded
    DELETE FROM STORAGE.objects
    WHERE bucket_id = 'avatars'
      AND name LIKE (substring(new.name from 1 for position('/' in new.name))) || '%'  -- Target all files in the user's folder
      AND name != new.name;

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

CREATE TRIGGER on_avatar_upload BEFORE INSERT ON STORAGE.objects FOR EACH ROW WHEN (NEW.bucket_id = 'avatars')
EXECUTE PROCEDURE clean_old_avatar_files ();
