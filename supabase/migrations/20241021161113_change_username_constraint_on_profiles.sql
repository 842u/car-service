ALTER TABLE profiles
  DROP CONSTRAINT username_length;

ALTER TABLE profiles
  ADD CONSTRAINT username_length CHECK (char_length(username) >= 3 AND
    char_length(username) <= 254);
