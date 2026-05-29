-- Run once in Supabase SQL editor (or via seed script)

alter table users add column if not exists login_number integer;

create unique index if not exists users_login_number_key on users (login_number)
where login_number is not null;
