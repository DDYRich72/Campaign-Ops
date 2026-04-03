-- ============================================================
-- AI Campaign Operator — Initial Database Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ── business_profiles ────────────────────────────────────────
-- One profile per Clerk user. Created on first sign-up or
-- when the user saves business info in Settings.

create table if not exists public.business_profiles (
  id               uuid primary key default gen_random_uuid(),
  clerk_user_id    text not null unique,
  business_name    text,
  industry         text,
  default_brand_voice text,
  website          text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ── campaigns ────────────────────────────────────────────────
-- One row per campaign draft or live campaign, always scoped
-- to a single Clerk user via clerk_user_id.

create table if not exists public.campaigns (
  id                    uuid primary key default gen_random_uuid(),
  clerk_user_id         text not null,
  name                  text not null,
  business_name         text,
  industry              text,
  target_audience       text,
  geographic_market     text,
  offer                 text,
  goal                  text,
  channels              text[] not null default '{}',
  brand_voice           text,
  primary_cta           text,
  audience_pain_points  text,
  unique_selling_points text,
  status                text not null default 'draft'
                          check (status in ('draft', 'active', 'paused', 'completed')),
  asset_count           integer not null default 0,
  days_remaining        integer,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- ── Indexes ───────────────────────────────────────────────────
-- Fast lookup of all campaigns/profiles for a given user

create index if not exists campaigns_clerk_user_id_idx
  on public.campaigns (clerk_user_id);

create index if not exists business_profiles_clerk_user_id_idx
  on public.business_profiles (clerk_user_id);

-- ── updated_at trigger ───────────────────────────────────────
-- Automatically keep updated_at current on row changes

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger campaigns_updated_at
  before update on public.campaigns
  for each row execute procedure public.set_updated_at();

create or replace trigger business_profiles_updated_at
  before update on public.business_profiles
  for each row execute procedure public.set_updated_at();

-- ── Row Level Security ────────────────────────────────────────
-- NOTE: RLS is disabled here because we use the service role key
-- on the server (which bypasses RLS). If you later add a
-- browser client with the anon key, enable RLS and add policies.
--
-- To enable in the future:
--   alter table public.campaigns enable row level security;
--   create policy "Users see own campaigns"
--     on public.campaigns for all
--     using (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');
