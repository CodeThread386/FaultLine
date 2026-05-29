-- Run after schema.sql

alter table reviews add column if not exists scores jsonb;

create table if not exists event_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

insert into event_settings (key, value)
values
  ('judge_round', '"visit_1"'),
  ('judge_scoring_open', 'true')
on conflict (key) do nothing;
