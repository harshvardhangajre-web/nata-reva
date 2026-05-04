-- ============================================
-- NATA-REVA Supabase Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Results table
create table if not exists public.results (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  score integer not null,
  total integer not null,
  answers jsonb default '[]'::jsonb,
  weak_topics text[] default array[]::text[],
  created_at timestamptz default now()
);

-- Row Level Security
alter table public.results enable row level security;

-- Policies: users can only access their own results
create policy "Users read own results"
  on public.results for select
  using (auth.uid() = user_id);

create policy "Users insert own results"
  on public.results for insert
  with check (auth.uid() = user_id);

create policy "Users delete own results"
  on public.results for delete
  using (auth.uid() = user_id);

-- Index for faster queries
create index if not exists results_user_id_idx on public.results(user_id);
create index if not exists results_created_at_idx on public.results(created_at desc);

-- Profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade not null,
  phone_number text,
  full_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Row Level Security for profiles
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create index if not exists profiles_id_idx on public.profiles(id);
