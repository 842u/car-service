CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER
  SECURITY DEFINER
  LANGUAGE plpgsql
  SET search_path = ''
  AS $$
DECLARE
  new_username text;
BEGIN
  IF NEW.raw_user_meta_data ->> 'full_name' IS NOT NULL OR
    NEW.raw_user_meta_data ->> 'full_name' != '' THEN
    new_username = NEW.raw_user_meta_data ->> 'full_name';
  ELSE
    new_username = NEW.email;
  END IF;
  INSERT INTO public.profiles(id, username, avatar_url)
    VALUES (NEW.id, new_username, NEW.raw_user_meta_data ->> 'avatar_url');
  RETURN new;
END;
$$
