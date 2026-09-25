create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'farmer' check (role in ('farmer', 'buyer', 'logistics', 'inspector', 'admin', 'fpo')),
  name text not null,
  phone text,
  location text,
  fpo_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.crop_lots (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid not null references public.profiles(id) on delete restrict,
  fpo_id uuid references public.profiles(id) on delete set null,
  crop_type text not null check (crop_type in ('soybean', 'tur', 'wheat', 'chana', 'watermelon', 'kharbuja', 'onion')),
  quantity numeric not null check (quantity > 0),
  unit text not null default 'quintal',
  harvest_date date,
  location text not null,
  price_expected numeric not null check (price_expected >= 0),
  ai_prescreen_score numeric,
  ai_prescreen_grade text check (ai_prescreen_grade in ('A', 'B', 'C')),
  inspector_grade text check (inspector_grade in ('A', 'B', 'C')),
  final_grade text check (final_grade in ('A', 'B', 'C')),
  status text not null default 'listed' check (status in ('listed', 'under_verification', 'verified', 'sold', 'delivered', 'paid', 'aggregated')),
  qr_code text,
  is_aggregated boolean not null default false,
  parent_lot_id uuid references public.crop_lots(id) on delete set null,
  contributing_lots_count integer,
  moisture_pct numeric,
  foreign_matter_pct numeric,
  damaged_grain_pct numeric,
  inspection_notes text,
  photos text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.aggregated_lot_contributions (
  id uuid primary key default gen_random_uuid(),
  aggregated_lot_id uuid not null references public.crop_lots(id) on delete cascade,
  original_lot_id uuid not null references public.crop_lots(id) on delete restrict,
  farmer_id uuid not null references public.profiles(id) on delete restrict,
  farmer_name text not null,
  location text not null,
  quantity numeric not null check (quantity > 0),
  unit text not null default 'quintal',
  grade text check (grade in ('A', 'B', 'C')),
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles(id) on delete restrict,
  lot_id uuid not null references public.crop_lots(id) on delete restrict,
  quantity numeric not null check (quantity > 0),
  price_agreed numeric not null check (price_agreed >= 0),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'invoiced', 'paid', 'scheduled', 'picked_up', 'in_transit', 'delivered', 'completed', 'cancelled')),
  delivery_run_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  lot_id uuid not null references public.crop_lots(id) on delete restrict,
  buyer_id uuid not null references public.profiles(id) on delete restrict,
  buyer_name text not null,
  seller_id uuid not null references public.profiles(id) on delete restrict,
  rating smallint not null check (rating between 1 and 5),
  comment text not null,
  flagged_for_review boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.quality_inspections (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid not null references public.crop_lots(id) on delete cascade,
  crop_type text not null,
  inspector_id uuid not null references public.profiles(id) on delete restrict,
  inspector_name text not null,
  farmer_id uuid not null references public.profiles(id) on delete restrict,
  farmer_name text not null,
  moisture_pct numeric not null,
  foreign_matter_pct numeric not null,
  damaged_grain_pct numeric not null,
  declared_grade text check (declared_grade in ('A', 'B', 'C')),
  ai_score numeric,
  final_grade text not null check (final_grade in ('A', 'B', 'C')),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  title text not null,
  message text not null,
  link text not null,
  read boolean not null default false,
  type text not null check (type in ('order', 'delivery', 'inspection', 'feedback', 'admin')),
  created_at timestamptz not null default now()
);

create index if not exists crop_lots_farmer_id_idx on public.crop_lots(farmer_id);
create index if not exists crop_lots_status_idx on public.crop_lots(status);
create index if not exists orders_buyer_id_idx on public.orders(buyer_id);
create index if not exists orders_lot_id_idx on public.orders(lot_id);
create index if not exists notifications_user_id_idx on public.notifications(user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  requested_role text := coalesce(new.raw_user_meta_data ->> 'role', 'farmer');
begin
  if requested_role not in ('farmer', 'buyer', 'logistics', 'fpo') then
    requested_role := 'farmer';
  end if;

  insert into public.profiles (id, role, name, location)
  values (
    new.id,
    requested_role,
    coalesce(nullif(new.raw_user_meta_data ->> 'name', ''), split_part(new.email, '@', 1)),
    nullif(new.raw_user_meta_data ->> 'location', '')
  )
  on conflict (id) do update set
    role = excluded.role,
    name = excluded.name,
    location = excluded.location;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

insert into public.profiles (id, role, name, location)
select
  id,
  case
    when raw_user_meta_data ->> 'role' in ('farmer', 'buyer', 'logistics', 'inspector', 'admin', 'fpo')
      then raw_user_meta_data ->> 'role'
    else 'farmer'
  end,
  coalesce(nullif(raw_user_meta_data ->> 'name', ''), split_part(email, '@', 1)),
  nullif(raw_user_meta_data ->> 'location', '')
from auth.users
on conflict (id) do nothing;

alter table public.profiles enable row level security;
alter table public.crop_lots enable row level security;
alter table public.aggregated_lot_contributions enable row level security;
alter table public.orders enable row level security;
alter table public.feedback enable row level security;
alter table public.quality_inspections enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "Public can view profiles" on public.profiles;
create policy "Public can view profiles" on public.profiles
  for select to anon, authenticated using (true);

drop policy if exists "Users can update their profile" on public.profiles;
create policy "Users can update their profile" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Public can view crop lots" on public.crop_lots;
create policy "Public can view crop lots" on public.crop_lots
  for select to anon, authenticated using (true);

drop policy if exists "Farmers can create crop lots" on public.crop_lots;
create policy "Farmers can create crop lots" on public.crop_lots
  for insert to authenticated with check (auth.uid() = farmer_id);

drop policy if exists "Owners can update crop lots" on public.crop_lots;
create policy "Owners can update crop lots" on public.crop_lots
  for update to authenticated using (auth.uid() = farmer_id) with check (auth.uid() = farmer_id);

drop policy if exists "Authenticated users can view contributions" on public.aggregated_lot_contributions;
create policy "Authenticated users can view contributions" on public.aggregated_lot_contributions
  for select to authenticated using (true);

drop policy if exists "Authenticated users can create contributions" on public.aggregated_lot_contributions;
create policy "Authenticated users can create contributions" on public.aggregated_lot_contributions
  for insert to authenticated with check (auth.uid() = farmer_id);

drop policy if exists "Users can view related orders" on public.orders;
create policy "Users can view related orders" on public.orders
  for select to authenticated using (auth.uid() = buyer_id or exists (
    select 1 from public.crop_lots lot where lot.id = orders.lot_id and lot.farmer_id = auth.uid()
  ));

drop policy if exists "Buyers can create orders" on public.orders;
create policy "Buyers can create orders" on public.orders
  for insert to authenticated with check (auth.uid() = buyer_id);

drop policy if exists "Users can view feedback" on public.feedback;
create policy "Users can view feedback" on public.feedback
  for select to authenticated using (true);

drop policy if exists "Buyers can create feedback" on public.feedback;
create policy "Buyers can create feedback" on public.feedback
  for insert to authenticated with check (auth.uid() = buyer_id);

drop policy if exists "Authenticated users can view inspections" on public.quality_inspections;
create policy "Authenticated users can view inspections" on public.quality_inspections
  for select to authenticated using (true);

drop policy if exists "Inspectors can create inspections" on public.quality_inspections;
create policy "Inspectors can create inspections" on public.quality_inspections
  for insert to authenticated with check (auth.uid() = inspector_id);

drop policy if exists "Users can view their notifications" on public.notifications;
create policy "Users can view their notifications" on public.notifications
  for select to authenticated using (user_id = auth.uid()::text or user_id = 'all');

drop policy if exists "Users can update their notifications" on public.notifications;
create policy "Users can update their notifications" on public.notifications
  for update to authenticated using (user_id = auth.uid()::text) with check (user_id = auth.uid()::text);
