-- Three judging rounds per phase: visit_1, visit_2, final_pitch

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
