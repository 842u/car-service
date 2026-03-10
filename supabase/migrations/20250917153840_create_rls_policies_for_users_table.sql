ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users visible for everyone" ON users
  FOR SELECT
    USING (TRUE);

CREATE POLICY "user can be inserted by owner authenticated identity" ON users
  FOR INSERT TO authenticated
    WITH CHECK (auth.uid () = id);

CREATE POLICY "user can be updated by owner authenticated identity" ON users
  FOR UPDATE TO authenticated
    USING (auth.uid () = id)
    WITH CHECK (auth.uid () = id);
