create extension if not exists pgcrypto;

create table if not exists tracks (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  functional_spec text not null
);

insert into tracks (name, functional_spec)
values
  ('Banking', 'Users must complete core banking flows: accounts, transactions, and OTP verification.'),
  ('E-Commerce', 'Users must browse products, add to cart, checkout, and view order status.'),
  ('Food Delivery', 'Users must browse a menu, place an order, and see order tracking.'),
  ('Dating App', 'Users must create a profile, match with others, and use a chat flow.'),
  ('Job Portal', 'Users must browse job listings, apply, and manage applications.')
on conflict (name) do update set functional_spec = excluded.functional_spec;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  login_number integer unique,
  name text,
  role text check (role in ('participant', 'organizer')) default 'participant',
  track_id uuid references tracks(id),
  created_at timestamp default now()
);

create table if not exists user_roles (
  user_id uuid references users(id) on delete cascade,
  role text check (role in ('participant', 'organizer')) not null,
  created_at timestamp default now(),
  primary key (user_id, role)
);

create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  leader_id uuid references users(id),
  track_id uuid references tracks(id),
  registered boolean default false,
  created_at timestamp default now()
);

create table if not exists team_members (
  team_id uuid references teams(id),
  user_id uuid references users(id),
  primary key (team_id, user_id)
);

create table if not exists phases (
  id uuid primary key default gen_random_uuid(),
  name text unique check (name in ('phase_1', 'phase_2')),
  status text check (status in ('locked', 'active', 'closed')) default 'locked',
  submission_deadline timestamp
);

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id),
  phase_id uuid references phases(id),
  repo_url text,
  description text,
  submitted_at timestamp,
  locked boolean default false,
  unique(team_id, phase_id)
);

create table if not exists swaps (
  id uuid primary key default gen_random_uuid(),
  receiving_team_id uuid references teams(id),
  assigned_team_id uuid references teams(id),
  phase_id uuid references phases(id),
  unlocked boolean default false
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  judge_id uuid references users(id),
  team_id uuid references teams(id),
  phase_id uuid references phases(id),
  round text check (round in ('visit_1', 'visit_2', 'final_pitch')),
  score integer check (score >= 0 and score <= 100),
  scores jsonb,
  notes text,
  submitted_at timestamp default now(),
  locked boolean default true,
  unique(team_id, phase_id, round)
);

create table if not exists event_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  sent_by uuid references users(id),
  created_at timestamp default now()
);

create table if not exists notification_reads (
  notification_id uuid references notifications(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  primary key (notification_id, user_id)
);

create table if not exists activity_feed (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  public boolean default true,
  created_at timestamp default now()
);

create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references users(id) on delete set null,
  action text not null,
  payload jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_audit_log_created on audit_log(created_at desc);
create index if not exists idx_audit_log_action on audit_log(action);

insert into phases (name, status, submission_deadline)
values
  ('phase_1', 'locked', null),
  ('phase_2', 'locked', null)
on conflict (name) do nothing;

insert into event_settings (key, value)
values
  ('judge_round', '"visit_1"'),
  ('judge_scoring_open', 'true')
on conflict (key) do nothing;
