-- Run this once on an already existing database
-- before using the new multi-role auth flow.

create table if not exists user_roles (
  user_id uuid references users(id) on delete cascade,
  role text check (role in ('participant', 'judge', 'organizer')) not null,
  created_at timestamp default now(),
  primary key (user_id, role)
);

-- Backfill user_roles from existing users.role values.
insert into user_roles (user_id, role)
select id, role
from users
where role is not null
on conflict (user_id, role) do nothing;
