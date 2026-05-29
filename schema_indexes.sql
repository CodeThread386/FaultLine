-- Run once in Supabase for event-day query performance (~500 users)

create index if not exists idx_team_members_user_id on team_members(user_id);
create index if not exists idx_team_members_team_id on team_members(team_id);
create index if not exists idx_submissions_team_phase on submissions(team_id, phase_id);
create index if not exists idx_submissions_phase_id on submissions(phase_id);
create index if not exists idx_swaps_receiving_team on swaps(receiving_team_id);
create index if not exists idx_swaps_phase_id on swaps(phase_id);
create index if not exists idx_reviews_team_id on reviews(team_id);
create index if not exists idx_reviews_judge_id on reviews(judge_id);
create index if not exists idx_teams_track_id on teams(track_id);
create index if not exists idx_users_email on users(email);
create index if not exists idx_activity_feed_public_created on activity_feed(public, created_at desc);
create index if not exists idx_notifications_created on notifications(created_at desc);
