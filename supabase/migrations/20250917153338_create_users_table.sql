CREATE TABLE users (
  id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  user_name text NOT NULL,
  avatar_url text,
  PRIMARY KEY (id),
  CONSTRAINT email_length CHECK ((CHAR_LENGTH(email) >= 6) AND (CHAR_LENGTH(email) <= 254)),
  CONSTRAINT user_name_length CHECK ((CHAR_LENGTH(user_name) >= 3) AND (CHAR_LENGTH(user_name) <= 32))
);
