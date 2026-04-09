'use server';

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { checkLimit, incrementUsage } from '@/lib/subscription';
import { openai, GENERATION_MODEL } from '@/lib/openai';
import type {
  CampaignRow,
  CampaignStrategy,
  ContentPillar,
  OutlineItem,
  FullContentItem,
  LandingPageCopy,
  EmailItem,
} from '@/lib/supabase/types';

export type GenerateResult =
  | { success: true }
  | { success: false; error: string };

// ── Phase 4: strategy + pillars + outline ─────────────────────────────────────

function buildStrategyPrompt(c: CampaignRow): string {
  const channels = c.channels?.length ? c.channels.join(', ') : 'email, social';

  return `You are a senior marketing strategist. Generate a complete campaign strategy based on the details below.

Campaign Details:
- Name: ${c.name}
- Business: ${c.business_name ?? 'Not specified'}
- Industry: ${c.industry ?? 'Not specified'}
- Target Audience: ${c.target_audience ?? 'Not specified'}
- Geographic Market: ${c.geographic_market ?? 'Not specified'}
- Offer: ${c.offer ?? 'Not specified'}
- Goal: ${c.goal ?? 'Not specified'}
- Primary CTA: ${c.primary_cta ?? 'Not specified'}
- Brand Voice: ${c.brand_voice ?? 'Not specified'}
- Audience Pain Points: ${c.audience_pain_points ?? 'Not specified'}
- Unique Selling Points: ${c.unique_selling_points ?? 'Not specified'}
- Channels: ${channels}

Return ONLY valid JSON — no markdown, no code fences, just raw JSON — using this exact structure:

{
  "strategy": {
    "campaign_objective": "2-3 sentences describing what this campaign aims to achieve and why.",
    "target_audience_summary": "2-3 sentences on who we are targeting and what motivates them.",
    "offer_positioning": "2-3 sentences on how the offer directly solves the audience's core pain.",
    "messaging_angle": "2-3 sentences on the central message and the emotional angle to lead with.",
    "cta_strategy": "2-3 sentences on how CTAs should be used and what action to drive throughout."
  },
  "content_pillars": [
    {
      "name": "Pillar name (2-4 words)",
      "description": "1-2 sentences explaining this content theme.",
      "purpose": "1 sentence on why this pillar serves the campaign."
    }
  ],
  "campaign_outline": [
    {
      "day": 1,
      "platform": "Platform name from channels",
      "content_type": "e.g. Post, Story, Email, Reel, Ad",
      "topic": "Specific topic for this piece of content",
      "hook": "Opening line or hook to grab attention",
      "cta": "Specific CTA for this piece"
    }
  ]
}

Rules:
- content_pillars: generate exactly 5 pillars relevant to the campaign
- campaign_outline: generate exactly 30 items, one for each day 1 through 30
- distribute the 30 days across the available channels: ${channels}
- hooks must be specific and relevant to the topic — not generic
- CTAs should reflect the campaign's primary CTA where applicable
- keep all text tight and actionable`;
}

// ── Phase 5: full daily content ───────────────────────────────────────────────

function buildFullContentPrompt(c: CampaignRow): string {
  const outline = c.campaign_outline_json ?? [];
  const outlineLines = outline
    .map(
      (item) =>
        `Day ${item.day} | ${item.platform} | ${item.content_type} | Topic: "${item.topic}" | Hook: "${item.hook}" | CTA: "${item.cta}"`
    )
    .join('\n');

  const channels = c.channels?.length ? c.channels.join(', ') : 'social';

  return `You are a professional content creator and copywriter for small businesses.

Write complete, ready-to-use content for every day of the 30-day campaign below.

Campaign Context:
- Business: ${c.business_name ?? 'Not specified'}
- Industry: ${c.industry ?? 'Not specified'}
- Offer: ${c.offer ?? 'Not specified'}
- Target Audience: ${c.target_audience ?? 'Not specified'}
- Location / Market: ${c.geographic_market ?? 'Not specified'}
- Brand Voice: ${c.brand_voice ?? 'Not specified'}
- Primary CTA: ${c.primary_cta ?? 'Not specified'}
- Audience Pain Points: ${c.audience_pain_points ?? 'Not specified'}
- Unique Selling Points: ${c.unique_selling_points ?? 'Not specified'}
- Channels: ${channels}

30-Day Outline (follow this exactly — one item per day):
${outlineLines}

Return ONLY valid JSON with this exact structure — no markdown, no code fences:

{
  "full_content": [
    {
      "day": 1,
      "platform": "exact platform from outline",
      "content_type": "exact type from outline",
      "topic": "exact topic from outline",
      "hook": "a specific, attention-grabbing opening line for this post",
      "caption": "the complete, ready-to-publish caption for this day",
      "cta": "a clear, specific CTA tied to this day's content",
      "hashtags": ["relevant", "hashtag", "list"],
      "visual_prompt": "a specific description of the ideal image or graphic for this post",
      "notes": "optional production tip, or null"
    }
  ]
}

Caption writing rules — apply these per platform:
- Instagram: 150–300 words. Personal, warm tone. Use line breaks between short paragraphs. Emojis used purposefully (not excessively). Hashtags go at the end after a line break.
- Facebook: 80–150 words. Conversational, question-driven. Encourage comments. Keep hashtags minimal (2-3).
- LinkedIn: 100–200 words. Professional but human. Start with a bold insight or observation. No more than 3 hashtags.
- Email: Write the caption field as "Subject: [subject line] | Preview: [preview text]" — not a full email body.
- SMS: Under 160 characters total. Direct. Include a link placeholder like [LINK].
- TikTok: 50–100 words. Hook-first. Describe the video concept briefly, then give the on-screen text and caption.
- Twitter/X: Under 280 characters including a link placeholder [LINK].
- Default: 100–200 words, engaging and direct.

Content quality rules:
- Every caption must reference the actual offer, business, or audience pain point — no generic filler
- Hooks must be varied — do not start multiple captions with the same phrase or pattern
- Captions must sound like a real person wrote them, not a template
- The brand voice is "${c.brand_voice ?? 'professional and approachable'}" — maintain this throughout
- If a geographic market is specified (${c.geographic_market ?? 'none'}), reference it in relevant captions
- CTAs must be specific and match the campaign's primary CTA where appropriate
- Visual prompts must be concrete and specific — not "a smiling person" but a detailed scene description
- Hashtags: 5–8 per post, mix of niche-specific and broad reach. Do NOT include the # symbol — just the word.
- Generate exactly 30 items for days 1 through 30 in order`;
}

// ── Validators ────────────────────────────────────────────────────────────────

interface RawStrategyResponse {
  strategy?: unknown;
  content_pillars?: unknown;
  campaign_outline?: unknown;
}

function isValidStrategy(s: unknown): s is CampaignStrategy {
  if (!s || typeof s !== 'object') return false;
  const obj = s as Record<string, unknown>;
  return (
    typeof obj.campaign_objective === 'string' &&
    typeof obj.target_audience_summary === 'string' &&
    typeof obj.offer_positioning === 'string' &&
    typeof obj.messaging_angle === 'string' &&
    typeof obj.cta_strategy === 'string'
  );
}

function isValidPillars(p: unknown): p is ContentPillar[] {
  if (!Array.isArray(p) || p.length === 0) return false;
  return p.every(
    (item) =>
      item &&
      typeof item === 'object' &&
      typeof (item as Record<string, unknown>).name === 'string' &&
      typeof (item as Record<string, unknown>).description === 'string' &&
      typeof (item as Record<string, unknown>).purpose === 'string'
  );
}

function isValidOutline(o: unknown): o is OutlineItem[] {
  if (!Array.isArray(o) || o.length === 0) return false;
  return o.every((item) => {
    if (!item || typeof item !== 'object') return false;
    const i = item as Record<string, unknown>;
    return (
      typeof i.day === 'number' &&
      typeof i.platform === 'string' &&
      typeof i.content_type === 'string' &&
      typeof i.topic === 'string' &&
      typeof i.hook === 'string' &&
      typeof i.cta === 'string'
    );
  });
}

function isValidFullContent(items: unknown): items is FullContentItem[] {
  if (!Array.isArray(items) || items.length < 28) return false; // allow up to 2 missing days
  return items.every((item) => {
    if (!item || typeof item !== 'object') return false;
    const i = item as Record<string, unknown>;
    return (
      typeof i.day === 'number' &&
      typeof i.platform === 'string' &&
      typeof i.content_type === 'string' &&
      typeof i.topic === 'string' &&
      typeof i.hook === 'string' &&
      typeof i.caption === 'string' &&
      typeof i.cta === 'string' &&
      Array.isArray(i.hashtags) &&
      typeof i.visual_prompt === 'string'
    );
  });
}

// ── Shared helper: call OpenAI and parse JSON ─────────────────────────────────

async function callOpenAI(prompt: string): Promise<{ text: string } | { error: string }> {
  try {
    const completion = await openai.chat.completions.create({
      model: GENERATION_MODEL,
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 14000,
      messages: [
        {
          role: 'system',
          content: 'You are an expert marketing professional. Always respond with valid JSON only.',
        },
        { role: 'user', content: prompt },
      ],
    });
    return { text: completion.choices[0]?.message?.content ?? '' };
  } catch (err) {
    console.error('OpenAI call failed:', err);
    return { error: 'AI generation failed. Please try again.' };
  }
}

// ── Action: generate strategy + pillars + outline ─────────────────────────────

export async function generateCampaignAction(
  campaignId: string
): Promise<GenerateResult> {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const limitCheck = await checkLimit(userId, 'strategyGenerations');
  if (!limitCheck.allowed) {
    return {
      success: false,
      error: `Strategy generation limit reached (${limitCheck.used}/${limitCheck.limit}). Upgrade your plan to generate more.`,
    };
  }

  const supabase = createServerClient();

  const { data: campaignData } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', campaignId)
    .eq('clerk_user_id', userId)
    .single();

  if (!campaignData) return { success: false, error: 'Campaign not found.' };

  const campaign = campaignData as CampaignRow;

  const aiResult = await callOpenAI(buildStrategyPrompt(campaign));
  if ('error' in aiResult) {
    await supabase
      .from('campaigns')
      .update({ generation_status: 'error' })
      .eq('id', campaignId)
      .eq('clerk_user_id', userId);
    return { success: false, error: aiResult.error };
  }

  let parsed: RawStrategyResponse;
  try {
    parsed = JSON.parse(aiResult.text) as RawStrategyResponse;
  } catch {
    console.error('Failed to parse strategy JSON:', aiResult.text);
    await supabase
      .from('campaigns')
      .update({ generation_status: 'error' })
      .eq('id', campaignId)
      .eq('clerk_user_id', userId);
    return { success: false, error: 'AI returned an unexpected response. Please try again.' };
  }

  if (!isValidStrategy(parsed.strategy) || !isValidPillars(parsed.content_pillars) || !isValidOutline(parsed.campaign_outline)) {
    console.error('Invalid strategy response shape:', parsed);
    await supabase
      .from('campaigns')
      .update({ generation_status: 'error' })
      .eq('id', campaignId)
      .eq('clerk_user_id', userId);
    return { success: false, error: 'AI response was incomplete. Please try again.' };
  }

  const { error: saveError } = await supabase
    .from('campaigns')
    .update({
      strategy_json: parsed.strategy,
      content_pillars_json: parsed.content_pillars,
      campaign_outline_json: parsed.campaign_outline,
      generation_status: 'done',
      generated_at: new Date().toISOString(),
    })
    .eq('id', campaignId)
    .eq('clerk_user_id', userId);

  if (saveError) {
    console.error('Failed to save strategy:', saveError);
    return { success: false, error: 'Failed to save generated content.' };
  }

  await incrementUsage(userId, 'strategy_generations');

  return { success: true };
}

// ── Action: generate full daily content ───────────────────────────────────────

export async function generateFullContentAction(
  campaignId: string
): Promise<GenerateResult> {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const limitCheck = await checkLimit(userId, 'fullContentGenerations');
  if (!limitCheck.allowed) {
    return {
      success: false,
      error: `Full content generation limit reached (${limitCheck.used}/${limitCheck.limit}). Upgrade your plan to generate more.`,
    };
  }

  const supabase = createServerClient();

  const { data: campaignData } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', campaignId)
    .eq('clerk_user_id', userId)
    .single();

  if (!campaignData) return { success: false, error: 'Campaign not found.' };

  const campaign = campaignData as CampaignRow;

  if (!campaign.campaign_outline_json || campaign.campaign_outline_json.length === 0) {
    return {
      success: false,
      error: 'Generate the campaign strategy and outline first.',
    };
  }

  const aiResult = await callOpenAI(buildFullContentPrompt(campaign));
  if ('error' in aiResult) {
    await supabase
      .from('campaigns')
      .update({ content_generation_status: 'error' })
      .eq('id', campaignId)
      .eq('clerk_user_id', userId);
    return { success: false, error: aiResult.error };
  }

  let parsed: { full_content?: unknown };
  try {
    parsed = JSON.parse(aiResult.text) as { full_content?: unknown };
  } catch {
    console.error('Failed to parse full content JSON:', aiResult.text);
    await supabase
      .from('campaigns')
      .update({ content_generation_status: 'error' })
      .eq('id', campaignId)
      .eq('clerk_user_id', userId);
    return { success: false, error: 'AI returned an unexpected response. Please try again.' };
  }

  if (!isValidFullContent(parsed.full_content)) {
    console.error('Invalid full content shape — items:', Array.isArray(parsed.full_content) ? parsed.full_content.length : 'not array');
    await supabase
      .from('campaigns')
      .update({ content_generation_status: 'error' })
      .eq('id', campaignId)
      .eq('clerk_user_id', userId);
    return { success: false, error: 'AI response was incomplete. Please try again.' };
  }

  const { error: saveError } = await supabase
    .from('campaigns')
    .update({
      full_content_json: parsed.full_content,
      content_generation_status: 'done',
      content_generated_at: new Date().toISOString(),
    })
    .eq('id', campaignId)
    .eq('clerk_user_id', userId);

  if (saveError) {
    console.error('Failed to save full content:', saveError);
    return { success: false, error: 'Failed to save generated content.' };
  }

  await incrementUsage(userId, 'full_content_generations');

  return { success: true };
}

// ── Phase 8: funnel assets (landing page + email sequence) ────────────────────

function buildFunnelPrompt(c: CampaignRow): string {
  return `You are an expert direct-response copywriter and email marketer for small businesses.

Generate two assets for this campaign: a landing page copy structure and a 5-email follow-up sequence.

Campaign Context:
- Business: ${c.business_name ?? 'Not specified'}
- Industry: ${c.industry ?? 'Not specified'}
- Offer: ${c.offer ?? 'Not specified'}
- Target Audience: ${c.target_audience ?? 'Not specified'}
- Geographic Market: ${c.geographic_market ?? 'Not specified'}
- Campaign Goal: ${c.goal ?? 'Not specified'}
- Primary CTA: ${c.primary_cta ?? 'Not specified'}
- Brand Voice: ${c.brand_voice ?? 'Not specified'}
- Audience Pain Points: ${c.audience_pain_points ?? 'Not specified'}
- Unique Selling Points: ${c.unique_selling_points ?? 'Not specified'}

Return ONLY valid JSON with this exact structure — no markdown, no code fences:

{
  "landing_page": {
    "headline": "Bold, specific headline addressing the audience primary pain or desire. Not generic.",
    "subheadline": "1-2 sentences expanding the headline promise. Clarifies who this is for.",
    "hero_supporting_text": "2-3 sentences of supporting copy under the hero. Builds credibility or urgency.",
    "primary_cta": "The main CTA button text — action-oriented, specific.",
    "benefit_bullets": [
      "Specific outcome-focused benefit 1",
      "Specific outcome-focused benefit 2",
      "Specific outcome-focused benefit 3",
      "Specific outcome-focused benefit 4",
      "Specific outcome-focused benefit 5"
    ],
    "problem_section": "2-4 sentences describing the specific problem the audience faces. Be empathetic. Make them feel understood.",
    "solution_section": "2-4 sentences presenting this offer as the clear solution. Connect directly to the problem.",
    "offer_section": "2-4 sentences detailing exactly what they get. Be concrete. Mention what makes this different.",
    "objection_handling": "2-4 sentences addressing the most common hesitation. Overcome it honestly.",
    "closing_cta": "2-3 sentences of urgency and closing copy, followed by the CTA action."
  },
  "email_sequence": [
    {
      "sequence": 1,
      "subject": "Email 1 subject line",
      "preview_text": "Preview text under 90 characters",
      "body": "Full email body 150-250 words",
      "cta": "CTA text for this email"
    }
  ]
}

Landing page rules:
- Every section must reference the specific offer, audience, or market — no filler
- Headline must create desire or name a real problem directly
- Benefit bullets are outcomes, not features
- Problem section is empathetic, not salesy
- Brand voice throughout: "${c.brand_voice ?? 'professional and approachable'}"

Email sequence rules:
- Generate exactly 5 emails, sequence 1 through 5
- Email 1: Welcome — deliver the promise, set expectations for what is coming
- Email 2: Problem agitation — deepen the pain, make them want the solution more
- Email 3: Solution reveal — present the offer clearly, focus on outcomes
- Email 4: Social proof or objection handling — address hesitation with empathy or evidence
- Email 5: Urgency close — create momentum, drive the primary CTA hard
- Each body is 150-250 words
- Emails must sound like a real human wrote them — vary tone slightly between emails
- Reference the specific offer, audience, and market where natural
- End every email with a single clear CTA`;
}

function isValidLandingPage(lp: unknown): lp is LandingPageCopy {
  if (!lp || typeof lp !== 'object') return false;
  const p = lp as Record<string, unknown>;
  return (
    typeof p.headline === 'string' &&
    typeof p.subheadline === 'string' &&
    typeof p.hero_supporting_text === 'string' &&
    typeof p.primary_cta === 'string' &&
    Array.isArray(p.benefit_bullets) &&
    (p.benefit_bullets as unknown[]).length >= 3 &&
    typeof p.problem_section === 'string' &&
    typeof p.solution_section === 'string' &&
    typeof p.offer_section === 'string' &&
    typeof p.objection_handling === 'string' &&
    typeof p.closing_cta === 'string'
  );
}

function isValidEmailSequence(seq: unknown): seq is EmailItem[] {
  if (!Array.isArray(seq) || seq.length < 4) return false;
  return seq.every((item) => {
    if (!item || typeof item !== 'object') return false;
    const e = item as Record<string, unknown>;
    return (
      typeof e.sequence === 'number' &&
      typeof e.subject === 'string' &&
      typeof e.preview_text === 'string' &&
      typeof e.body === 'string' &&
      typeof e.cta === 'string'
    );
  });
}

export async function generateFunnelAssetsAction(
  campaignId: string
): Promise<GenerateResult> {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const limitCheck = await checkLimit(userId, 'funnelGenerations');
  if (!limitCheck.allowed) {
    return {
      success: false,
      error: `Funnel asset generation limit reached (${limitCheck.used}/${limitCheck.limit}). Upgrade your plan to generate more.`,
    };
  }

  const supabase = createServerClient();

  const { data: campaignData } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', campaignId)
    .eq('clerk_user_id', userId)
    .single();

  if (!campaignData) return { success: false, error: 'Campaign not found.' };

  const campaign = campaignData as CampaignRow;

  const aiResult = await callOpenAI(buildFunnelPrompt(campaign));
  if ('error' in aiResult) {
    await supabase
      .from('campaigns')
      .update({ funnel_generation_status: 'error' })
      .eq('id', campaignId)
      .eq('clerk_user_id', userId);
    return { success: false, error: aiResult.error };
  }

  let parsed: { landing_page?: unknown; email_sequence?: unknown };
  try {
    parsed = JSON.parse(aiResult.text) as {
      landing_page?: unknown;
      email_sequence?: unknown;
    };
  } catch {
    console.error('Failed to parse funnel JSON:', aiResult.text);
    await supabase
      .from('campaigns')
      .update({ funnel_generation_status: 'error' })
      .eq('id', campaignId)
      .eq('clerk_user_id', userId);
    return { success: false, error: 'AI returned an unexpected response. Please try again.' };
  }

  if (!isValidLandingPage(parsed.landing_page)) {
    console.error('Invalid landing page shape:', parsed.landing_page);
    await supabase
      .from('campaigns')
      .update({ funnel_generation_status: 'error' })
      .eq('id', campaignId)
      .eq('clerk_user_id', userId);
    return { success: false, error: 'Landing page output was incomplete. Please try again.' };
  }

  if (!isValidEmailSequence(parsed.email_sequence)) {
    console.error('Invalid email sequence — count:', Array.isArray(parsed.email_sequence) ? parsed.email_sequence.length : 'not array');
    await supabase
      .from('campaigns')
      .update({ funnel_generation_status: 'error' })
      .eq('id', campaignId)
      .eq('clerk_user_id', userId);
    return { success: false, error: 'Email sequence output was incomplete. Please try again.' };
  }

  const { error: saveError } = await supabase
    .from('campaigns')
    .update({
      landing_page_json: parsed.landing_page,
      email_sequence_json: parsed.email_sequence,
      funnel_generation_status: 'done',
      funnel_generated_at: new Date().toISOString(),
    })
    .eq('id', campaignId)
    .eq('clerk_user_id', userId);

  if (saveError) {
    console.error('Failed to save funnel assets:', saveError);
    return { success: false, error: 'Failed to save generated content.' };
  }

  await incrementUsage(userId, 'funnel_generations');

  return { success: true };
}
