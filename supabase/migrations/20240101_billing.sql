-- Phase 13: Stripe billing tables

-- Subscriptions: one row per user, upserted on Stripe webhook events
create table if not exists public.subscriptions (
  id                    uuid primary key default gen_random_uuid(),
  clerk_user_id         text not null unique,
  stripe_customer_id    text not null,
  stripe_subscription_id text not null unique,
  plan_key              text not null,          -- 'starter' | 'growth' | 'agency'
  status                text not null,          -- 'active' | 'canceled' | 'past_due' etc.
  current_period_end    timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Usage counters: one row per user, incremented on each successful generation
create table if not exists public.usage_counters (
  id                          uuid primary key default gen_random_uuid(),
  clerk_user_id               text not null unique,
  campaigns_created           integer not null default 0,
  strategy_generations        integer not null default 0,
  full_content_generations    integer not null default 0,
  funnel_generations          integer not null default 0,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

-- RLS: service role key bypasses RLS so no policies are needed for server-side access.
-- Enable RLS to prevent direct client-side reads (all access is via service role).
alter table public.subscriptions enable row level security;
alter table public.usage_counters enable row level security;
