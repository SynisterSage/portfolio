-- Likes schema for anon-key public counters (no auth).
-- Run this in Supabase SQL Editor (or psql) after wiping old tables.

-- 1) Counts table the app writes to directly (frontend upserts project_id + likes)
create table if not exists public.project_likes (
  project_id text primary key,
  likes int not null default 0,
  updated_at timestamptz not null default now()
);

-- 2) (Optional) Per-client dedupe table if you later add a client UUID
-- Comment out if you only want the global counter above.
create table if not exists public.project_client_likes (
  project_id text not null,
  client_id text not null,
  liked boolean not null default true,
  inserted_at timestamptz not null default now(),
  primary key (project_id, client_id)
);

-- 3) Simple counts view (reads work even without it)
create or replace view public.project_like_counts
with (security_invoker = on) as
select project_id, count(*)::int as likes
from public.project_client_likes
where liked
group by project_id;

-- 4) RLS: allow anon key to read/write the counts table
alter table public.project_likes enable row level security;
drop policy if exists "anon_read_counts" on public.project_likes;
drop policy if exists "anon_update_counts" on public.project_likes;
drop policy if exists "anon_insert_counts" on public.project_likes;
create policy "anon_read_counts"   on public.project_likes for select using (true);
create policy "anon_update_counts" on public.project_likes for update using (true) with check (true);
create policy "anon_insert_counts" on public.project_likes for insert with check (true);

-- 5) RLS: allow anon key to manage per-client rows (only used if you wire client UUIDs)
alter table public.project_client_likes enable row level security;
drop policy if exists "anon_select_like" on public.project_client_likes;
drop policy if exists "anon_insert_like" on public.project_client_likes;
drop policy if exists "anon_update_like" on public.project_client_likes;
create policy "anon_select_like" on public.project_client_likes for select using (true);
create policy "anon_insert_like" on public.project_client_likes for insert with check (true);
create policy "anon_update_like" on public.project_client_likes for update using (true) with check (true);

-- Note: Current frontend upserts directly into project_likes (no RPC, no per-client dedupe).
-- If you later use project_client_likes for dedupe, adjust the frontend to write rows there
-- and derive counts from project_like_counts instead of the raw project_likes table.
