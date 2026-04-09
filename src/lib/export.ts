import type {
  CampaignStrategy,
  ContentPillar,
  OutlineItem,
  FullContentItem,
  LandingPageCopy,
  EmailItem,
} from '@/lib/supabase/types';

// ── Shared data shape passed into every export function ───────────────────────

export interface ExportableCampaign {
  name: string;
  business_name: string | null;
  industry: string | null;
  target_audience: string | null;
  geographic_market: string | null;
  offer: string | null;
  goal: string | null;
  primary_cta: string | null;
  brand_voice: string | null;
  channels: string[];
  created_at: string;
  strategy_json: CampaignStrategy | null;
  content_pillars_json: ContentPillar[] | null;
  campaign_outline_json: OutlineItem[] | null;
  full_content_json: FullContentItem[] | null;
  landing_page_json: LandingPageCopy | null;
  email_sequence_json: EmailItem[] | null;
}

// ── CSV helpers ───────────────────────────────────────────────────────────────

function csvCell(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return '';
  const str = String(val);
  // Wrap in quotes if the value contains a comma, double-quote, or newline
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function csvRow(cells: (string | number | null | undefined)[]): string {
  return cells.map(csvCell).join(',');
}

// ── CSV export ────────────────────────────────────────────────────────────────

export function generateCSV(campaign: ExportableCampaign): string {
  const hasFullContent =
    campaign.full_content_json && campaign.full_content_json.length > 0;

  if (hasFullContent) {
    const header = csvRow([
      'day',
      'platform',
      'content_type',
      'topic',
      'hook',
      'caption',
      'cta',
      'hashtags',
      'visual_prompt',
      'notes',
    ]);
    const rows = campaign.full_content_json!.map((item) =>
      csvRow([
        item.day,
        item.platform,
        item.content_type,
        item.topic,
        item.hook,
        item.caption,
        item.cta,
        item.hashtags.map((h) => `#${h}`).join(' '),
        item.visual_prompt,
        item.notes ?? '',
      ])
    );
    return [header, ...rows].join('\n');
  }

  // Outline-only fallback
  const header = csvRow(['day', 'platform', 'content_type', 'topic', 'hook', 'cta']);
  const rows = (campaign.campaign_outline_json ?? []).map((item) =>
    csvRow([
      item.day,
      item.platform,
      item.content_type,
      item.topic,
      item.hook,
      item.cta,
    ])
  );
  return [header, ...rows].join('\n');
}

// ── Markdown export ───────────────────────────────────────────────────────────

function mdSection(title: string): string {
  return `\n---\n\n## ${title}\n`;
}

export function generateMarkdown(campaign: ExportableCampaign): string {
  const lines: string[] = [];

  // ── Title
  lines.push(`# ${campaign.name}`);
  lines.push('');
  if (campaign.business_name) lines.push(`**Business:** ${campaign.business_name}  `);
  if (campaign.industry) lines.push(`**Industry:** ${campaign.industry}  `);
  lines.push(
    `**Created:** ${new Date(campaign.created_at).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })}`
  );

  // ── Campaign Summary
  lines.push(mdSection('Campaign Summary'));
  if (campaign.target_audience) lines.push(`**Target Audience:** ${campaign.target_audience}  `);
  if (campaign.geographic_market) lines.push(`**Geographic Market:** ${campaign.geographic_market}  `);
  if (campaign.offer) lines.push(`**Offer:** ${campaign.offer}  `);
  if (campaign.goal) lines.push(`**Goal:** ${campaign.goal}  `);
  if (campaign.primary_cta) lines.push(`**Primary CTA:** ${campaign.primary_cta}  `);
  if (campaign.brand_voice) lines.push(`**Brand Voice:** ${campaign.brand_voice}  `);
  if (campaign.channels?.length)
    lines.push(`**Channels:** ${campaign.channels.join(', ')}  `);

  // ── Strategy
  if (campaign.strategy_json) {
    const s = campaign.strategy_json;
    lines.push(mdSection('Campaign Strategy'));
    lines.push(`**Campaign Objective**  \n${s.campaign_objective}`);
    lines.push('');
    lines.push(`**Target Audience**  \n${s.target_audience_summary}`);
    lines.push('');
    lines.push(`**Offer Positioning**  \n${s.offer_positioning}`);
    lines.push('');
    lines.push(`**Messaging Angle**  \n${s.messaging_angle}`);
    lines.push('');
    lines.push(`**CTA Strategy**  \n${s.cta_strategy}`);
  }

  // ── Content Pillars
  if (campaign.content_pillars_json?.length) {
    lines.push(mdSection('Content Pillars'));
    campaign.content_pillars_json.forEach((pillar, i) => {
      lines.push(`### ${i + 1}. ${pillar.name}`);
      lines.push(pillar.description);
      lines.push('');
      lines.push(`*Purpose: ${pillar.purpose}*`);
      lines.push('');
    });
  }

  // ── 30-Day Outline
  if (campaign.campaign_outline_json?.length) {
    lines.push(mdSection('30-Day Campaign Outline'));
    lines.push('| Day | Platform | Type | Topic | Hook | CTA |');
    lines.push('|-----|----------|------|-------|------|-----|');
    campaign.campaign_outline_json.forEach((item) => {
      lines.push(
        `| ${item.day} | ${item.platform} | ${item.content_type} | ${item.topic} | ${item.hook} | ${item.cta} |`
      );
    });
  }

  // ── Full Content
  if (campaign.full_content_json?.length) {
    lines.push(mdSection('Full Campaign Content'));
    campaign.full_content_json.forEach((item) => {
      lines.push(
        `### Day ${item.day} — ${item.platform} · ${item.content_type}`
      );
      lines.push('');
      lines.push(`**Topic:** ${item.topic}  `);
      lines.push(`**Hook:** "${item.hook}"`);
      lines.push('');
      lines.push('**Caption:**');
      lines.push(item.caption);
      lines.push('');
      lines.push(`**CTA:** ${item.cta}  `);
      lines.push(
        `**Hashtags:** ${item.hashtags.map((h) => `#${h}`).join(' ')}  `
      );
      lines.push(`**Visual Prompt:** *${item.visual_prompt}*`);
      if (item.notes) {
        lines.push('');
        lines.push(`> **Note:** ${item.notes}`);
      }
      lines.push('');
    });
  }

  // ── Landing Page Copy
  if (campaign.landing_page_json) {
    const lp = campaign.landing_page_json;
    lines.push(mdSection('Landing Page Copy'));
    lines.push(`**Headline:** ${lp.headline}`);
    lines.push('');
    lines.push(`**Subheadline:** ${lp.subheadline}`);
    lines.push('');
    lines.push(`**Hero Supporting Text:** ${lp.hero_supporting_text}`);
    lines.push('');
    lines.push(`**Primary CTA:** ${lp.primary_cta}`);
    lines.push('');
    lines.push('**Benefit Bullets:**');
    lp.benefit_bullets.forEach((b) => lines.push(`- ${b}`));
    lines.push('');
    lines.push(`**Problem Section:**  \n${lp.problem_section}`);
    lines.push('');
    lines.push(`**Solution Section:**  \n${lp.solution_section}`);
    lines.push('');
    lines.push(`**Offer Section:**  \n${lp.offer_section}`);
    lines.push('');
    lines.push(`**Objection Handling:**  \n${lp.objection_handling}`);
    lines.push('');
    lines.push(`**Closing CTA:**  \n${lp.closing_cta}`);
  }

  // ── Email Sequence
  if (campaign.email_sequence_json?.length) {
    lines.push(mdSection('Email Sequence'));
    campaign.email_sequence_json.forEach((email) => {
      lines.push(`### Email ${email.sequence}`);
      lines.push(`**Subject:** ${email.subject}  `);
      lines.push(`**Preview:** ${email.preview_text}`);
      lines.push('');
      lines.push('**Body:**');
      lines.push(email.body);
      lines.push('');
      lines.push(`**CTA:** ${email.cta}`);
      lines.push('');
    });
  }

  return lines.join('\n');
}

// ── JSON export ───────────────────────────────────────────────────────────────

export function generateJSON(campaign: ExportableCampaign): string {
  return JSON.stringify(
    {
      name: campaign.name,
      business_name: campaign.business_name,
      industry: campaign.industry,
      target_audience: campaign.target_audience,
      geographic_market: campaign.geographic_market,
      offer: campaign.offer,
      goal: campaign.goal,
      primary_cta: campaign.primary_cta,
      brand_voice: campaign.brand_voice,
      channels: campaign.channels,
      strategy: campaign.strategy_json,
      content_pillars: campaign.content_pillars_json,
      campaign_outline: campaign.campaign_outline_json,
      full_content: campaign.full_content_json,
      landing_page: campaign.landing_page_json,
      email_sequence: campaign.email_sequence_json,
      exported_at: new Date().toISOString(),
    },
    null,
    2
  );
}

// ── Plain-text full campaign copy (for clipboard) ─────────────────────────────

export function generatePlainTextCopy(campaign: ExportableCampaign): string {
  // Reuse markdown — it's readable as plain text
  return generateMarkdown(campaign);
}

// ── Plain-text single day block ───────────────────────────────────────────────

export function formatDayBlock(item: FullContentItem): string {
  const lines: string[] = [
    `DAY ${item.day} — ${item.platform} | ${item.content_type}`,
    `Topic: ${item.topic}`,
    `Hook: "${item.hook}"`,
    '',
    'CAPTION:',
    item.caption,
    '',
    `CTA: ${item.cta}`,
    `Hashtags: ${item.hashtags.map((h) => `#${h}`).join(' ')}`,
    `Visual Prompt: ${item.visual_prompt}`,
  ];
  if (item.notes) {
    lines.push('');
    lines.push(`Note: ${item.notes}`);
  }
  return lines.join('\n');
}

// ── Filtered content CSV (used when filters are active in FullContentSection) ─

export function generateFilteredContentCSV(items: FullContentItem[]): string {
  const header = csvRow([
    'day',
    'platform',
    'content_type',
    'topic',
    'hook',
    'caption',
    'cta',
    'hashtags',
    'visual_prompt',
    'notes',
  ]);
  const rows = items.map((item) =>
    csvRow([
      item.day,
      item.platform,
      item.content_type,
      item.topic,
      item.hook,
      item.caption,
      item.cta,
      item.hashtags.map((h) => `#${h}`).join(' '),
      item.visual_prompt,
      item.notes ?? '',
    ])
  );
  return [header, ...rows].join('\n');
}

// ── Outline copy helpers ──────────────────────────────────────────────────────

export function formatOutlineRow(item: OutlineItem): string {
  return `Day ${item.day} | ${item.platform} | ${item.content_type} | ${item.topic} | ${item.hook} | ${item.cta}`;
}

// Tab-separated so it pastes into Excel/Sheets as proper columns
export function generateOutlineCopyText(outline: OutlineItem[]): string {
  const header = 'Day\tPlatform\tType\tTopic\tHook\tCTA';
  const rows = outline.map(
    (item) =>
      `${item.day}\t${item.platform}\t${item.content_type}\t${item.topic}\t${item.hook}\t${item.cta}`
  );
  return [header, ...rows].join('\n');
}

// ── Browser download trigger ──────────────────────────────────────────────────

export function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
