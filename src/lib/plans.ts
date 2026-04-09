// ── Plan definitions ──────────────────────────────────────────────────────────
// Edit limits here. Stripe price IDs are set via environment variables.

export type PlanKey = 'starter' | 'growth' | 'agency';

export interface PlanLimits {
  campaigns: number;          // max campaigns created
  strategyGenerations: number; // max times "Generate Campaign" can be run (across all campaigns)
  fullContentGenerations: number;
  funnelGenerations: number;
}

export interface Plan {
  key: PlanKey;
  label: string;
  price: string;           // display price
  priceMonthly: number;    // cents, for display
  description: string;
  limits: PlanLimits;
  features: string[];
  highlighted: boolean;    // shown as "most popular"
  stripePriceId: string;   // pulled from env
}

export const PLANS: Record<PlanKey, Plan> = {
  starter: {
    key: 'starter',
    label: 'Starter',
    price: '$29',
    priceMonthly: 2900,
    description: 'For small businesses getting started with AI-powered campaigns.',
    limits: {
      campaigns: 3,
      strategyGenerations: 5,
      fullContentGenerations: 3,
      funnelGenerations: 3,
    },
    features: [
      'Up to 3 campaigns',
      '5 strategy generations',
      '3 full content generations',
      '3 funnel asset generations',
      '30-day content calendar',
      'Export & copy tools',
      'Email support',
    ],
    highlighted: false,
    stripePriceId: process.env.STRIPE_PRICE_STARTER ?? '',
  },
  growth: {
    key: 'growth',
    label: 'Growth',
    price: '$79',
    priceMonthly: 7900,
    description: 'For growing businesses running multiple campaigns at once.',
    limits: {
      campaigns: 15,
      strategyGenerations: 30,
      fullContentGenerations: 15,
      funnelGenerations: 15,
    },
    features: [
      'Up to 15 campaigns',
      '30 strategy generations',
      '15 full content generations',
      '15 funnel asset generations',
      'Everything in Starter',
      'Industry presets & templates',
      'Priority support',
    ],
    highlighted: true,
    stripePriceId: process.env.STRIPE_PRICE_GROWTH ?? '',
  },
  agency: {
    key: 'agency',
    label: 'Agency',
    price: '$199',
    priceMonthly: 19900,
    description: 'For agencies and power users managing campaigns for multiple clients.',
    limits: {
      campaigns: 100,
      strategyGenerations: 200,
      fullContentGenerations: 100,
      funnelGenerations: 100,
    },
    features: [
      'Up to 100 campaigns',
      '200 strategy generations',
      '100 full content generations',
      '100 funnel asset generations',
      'Everything in Growth',
      'Multi-client workflows',
      'Dedicated support',
    ],
    highlighted: false,
    stripePriceId: process.env.STRIPE_PRICE_AGENCY ?? '',
  },
};

// Free tier — used when no active subscription exists
export const FREE_LIMITS: PlanLimits = {
  campaigns: 1,
  strategyGenerations: 2,
  fullContentGenerations: 1,
  funnelGenerations: 1,
};

export function getPlan(key: PlanKey | null | undefined): Plan | null {
  if (!key) return null;
  return PLANS[key] ?? null;
}

export function getLimits(key: PlanKey | null | undefined): PlanLimits {
  if (!key) return FREE_LIMITS;
  return PLANS[key]?.limits ?? FREE_LIMITS;
}

export const PLAN_ORDER: PlanKey[] = ['starter', 'growth', 'agency'];
