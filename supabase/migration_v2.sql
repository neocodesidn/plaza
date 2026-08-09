-- ============================================================
-- MIGRATION v2 — run this if you already ran schema.sql before.
-- Adds: automatic private-server link assignment + site settings +
-- storage policies for item image uploads.
-- Safe to run once on an existing database (Supabase SQL Editor).
-- ============================================================

-- 1. Private server link pool
create table if not exists public.ps_link_pool (
  id uuid primary key default gen_random_uuid(),
  link text not null,
  status text not null default 'available' check (status in ('available','assigned')),
  added_by uuid references public.users(id),
  created_at timestamptz not null default now()
);

alter table public.ps_link_pool enable row level security;

drop policy if exists "admin can manage ps link pool" on public.ps_link_pool;
create policy "admin can manage ps link pool" on public.ps_link_pool for all
  using (exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));

-- 2. Site settings key/value store
create table if not exists public.site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (key, value) values
  ('site_name', 'ReelTrade'),
  ('contact_info', ''),
  ('maintenance_mode', 'false')
on conflict (key) do nothing;

alter table public.site_settings enable row level security;

drop policy if exists "everyone can read site settings" on public.site_settings;
create policy "everyone can read site settings" on public.site_settings for select using (true);

drop policy if exists "admin can update site settings" on public.site_settings;
create policy "admin can update site settings" on public.site_settings for update
  using (exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));

drop policy if exists "admin can insert site settings" on public.site_settings;
create policy "admin can insert site settings" on public.site_settings for insert
  with check (exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));

-- 3. Auto-assign a private server link the instant a trade is confirmed
create or replace function public.auto_assign_ps_link()
returns trigger as $$
declare
  picked record;
begin
  if new.status = 'confirmed' and old.status <> 'confirmed' then
    select id, link into picked from public.ps_link_pool
      where status = 'available'
      order by created_at asc
      limit 1
      for update skip locked;

    if picked.id is not null then
      insert into public.private_servers (trade_id, link, sent_by)
      values (new.id, picked.link, new.user_a_id)
      on conflict (trade_id) do nothing;

      update public.ps_link_pool set status = 'assigned' where id = picked.id;
      update public.trades set status = 'ps_sent' where id = new.id;
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_trade_confirmed_auto_ps on public.trades;
create trigger on_trade_confirmed_auto_ps
  after update on public.trades
  for each row execute procedure public.auto_assign_ps_link();

-- 4. Storage policies so users can actually upload item images
-- (run only if you haven't already added these from an earlier fix)
drop policy if exists "authenticated users can upload item images" on storage.objects;
create policy "authenticated users can upload item images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'item-images');

drop policy if exists "public can view item images" on storage.objects;
create policy "public can view item images"
on storage.objects for select
to public
using (bucket_id = 'item-images');

drop policy if exists "users can delete own item images" on storage.objects;
create policy "users can delete own item images"
on storage.objects for delete
to authenticated
using (bucket_id = 'item-images' and owner = auth.uid());

-- 5. Make sure trade status changes and PS link inserts stream live to open trade pages
do $$
begin
  if not exists (
    select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'private_servers'
  ) then
    alter publication supabase_realtime add table public.private_servers;
  end if;
  if not exists (
    select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'trades'
  ) then
    alter publication supabase_realtime add table public.trades;
  end if;
end $$;
