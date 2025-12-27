-- Likes table
create table if not exists project_likes (
  project_id text primary key,
  likes int not null default 0,
  updated_at timestamptz not null default now()
);

-- Simple upsert-based like incrementer
create or replace function toggle_like(p_project_id text, p_increment int)
returns void
language plpgsql
security definer
as $$
begin
  insert into project_likes (project_id, likes)
  values (p_project_id, greatest(p_increment, 0))
  on conflict (project_id) do
    update set likes = greatest(0, project_likes.likes + p_increment),
              updated_at = now();
end;
$$;

-- Optional: Row Level Security with a simple policy (or keep RLS off for this table)
alter table project_likes enable row level security;
create policy "allow anon increments"
  on project_likes for update using (true);
create policy "allow anon inserts"
  on project_likes for insert with check (true);
