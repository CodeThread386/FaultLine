-- Single-query notifications + read state for a user.

create or replace function public.get_notifications_for_user(
  p_user_id uuid,
  p_limit int default 100
)
returns table (
  id uuid,
  message text,
  created_at timestamptz,
  read boolean
)
language sql
stable
security definer
set search_path = public
as $$
  select
    n.id,
    n.message,
    n.created_at,
    (nr.notification_id is not null) as read
  from notifications n
  left join notification_reads nr
    on nr.notification_id = n.id and nr.user_id = p_user_id
  order by n.created_at desc
  limit greatest(1, least(p_limit, 500));
$$;
