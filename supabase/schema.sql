-- NestWise Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/oogvxhzzdoqucxalohzw/sql

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Users (extends Supabase auth.users) ──────────────────────────────────────
create table if not exists public.profiles (
  id            uuid references auth.users(id) on delete cascade primary key,
  full_name     text,
  email         text,
  stripe_customer_id   text,
  subscription_status  text default 'inactive', -- inactive | active | cancelled
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Listings ──────────────────────────────────────────────────────────────────
create table if not exists public.listings (
  id            uuid default uuid_generate_v4() primary key,
  external_id   text unique,           -- source URL or unique ID
  source        text not null,         -- Craigslist, Chandler, etc.
  address       text,
  neighborhood  text,
  price         integer,               -- monthly rent in dollars
  beds          integer default 1,
  baths         numeric(3,1),
  sqft          integer,
  pet_policy    text default 'unknown', -- dogs_ok | no_pets | unknown
  laundry       text,                  -- in-unit | shared | none
  parking       boolean default false,
  outdoor       boolean default false,
  link          text,
  match_score   integer default 0,
  score_notes   text[],
  first_seen_at timestamptz default now(),
  last_seen_at  timestamptz default now(),
  created_at    timestamptz default now()
);

create index if not exists listings_neighborhood_idx on public.listings(neighborhood);
create index if not exists listings_price_idx on public.listings(price);
create index if not exists listings_score_idx on public.listings(match_score desc);

-- ── Saved Searches ────────────────────────────────────────────────────────────
create table if not exists public.saved_searches (
  id            uuid default uuid_generate_v4() primary key,
  user_id       uuid references public.profiles(id) on delete cascade not null,
  criteria      jsonb not null default '{}'::jsonb,
  -- criteria shape: { min_rent, max_rent, beds[], neighborhoods[], pet, amenities[], alert_times[], instant_alerts, digest }
  alert_email   text,
  last_run_at   timestamptz,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index if not exists saved_searches_user_idx on public.saved_searches(user_id);

-- ── Renter Profiles ───────────────────────────────────────────────────────────
create table if not exists public.renter_profiles (
  id              uuid default uuid_generate_v4() primary key,
  user_id         uuid references public.profiles(id) on delete cascade unique not null,
  income          integer,             -- annual income in dollars
  credit_range    text,                -- e.g. "700-749", "750+"
  move_in_date    date,
  pets            jsonb default '[]'::jsonb,
  -- pets shape: [{ type: "dog", breed: "Golden Retriever", weight: 65 }]
  pre_fill_data   jsonb default '{}'::jsonb,
  -- pre_fill_data: { employer, employer_address, references[], prior_landlord, etc. }
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ── Row Level Security ────────────────────────────────────────────────────────
alter table public.profiles        enable row level security;
alter table public.listings        enable row level security;
alter table public.saved_searches  enable row level security;
alter table public.renter_profiles enable row level security;

-- Profiles: users can only see/edit their own
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Listings: all authenticated users can read
create policy "Authenticated users can view listings"
  on public.listings for select using (auth.role() = 'authenticated');

-- Saved searches: users can only CRUD their own
create policy "Users can manage own searches"
  on public.saved_searches for all using (auth.uid() = user_id);

-- Renter profiles: users can only CRUD their own
create policy "Users can manage own renter profile"
  on public.renter_profiles for all using (auth.uid() = user_id);
