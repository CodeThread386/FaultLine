-- Keep only the earliest review per team / phase / round (first judge wins)
delete from reviews r
using reviews r2
where r.team_id = r2.team_id
  and r.phase_id = r2.phase_id
  and r.round = r2.round
  and r.submitted_at > r2.submitted_at;

create unique index if not exists reviews_team_phase_round_unique
  on reviews (team_id, phase_id, round);
