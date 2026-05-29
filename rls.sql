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

create policy "judges_own_scores_only" on reviews
  for select using (
    judge_id = auth.uid()
    or exists (select 1 from users u where u.id = auth.uid() and u.role = 'organizer')
    or exists (select 1 from user_roles ur where ur.user_id = auth.uid() and ur.role = 'organizer')
  );

create policy "participants_own_team_submissions" on submissions
  for insert with check (
    team_id in (select team_id from team_members where user_id = auth.uid())
  );

create policy "participants_update_own_submissions" on submissions
  for update using (
    team_id in (select team_id from team_members where user_id = auth.uid())
  );
