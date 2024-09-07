create table public.users (
  user_id uuid not null references auth.users on delete cascade,
  first_name text,
  last_name text,
  email_address text,

  primary key (user_id)
);

alter table public.users enable row level security;

drop function if exists public.handle_new_user cascade;

-- inserts a row into public.users
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.users (user_id, first_name, last_name, email_address)
  values (new.id, new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name', new.raw_user_meta_data ->> 'email_address');
  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create table public.question_and_answer (
    id serial primary key,
    job_title varchar(255) not null,
    question varchar(2056) not null,
    answer varchar(8192) not null,
    user_uuid uuid not null references public.users(user_id),
    created_at timestamp default now()
);
