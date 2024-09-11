alter table public.users 
add column created_at timestamp default now();