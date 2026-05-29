-- One score per team per phase per round (redundant judge-level unique removed).

alter table reviews drop constraint if exists reviews_judge_id_team_id_phase_id_round_key;
