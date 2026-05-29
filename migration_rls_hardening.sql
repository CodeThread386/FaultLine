-- Harden RLS (run after rls.sql). Service role bypasses RLS; these protect direct anon client access.

drop policy if exists "judges_own_scores_only" on reviews;
create policy "judges_own_scores_only" on reviews
  for select using (
    judge_id = auth.uid()
    or exists (
      select 1 from users u where u.id = auth.uid() and u.role = 'organizer'
    )
    or exists (
      select 1 from user_roles ur where ur.user_id = auth.uid() and ur.role = 'organizer'
    )
  );

drop policy if exists "participants_own_team_submissions" on submissions;
create policy "participants_own_team_submissions" on submissions
  for insert with check (
    team_id in (select team_id from team_members where user_id = auth.uid())
  );

drop policy if exists "participants_update_own_submissions" on submissions;
create policy "participants_update_own_submissions" on submissions
  for update using (
    team_id in (select team_id from team_members where user_id = auth.uid())
  );

alter table audit_log enable row level security;
