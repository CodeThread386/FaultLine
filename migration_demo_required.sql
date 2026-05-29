-- Run once in Supabase SQL Editor (required for judge scoring + organizer controls)

-- From migration_judge_scoring.sql
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

-- From migration_judge_rounds_v2.sql
alter table reviews drop constraint if exists reviews_round_check;

update reviews
set round = case
  when round = 'mid_build' then 'visit_1'
  when round = 'pre_final' then 'visit_2'
  when round = 'finals' then 'final_pitch'
  else round
end;

alter table reviews
  add constraint reviews_round_check
  check (round in ('visit_1', 'visit_2', 'final_pitch'));

update event_settings
set value = '"visit_1"'
where key = 'judge_round';

-- One judge per team per phase per round (first score wins)
create unique index if not exists reviews_team_phase_round_unique
  on reviews (team_id, phase_id, round);
