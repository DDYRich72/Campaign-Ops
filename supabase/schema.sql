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

-- ── Social Media Integration ───────────────────────────────────
-- Tables for Buffer/social posting functionality

create table if not exists public.social_accounts (
  id                 uuid primary key default gen_random_uuid(),
  clerk_user_id      text not null,
  platform           text not null, -- 'twitter', 'linkedin', 'facebook', 'instagram', 'tiktok'
  account_name       text not null,
  account_handle     text,
  avatar_url         text,
  buffer_token       text not null, -- encrypted access token (Buffer API)
  buffer_account_id  text not null,
  is_active          boolean not null default true,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique(clerk_user_id, platform, account_handle)
);

create table if not exists public.posting_schedules (
  id                    uuid primary key default gen_random_uuid(),
  clerk_user_id         text not null,
  campaign_id           uuid references public.campaigns(id) on delete cascade,
  frequency             text not null default 'daily', -- 'immediate', 'daily', 'weekly', 'smart'
  posts_per_day         integer not null default 2,
  best_times            jsonb default '[]'::jsonb, -- array of {hour, minute, timezone}
  timezone              text not null default 'America/New_York',
  platforms_enabled     jsonb default '[]'::jsonb, -- array of social_account IDs
  is_active             boolean not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create table if not exists public.scheduled_posts (
  id                    uuid primary key default gen_random_uuid(),
  clerk_user_id         text not null,
  campaign_id           uuid references public.campaigns(id) on delete cascade,
  content_item_id       text, -- references day in full_content_json
  platform_account_id   uuid references public.social_accounts(id) on delete cascade,
  content_text          text not null,
  media_urls            jsonb default '[]'::jsonb,
  scheduled_at          timestamptz not null,
  posted_at             timestamptz,
  status                text not null default 'pending', -- 'pending', 'posted', 'failed', 'cancelled'
  buffer_post_id        text,
  error_message         text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Enable RLS (must be after all three tables are created)
alter table public.social_accounts enable row level security;
alter table public.posting_schedules enable row level security;
alter table public.scheduled_posts enable row level security;

-- RLS Policies
create policy "Users can only see their own social accounts"
  on public.social_accounts for all
  using (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

create policy "Users can only see their own posting schedules"
  on public.posting_schedules for all
  using (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

create policy "Users can only see their own scheduled posts"
  on public.scheduled_posts for all
  using (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Indexes for performance
create index if not exists social_accounts_clerk_user_id_idx 
  on public.social_accounts (clerk_user_id);
create index if not exists social_accounts_platform_idx 
  on public.social_accounts (platform);
create index if not exists posting_schedules_campaign_id_idx 
  on public.posting_schedules (campaign_id);
create index if not exists scheduled_posts_status_scheduled_at_idx 
  on public.scheduled_posts (status, scheduled_at);
create index if not exists scheduled_posts_clerk_user_id_idx 
  on public.scheduled_posts (clerk_user_id);

-- Triggers for updated_at
create or replace trigger social_accounts_updated_at
  before update on public.social_accounts
  for each row execute procedure public.set_updated_at();

create or replace trigger posting_schedules_updated_at
  before update on public.posting_schedules
  for each row execute procedure public.set_updated_at();

create or replace trigger scheduled_posts_updated_at
  before update on public.scheduled_posts
  for each row execute procedure public.set_updated_at();

-- ── Storage Bucket for Campaign Images ──────────────────────────────────────────
-- Create storage bucket for generated campaign images (run in Supabase Dashboard)
-- Note: Storage buckets must be created via Supabase Dashboard or API, not SQL
-- Bucket name: campaign-images
-- Public: true (for social media sharing)
-- File size limit: 10MB
-- Allowed MIME types: image/png, image/jpeg, image/webp
-- 
-- After creating bucket, set this policy:
-- CREATE POLICY "Public can view campaign images"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'campaign-images');
--
-- CREATE POLICY "Authenticated users can upload campaign images"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'campaign-images' AND auth.role() = 'authenticated');
