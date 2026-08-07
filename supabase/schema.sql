-- ============================================================
-- ReelTrade DB schema — run this in Supabase SQL Editor
-- ============================================================

-- 1. USERS (profile extends auth.users)
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  avatar_url text,
  role text not null default 'user' check (role in ('user','admin')),
  status text not null default 'active' check (status in ('active','muted','banned')),
  created_at timestamptz not null default now()
);

-- Auto-create profile row when someone signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, username)
  values (new.id, coalesce(new.raw_user_meta_data->>'username', split_part(new.email,'@',1)));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. ITEMS
create table public.items (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  category text not null default 'fish', -- fish, rod, bait, skin, other
  rarity text not null default 'common', -- common, uncommon, rare, epic, legendary, mythic, secret
  image_url text,
  description text,
  status text not null default 'available' check (status in ('available','in_trade','traded')),
  created_at timestamptz not null default now()
);

-- 3. TRADES
create table public.trades (
  id uuid primary key default gen_random_uuid(),
  user_a_id uuid not null references public.users(id) on delete cascade,
  user_b_id uuid not null references public.users(id) on delete cascade,
  item_a_id uuid not null references public.items(id) on delete cascade,
  item_b_id uuid not null references public.items(id) on delete cascade,
  status text not null default 'pending' check (
    status in ('pending','confirmed','ps_sent','completed','rejected','cancelled')
  ),
  accepted_a boolean not null default false,
  accepted_b boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-confirm a trade once both sides accept, and lock the traded items
create function public.handle_trade_update()
returns trigger as $$
begin
  if new.accepted_a and new.accepted_b and new.status = 'pending' then
    new.status := 'confirmed';
  end if;
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

create trigger on_trade_update
  before update on public.trades
  for each row execute procedure public.handle_trade_update();

-- When a trade is confirmed, mark both items as in_trade; when completed, mark traded; when rejected/cancelled, free them
create function public.handle_trade_status_change()
returns trigger as $$
begin
  if new.status = 'confirmed' and old.status = 'pending' then
    update public.items set status = 'in_trade' where id in (new.item_a_id, new.item_b_id);
  elsif new.status = 'completed' and old.status <> 'completed' then
    update public.items set status = 'traded' where id in (new.item_a_id, new.item_b_id);
  elsif new.status in ('rejected','cancelled') and old.status not in ('rejected','cancelled') then
    update public.items set status = 'available' where id in (new.item_a_id, new.item_b_id);
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_trade_status_change
  after update on public.trades
  for each row execute procedure public.handle_trade_status_change();

-- 4. TRADE MESSAGES (private per-trade chat)
create table public.trade_messages (
  id uuid primary key default gen_random_uuid(),
  trade_id uuid not null references public.trades(id) on delete cascade,
  sender_id uuid not null references public.users(id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now()
);

-- 5. GLOBAL CHAT
create table public.global_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.users(id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now()
);

-- 6. PRIVATE SERVER LINKS (sent by admin once trade is confirmed)
create table public.private_servers (
  id uuid primary key default gen_random_uuid(),
  trade_id uuid not null unique references public.trades(id) on delete cascade,
  link text not null,
  sent_by uuid not null references public.users(id),
  sent_at timestamptz not null default now()
);

-- 7. REPORTS
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.users(id) on delete cascade,
  reported_user_id uuid not null references public.users(id) on delete cascade,
  trade_id uuid references public.trades(id) on delete set null,
  reason text not null,
  status text not null default 'open' check (status in ('open','reviewed','dismissed')),
  created_at timestamptz not null default now()
);

-- ============================================================
-- RLS
-- ============================================================
alter table public.users enable row level security;
alter table public.items enable row level security;
alter table public.trades enable row level security;
alter table public.trade_messages enable row level security;
alter table public.global_messages enable row level security;
alter table public.private_servers enable row level security;
alter table public.reports enable row level security;

-- USERS
create policy "users are viewable by everyone" on public.users for select using (true);
create policy "users can update own profile" on public.users for update using (auth.uid() = id);
create policy "admin can update any user" on public.users for update
  using (exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));

-- ITEMS
create policy "items viewable by everyone" on public.items for select using (true);
create policy "owner can insert own item" on public.items for insert with check (auth.uid() = owner_id);
create policy "owner can update own item" on public.items for update using (auth.uid() = owner_id);
create policy "owner can delete own item" on public.items for delete using (auth.uid() = owner_id);

-- TRADES — only the two participants (or admin) can see/act
create policy "participants can view trade" on public.trades for select
  using (auth.uid() = user_a_id or auth.uid() = user_b_id or exists (
    select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'
  ));
create policy "user can create trade as participant" on public.trades for insert
  with check (auth.uid() = user_a_id);
create policy "participants can update trade" on public.trades for update
  using (auth.uid() = user_a_id or auth.uid() = user_b_id or exists (
    select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'
  ));

-- TRADE MESSAGES — only participants of that trade
create policy "participants can view trade messages" on public.trade_messages for select
  using (exists (
    select 1 from public.trades t
    where t.id = trade_id and (auth.uid() = t.user_a_id or auth.uid() = t.user_b_id)
  ) or exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));
create policy "participants can send trade messages" on public.trade_messages for insert
  with check (auth.uid() = sender_id and exists (
    select 1 from public.trades t
    where t.id = trade_id and (auth.uid() = t.user_a_id or auth.uid() = t.user_b_id)
  ));

-- GLOBAL MESSAGES — everyone reads, active (non-muted/banned) users write
create policy "everyone can read global chat" on public.global_messages for select using (true);
create policy "active users can post global chat" on public.global_messages for insert
  with check (auth.uid() = sender_id and exists (
    select 1 from public.users u where u.id = auth.uid() and u.status = 'active'
  ));
create policy "admin can delete global messages" on public.global_messages for delete
  using (exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));

-- PRIVATE SERVERS — participants of the trade + admin
create policy "participants can view ps link" on public.private_servers for select
  using (exists (
    select 1 from public.trades t
    where t.id = trade_id and (auth.uid() = t.user_a_id or auth.uid() = t.user_b_id)
  ) or exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));
create policy "admin can insert ps link" on public.private_servers for insert
  with check (exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));

-- REPORTS
create policy "user can create report" on public.reports for insert with check (auth.uid() = reporter_id);
create policy "reporter or admin can view report" on public.reports for select
  using (auth.uid() = reporter_id or exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));
create policy "admin can update report" on public.reports for update
  using (exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin'));

-- ============================================================
-- Realtime: enable replication for chat + trade status tables
-- ============================================================
alter publication supabase_realtime add table public.trade_messages;
alter publication supabase_realtime add table public.global_messages;
alter publication supabase_realtime add table public.trades;

-- ============================================================
-- Storage bucket for item images (create via Dashboard > Storage
-- or run this if pg extension allows): bucket name "item-images", public.
-- ============================================================
