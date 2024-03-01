create table profiles (
  id uuid not null references auth.users on delete cascade,
  username text unique,
  avatar_url text,

  primary key (id),
  constraint username_length check (char_length(username) >= 3)
);

alter table
  profiles enable row level security;

create policy "profiles are visible for everyone"
  on profiles
    for select using (true);

create policy "profile can be inserted by owner user"
  on profiles
    for insert with check (auth.uid() = id);

create policy "profile can be updated by owner user"
  on profiles
    for update using (auth.uid() = id);

create function public.handle_new_user() returns trigger as $$
  declare
    new_username text;
  begin
    if new.raw_user_meta_data->>'full_name' is not null or new.raw_user_meta_data->>'full_name' != ''
      then new_username = new.raw_user_meta_data->>'full_name';
    else
      new_username = new.email;
    end if;

    insert into public.profiles (id, username, avatar_url)
    values (
        new.id,
        new_username,
        new.raw_user_meta_data->>'avatar_url'
      );
    return new;
  end;
  $$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
    for each row execute procedure public.handle_new_user();
