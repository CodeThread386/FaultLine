create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references users(id) on delete set null,
  action text not null,
  payload jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_audit_log_created on audit_log(created_at desc);
create index if not exists idx_audit_log_action on audit_log(action);

alter table audit_log enable row level security;
