-- Run in Supabase SQL editor if leaders registered but dashboard still shows "Not registered yet"
-- (team row exists with registered=true but no team_members row for the leader)

insert into team_members (team_id, user_id)
select t.id, t.leader_id
from teams t
where t.registered = true
  and t.leader_id is not null
  and not exists (
    select 1
    from team_members tm
    where tm.team_id = t.id and tm.user_id = t.leader_id
  )
on conflict (team_id, user_id) do nothing;
