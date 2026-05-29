alter table submissions enable row level security;
alter table teams enable row level security;
alter table activity_feed enable row level security;
alter table reviews enable row level security;

create policy "team members only" on submissions
  for select using (
    team_id in (
      select team_id from team_members where user_id = auth.uid()
    )
  );

create policy "judge track access" on teams
  for select using (
    track_id in (
      select track_id from users where id = auth.uid()
    )
  );

create policy "public feed" on activity_feed
  for select using (public = true);

create policy "judge insert only" on reviews
  for insert with check (judge_id = auth.uid());
