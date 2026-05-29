-- Restrict SECURITY DEFINER RPCs to service_role only.

revoke all on function public.apply_phase_action(text, text, text, uuid) from public;
revoke all on function public.apply_phase_action(text, text, text, uuid) from anon;
revoke all on function public.apply_phase_action(text, text, text, uuid) from authenticated;

revoke all on function public.replace_swaps_for_phase(uuid, jsonb) from public;
revoke all on function public.replace_swaps_for_phase(uuid, jsonb) from anon;
revoke all on function public.replace_swaps_for_phase(uuid, jsonb) from authenticated;

revoke all on function public.register_team_with_members(text, uuid, uuid, uuid[]) from public;
revoke all on function public.register_team_with_members(text, uuid, uuid, uuid[]) from anon;
revoke all on function public.register_team_with_members(text, uuid, uuid, uuid[]) from authenticated;

revoke all on function public.get_notifications_for_user(uuid, int) from public;
revoke all on function public.get_notifications_for_user(uuid, int) from anon;
revoke all on function public.get_notifications_for_user(uuid, int) from authenticated;

grant execute on function public.apply_phase_action(text, text, text, uuid) to service_role;
grant execute on function public.replace_swaps_for_phase(uuid, jsonb) to service_role;
grant execute on function public.register_team_with_members(text, uuid, uuid, uuid[]) to service_role;
grant execute on function public.get_notifications_for_user(uuid, int) to service_role;
