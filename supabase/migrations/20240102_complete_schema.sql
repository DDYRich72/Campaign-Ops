-- ============================================================
-- Complete schema migration — run this in Supabase SQL Editor
-- Safe to re-run: uses IF NOT EXISTS and ADD COLUMN IF NOT EXISTS
-- ============================================================

-- ── 1. business_profiles ─────────────────────────────────────

create table if not exists public.business_profiles (
  id                   uuid primary key default gen_random_uuid(),
  clerk_user_id        text not null unique,
  business_name        text,
  industry             text,
  default_brand_voice  text,
  website              text,
  target_audience      text,
  geographic_market    text,
  primary_cta          text,
  audience_pain_points text,
  unique_selling_points text,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- Add missing columns if table already exists
alter table public.business_profiles add column if not exists target_audience      text;
alter table public.business_profiles add column if not exists geographic_market   text;
alter table public.business_profiles add column if not exists primary_cta         text;
alter table public.business_profiles add column if not exists audience_pain_points text;
alter table public.business_profiles add column if not exists unique_selling_points text;

-- ── 2. campaigns ─────────────────────────────────────────────

create table if not exists public.campaigns (
  id                         uuid primary key default gen_random_uuid(),
  clerk_user_id              text not null,
  name                       text not null,
  business_name              text,
  industry                   text,
  target_audience            text,
  geographic_market          text,
  offer                      text,
  goal                       text,
  channels                   text[] not null default '{}',
  brand_voice                text,
  primary_cta                text,
  audience_pain_points       text,
  unique_selling_points      text,
  status                     text not null default 'draft'
                               check (status in ('draft', 'ready', 'active', 'archived')),
  asset_count                integer not null default 0,
  days_remaining             integer,
  -- AI generation: strategy + outline
  strategy_json              jsonb,
  content_pillars_json       jsonb,
  campaign_outline_json      jsonb,
  generation_status          text not null default 'idle'
                               check (generation_status in ('idle', 'done', 'error')),
  generated_at               timestamptz,
  -- AI generation: full daily content
  full_content_json          jsonb,
  content_generation_status  text not null default 'idle'
                               check (content_generation_status in ('idle', 'done', 'error')),
  content_generated_at       timestamptz,
  -- AI generation: funnel assets
  landing_page_json          jsonb,
  email_sequence_json        jsonb,
  funnel_generation_status   text not null default 'idle'
                               check (funnel_generation_status in ('idle', 'done', 'error')),
  funnel_generated_at        timestamptz,
  -- Content publish tracking
  content_publish_state_json jsonb,
  created_at                 timestamptz not null default now(),
  updated_at                 timestamptz not null default now()
);

-- Add missing columns if table already exists (from old schema)
alter table public.campaigns add column if not exists target_audience            text;
alter table public.campaigns add column if not exists geographic_market          text;
alter table public.campaigns add column if not exists offer                      text;
alter table public.campaigns add column if not exists goal                       text;
alter table public.campaigns add column if not exists brand_voice                text;
alter table public.campaigns add column if not exists primary_cta                text;
alter table public.campaigns add column if not exists audience_pain_points       text;
alter table public.campaigns add column if not exists unique_selling_points      text;
alter table public.campaigns add column if not exists days_remaining             integer;
alter table public.campaigns add column if not exists strategy_json              jsonb;
alter table public.campaigns add column if not exists content_pillars_json       jsonb;
alter table public.campaigns add column if not exists campaign_outline_json      jsonb;
alter table public.campaigns add column if not exists generation_status          text not null default 'idle';
alter table public.campaigns add column if not exists generated_at               timestamptz;
alter table public.campaigns add column if not exists full_content_json          jsonb;
alter table public.campaigns add column if not exists content_generation_status  text not null default 'idle';
alter table public.campaigns add column if not exists content_generated_at       timestamptz;
alter table public.campaigns add column if not exists landing_page_json          jsonb;
alter table public.campaigns add column if not exists email_sequence_json        jsonb;
alter table public.campaigns add column if not exists funnel_generation_status   text not null default 'idle';
alter table public.campaigns add column if not exists funnel_generated_at        timestamptz;
alter table public.campaigns add column if not exists content_publish_state_json jsonb;

-- Fix status constraint to match app values (drop old, add new)
alter table public.campaigns drop constraint if exists campaigns_status_check;
alter table public.campaigns add constraint campaigns_status_check
  check (status in ('draft', 'ready', 'active', 'archived'));

-- ── 3. subscriptions ─────────────────────────────────────────

create table if not exists public.subscriptions (
  id                     uuid primary key default gen_random_uuid(),
  clerk_user_id          text not null unique,
  stripe_customer_id     text not null,
  stripe_subscription_id text unique,
  plan_key               text not null,
  status                 text not null,
  current_period_end     timestamptz,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- ── 4. usage_counters ────────────────────────────────────────

create table if not exists public.usage_counters (
  id                       uuid primary key default gen_random_uuid(),
  clerk_user_id            text not null unique,
  campaigns_created        integer not null default 0,
  strategy_generations     integer not null default 0,
  full_content_generations integer not null default 0,
  funnel_generations       integer not null default 0,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

-- ── 5. Indexes ───────────────────────────────────────────────

create index if not exists campaigns_clerk_user_id_idx
  on public.campaigns (clerk_user_id);

create index if not exists business_profiles_clerk_user_id_idx
  on public.business_profiles (clerk_user_id);

-- ── 6. updated_at trigger ────────────────────────────────────

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

create or replace trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute procedure public.set_updated_at();

create or replace trigger usage_counters_updated_at
  before update on public.usage_counters
  for each row execute procedure public.set_updated_at();

-- ── 7. RLS (service role bypasses — safe for server-side use) ─

alter table public.business_profiles enable row level security;
alter table public.campaigns         enable row level security;
alter table public.subscriptions     enable row level security;
alter table public.usage_counters    enable row level security;
