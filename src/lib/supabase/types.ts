// Database row types (snake_case matching Supabase column names)

// ── Billing ───────────────────────────────────────────────────────────────────

export interface SubscriptionRow {
  id: string;
  clerk_user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string | null;
  plan_key: string;
  status: string; // 'active' | 'canceled' | 'past_due' | 'trialing'
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface UsageCounterRow {
  id: string;
  clerk_user_id: string;
  campaigns_created: number;
  strategy_generations: number;
  full_content_generations: number;
  funnel_generations: number;
  created_at: string;
  updated_at: string;
}


export type CampaignStatusDB = 'draft' | 'ready' | 'active' | 'archived';

export type GenerationStatus = 'idle' | 'done' | 'error';

// ── AI generation output shapes ───────────────────────────────────────────────

export interface CampaignStrategy {
  campaign_objective: string;
  target_audience_summary: string;
  offer_positioning: string;
  messaging_angle: string;
  cta_strategy: string;
}

export interface ContentPillar {
  name: string;
  description: string;
  purpose: string;
}

export interface OutlineItem {
  day: number;
  platform: string;
  content_type: string;
  topic: string;
  hook: string;
  cta: string;
}

export interface FullContentItem {
  day: number;
  platform: string;
  content_type: string;
  topic: string;
  hook: string;
  caption: string;
  cta: string;
  hashtags: string[];
  visual_prompt: string;
  notes: string | null;
}

export interface LandingPageCopy {
  headline: string;
  subheadline: string;
  hero_supporting_text: string;
  primary_cta: string;
  benefit_bullets: string[];
  problem_section: string;
  solution_section: string;
  offer_section: string;
  objection_handling: string;
  closing_cta: string;
}

export interface EmailItem {
  sequence: number;
  subject: string;
  preview_text: string;
  body: string;
  cta: string;
}

// ── Content publish tracking ──────────────────────────────────────────────────

export type ContentItemStatus = 'draft' | 'ready' | 'scheduled' | 'published';

export interface ContentPublishState {
  status: ContentItemStatus;
  scheduled_for: string | null;
  published_at: string | null;
  notes: string | null;
}

// Keyed by day number as string (JSON keys must be strings)
export type ContentPublishStateMap = Record<string, ContentPublishState>;

// ── Supabase row types ────────────────────────────────────────────────────────

export interface CampaignRow {
  id: string;
  clerk_user_id: string;
  name: string;
  business_name: string | null;
  industry: string | null;
  target_audience: string | null;
  geographic_market: string | null;
  offer: string | null;
  goal: string | null;
  channels: string[];
  brand_voice: string | null;
  primary_cta: string | null;
  audience_pain_points: string | null;
  unique_selling_points: string | null;
  status: CampaignStatusDB;
  asset_count: number;
  days_remaining: number | null;
  // Phase 4: campaign strategy + outline
  strategy_json: CampaignStrategy | null;
  content_pillars_json: ContentPillar[] | null;
  campaign_outline_json: OutlineItem[] | null;
  generation_status: GenerationStatus;
  generated_at: string | null;
  // Phase 5: full daily content
  full_content_json: FullContentItem[] | null;
  content_generation_status: GenerationStatus;
  content_generated_at: string | null;
  // Phase 8: funnel assets
  landing_page_json: LandingPageCopy | null;
  email_sequence_json: EmailItem[] | null;
  funnel_generation_status: GenerationStatus;
  funnel_generated_at: string | null;
  // Phase 10: content publish tracking
  content_publish_state_json: ContentPublishStateMap | null;
  created_at: string;
  updated_at: string;
}

export interface BusinessProfileRow {
  id: string;
  clerk_user_id: string;
  business_name: string | null;
  industry: string | null;
  default_brand_voice: string | null;
  website: string | null;
  // Added in phase 3 migration
  target_audience: string | null;
  geographic_market: string | null;
  primary_cta: string | null;
  audience_pain_points: string | null;
  unique_selling_points: string | null;
  created_at: string;
  updated_at: string;
}
