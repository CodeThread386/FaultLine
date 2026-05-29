-- No separate finals scoring round — two visits per phase only

update event_settings
set value = '"pre_final"'
where key = 'judge_round' and value::text = '"finals"';
