import { createServerClient } from '@/lib/supabase/server';
import { getLimits } from '@/lib/plans';
import type { PlanKey, PlanLimits } from '@/lib/plans';
import type { SubscriptionRow, UsageCounterRow } from '@/lib/supabase/types';

// ── Bypass / test accounts ────────────────────────────────────────────────────
// Set BYPASS_USER_IDS in .env.local as a comma-separated list of Clerk user IDs.
// These users get unlimited access and are never charged or tracked.

function isBypassUser(userId: string): boolean {
  const ids = (process.env.BYPASS_USER_IDS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return ids.includes(userId);
}

// ── Fetch subscription row ────────────────────────────────────────────────────

export async function getSubscription(userId: string): Promise<SubscriptionRow | null> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('clerk_user_id', userId)
    .eq('status', 'active')
    .maybeSingle();
  return (data as SubscriptionRow) ?? null;
}

// ── Get active plan key (null = free tier) ────────────────────────────────────

export async function getPlanKey(userId: string): Promise<PlanKey | null> {
  const sub = await getSubscription(userId);
  if (!sub) return null;
  // Check subscription hasn't expired
  if (sub.current_period_end) {
    const expiry = new Date(sub.current_period_end);
    if (expiry < new Date()) return null;
  }
  return (sub.plan_key as PlanKey) ?? null;
}

// ── Usage counters ────────────────────────────────────────────────────────────

export async function getUsageCounters(userId: string): Promise<UsageCounterRow | null> {
  const supabase = createServerClient();
  const { data } = await supabase
    .from('usage_counters')
    .select('*')
    .eq('clerk_user_id', userId)
    .maybeSingle();
  return (data as UsageCounterRow) ?? null;
}

export async function incrementUsage(
  userId: string,
  field: keyof Pick<UsageCounterRow, 'campaigns_created' | 'strategy_generations' | 'full_content_generations' | 'funnel_generations'>
): Promise<void> {
  if (isBypassUser(userId)) return;

  const supabase = createServerClient();

  // Upsert row — if it doesn't exist yet, create it with this field = 1
  const { data: existing } = await supabase
    .from('usage_counters')
    .select('*')
    .eq('clerk_user_id', userId)
    .maybeSingle();

  if (existing) {
    const current = (existing as UsageCounterRow)[field] ?? 0;
    await supabase
      .from('usage_counters')
      .update({ [field]: current + 1, updated_at: new Date().toISOString() })
      .eq('clerk_user_id', userId);
  } else {
    await supabase
      .from('usage_counters')
      .insert({ clerk_user_id: userId, [field]: 1 });
  }
}

// ── Check if user is within limit ─────────────────────────────────────────────

export type LimitField = 'campaigns' | 'strategyGenerations' | 'fullContentGenerations' | 'funnelGenerations';

const USAGE_FIELD_MAP: Record<LimitField, keyof UsageCounterRow> = {
  campaigns: 'campaigns_created',
  strategyGenerations: 'strategy_generations',
  fullContentGenerations: 'full_content_generations',
  funnelGenerations: 'funnel_generations',
};

export interface LimitCheck {
  allowed: boolean;
  used: number;
  limit: number;
  planKey: PlanKey | null;
}

export async function checkLimit(userId: string, field: LimitField): Promise<LimitCheck> {
  if (isBypassUser(userId)) {
    return { allowed: true, used: 0, limit: 999, planKey: 'agency' };
  }

  const [planKey, usage] = await Promise.all([
    getPlanKey(userId),
    getUsageCounters(userId),
  ]);

  const limits: PlanLimits = getLimits(planKey);
  const limit = limits[field];
  const usageField = USAGE_FIELD_MAP[field];
  const used = (usage?.[usageField] as number) ?? 0;

  return {
    allowed: used < limit,
    used,
    limit,
    planKey,
  };
}
