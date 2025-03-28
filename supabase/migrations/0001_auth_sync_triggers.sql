-- Function to insert a new user into public.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

-- Trigger to call handle_new_user on new auth.users signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update user email in public.users
-- Note: You might need more robust logic depending on how you handle email changes
create or replace function public.handle_update_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.users
  set email = new.email
  where id = new.id;
  return new;
end;
$$;

-- Trigger to call handle_update_user when email changes in auth.users
-- Note: Consider if you want this trigger. Updates to auth.users might be frequent.
create trigger on_auth_user_updated
  after update of email on auth.users
  for each row execute procedure public.handle_update_user();


-- Function to delete user from public.users
-- Note: Consider implications of cascading deletes or setting user inactive instead.
create or replace function public.handle_delete_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  delete from public.users where id = old.id;
  return old;
end;
$$;

-- Trigger to call handle_delete_user when user is deleted from auth.users
create trigger on_auth_user_deleted
  after delete on auth.users
  for each row execute procedure public.handle_delete_user();
