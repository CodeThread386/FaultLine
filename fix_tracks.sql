-- Run this in Supabase SQL editor BEFORE seed.sql when you see:
--   could not create unique index "tracks_name_unique" ... Key (name)=(Web Development) is duplicated

-- 1) One row per track name; fix team/user FKs pointing at duplicate ids
create temp table _track_keepers on commit drop as
select distinct on (name) id as keeper_id, name
from tracks
order by name, id;

update teams t
set track_id = k.keeper_id
from tracks tr
join _track_keepers k on k.name = tr.name
where t.track_id = tr.id
  and t.track_id <> k.keeper_id;

update users u
set track_id = k.keeper_id
from tracks tr
join _track_keepers k on k.name = tr.name
where u.track_id = tr.id
  and u.track_id <> k.keeper_id;

delete from tracks tr
where not exists (select 1 from _track_keepers k where k.keeper_id = tr.id);

-- 2) Ensure the five event tracks exist (no unique index required yet)
insert into tracks (name, functional_spec)
select v.name, v.spec
from (
  values
    ('Banking', 'Users must complete core banking flows: accounts, transactions, and OTP verification.'),
    ('E-Commerce', 'Users must browse products, add to cart, checkout, and view order status.'),
    ('Food Delivery', 'Users must browse a menu, place an order, and see order tracking.'),
    ('Dating App', 'Users must create a profile, match with others, and use a chat flow.'),
    ('Job Portal', 'Users must browse job listings, apply, and manage applications.')
) as v(name, spec)
where not exists (select 1 from tracks t where t.name = v.name);

-- 3) Point teams/judges on legacy tracks (e.g. Web Development) → Banking
update teams
set track_id = (select id from tracks where name = 'Banking' limit 1)
where track_id in (
  select id from tracks
  where name not in ('Banking', 'E-Commerce', 'Food Delivery', 'Dating App', 'Job Portal')
);

update users
set track_id = (select id from tracks where name = 'Banking' limit 1)
where track_id in (
  select id from tracks
  where name not in ('Banking', 'E-Commerce', 'Food Delivery', 'Dating App', 'Job Portal')
);

-- 4) Remove leftover legacy tracks
delete from tracks
where name not in ('Banking', 'E-Commerce', 'Food Delivery', 'Dating App', 'Job Portal');

-- 5) Unique index + refresh specs on the canonical five
drop index if exists tracks_name_unique;
create unique index tracks_name_unique on tracks(name);

insert into tracks (name, functional_spec)
values
  ('Banking', 'Users must complete core banking flows: accounts, transactions, and OTP verification.'),
  ('E-Commerce', 'Users must browse products, add to cart, checkout, and view order status.'),
  ('Food Delivery', 'Users must browse a menu, place an order, and see order tracking.'),
  ('Dating App', 'Users must create a profile, match with others, and use a chat flow.'),
  ('Job Portal', 'Users must browse job listings, apply, and manage applications.')
on conflict (name) do update set functional_spec = excluded.functional_spec;
