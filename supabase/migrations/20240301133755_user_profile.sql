CREATE TABLE
  profiles (
    id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    username TEXT UNIQUE,
    avatar_url TEXT,
    PRIMARY KEY (id),
    CONSTRAINT username_length CHECK (CHAR_LENGTH(username) >= 3)
  );

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles are visible for everyone" ON profiles FOR
SELECT
  USING (TRUE);

CREATE POLICY "profile can be inserted by owner user" ON profiles FOR INSERT
WITH
  CHECK (auth.uid () = id);

CREATE POLICY "profile can be updated by owner user" ON profiles FOR
UPDATE USING (auth.uid () = id);

CREATE FUNCTION public.handle_new_user () RETURNS TRIGGER AS $$
DECLARE new_username text;
BEGIN IF new.raw_user_meta_data->>'full_name' IS NOT NULL
OR new.raw_user_meta_data->>'full_name' != '' THEN new_username = new.raw_user_meta_data->>'full_name';
ELSE new_username = new.email;
END IF;
INSERT INTO public.profiles (id, username, avatar_url)
VALUES (
    new.id,
    new_username,
    new.raw_user_meta_data->>'avatar_url'
  );
RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users FOR EACH ROW
EXECUTE PROCEDURE public.handle_new_user ();
