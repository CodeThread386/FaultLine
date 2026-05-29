-- Run in Supabase SQL editor for atomic phase / swap / team registration ops.

create or replace function public.apply_phase_action(
  p_phase_name text,
  p_internal_action text,
  p_message text,
  p_organizer_id uuid
)
returns setof phases
language plpgsql
security definer
set search_path = public
as $$
declare
  v_phase_id uuid;
begin
  select id into v_phase_id from phases where name = p_phase_name;
  if v_phase_id is null then
    raise exception 'Invalid phase';
  end if;

  if p_internal_action in ('activate', 'unlock') then
    update phases set status = 'active' where id = v_phase_id;
    update submissions set locked = false where phase_id = v_phase_id;
  elsif p_internal_action = 'lock' then
    update phases set status = 'closed' where id = v_phase_id;
    update submissions set locked = true where phase_id = v_phase_id;
  else
    raise exception 'Invalid action';
  end if;

  insert into notifications (message, sent_by) values (p_message, p_organizer_id);
  insert into activity_feed (message, public) values (p_message, true);

  return query select * from phases where id = v_phase_id;
end;
$$;

create or replace function public.replace_swaps_for_phase(p_phase_id uuid, p_rows jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from swaps where phase_id = p_phase_id;

  if p_rows is not null and jsonb_array_length(p_rows) > 0 then
    insert into swaps (receiving_team_id, assigned_team_id, phase_id, unlocked)
    select
      (r->>'receiving_team_id')::uuid,
      (r->>'assigned_team_id')::uuid,
      p_phase_id,
      coalesce((r->>'unlocked')::boolean, false)
    from jsonb_array_elements(p_rows) as r;
  end if;
end;
$$;

create or replace function public.register_team_with_members(
  p_name text,
  p_leader_id uuid,
  p_track_id uuid,
  p_member_user_ids uuid[]
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_team_id uuid;
  v_uid uuid;
begin
  insert into teams (name, leader_id, track_id, registered)
  values (p_name, p_leader_id, p_track_id, true)
  returning id into v_team_id;

  insert into team_members (team_id, user_id)
  values (v_team_id, p_leader_id)
  on conflict do nothing;

  if p_member_user_ids is not null then
    foreach v_uid in array p_member_user_ids loop
      if v_uid is distinct from p_leader_id then
        insert into team_members (team_id, user_id)
        values (v_team_id, v_uid)
        on conflict do nothing;
      end if;
    end loop;
  end if;

  return v_team_id;
exception
  when others then
    delete from teams where id = v_team_id;
    raise;
end;
$$;
