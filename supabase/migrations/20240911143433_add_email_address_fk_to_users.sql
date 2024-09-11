create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.users (user_id, first_name, last_name, email_address)
  values (
    new.id,
    null,
    null,
    new.email);
  return new;
end;
$$;