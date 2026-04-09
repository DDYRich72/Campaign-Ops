// ─── Types ───────────────────────────────────────────────────────────────────

export type CampaignStatus = 'draft' | 'ready' | 'active' | 'archived';

export type Channel = 'email' | 'social' | 'paid_ads' | 'seo' | 'sms';

export type AssetType =
  | 'email'
  | 'social_post'
  | 'ad_copy'
  | 'blog_outline'
  | 'landing_page'
  | 'sms';

export interface Campaign {
  id: string;
  name: string;
  businessName: string;
  industry: string;
  targetAudience: string;
  geographicMarket: string;
  offer: string;
  goal: string;
  channels: Channel[];
  brandVoice: string;
  primaryCTA: string;
  audiencePainPoints: string;
  uniqueSellingPoints: string;
  status: CampaignStatus;
  createdAt: string;
  updatedAt: string;
  assetCount: number;
  daysRemaining: number | null;
}

export interface Asset {
  id: string;
  campaignId: string;
  campaignName: string;
  type: AssetType;
  title: string;
  preview: string;
  channel: Channel;
  createdAt: string;
  wordCount: number;
}

export interface DashboardStat {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  iconType: 'campaigns' | 'assets' | 'channels' | 'time';
}

// ─── Mock Campaigns ───────────────────────────────────────────────────────────

export const mockCampaigns: Campaign[] = [
  {
    id: 'camp-001',
    name: 'Summer Promo 2025',
    businessName: 'AquaFit Studio',
    industry: 'Health & Fitness',
    targetAudience: 'Adults 25–45 interested in swimming and wellness',
    geographicMarket: 'Austin, TX',
    offer: '50% off first month membership + free gear bag',
    goal: 'Generate new memberships during summer season',
    channels: ['email', 'social', 'paid_ads'],
    brandVoice: 'Energetic and motivating',
    primaryCTA: 'Claim Your Spot',
    audiencePainPoints: 'Too busy to work out, gyms feel intimidating, summer heat makes outdoor exercise hard',
    uniqueSellingPoints: 'Heated indoor pool, flexible scheduling, beginner-friendly classes',
    status: 'active',
    createdAt: '2025-05-15T10:00:00Z',
    updatedAt: '2025-06-01T08:30:00Z',
    assetCount: 12,
    daysRemaining: 14,
  },
  {
    id: 'camp-002',
    name: 'Product Launch: ClearDesk Pro',
    businessName: 'NoiseBlock Inc',
    industry: 'Productivity Tools',
    targetAudience: 'Remote workers and freelancers aged 28–45',
    geographicMarket: 'United States (national)',
    offer: 'Early bird pricing — 40% off lifetime license',
    goal: 'Drive pre-launch signups and generate buzz',
    channels: ['email', 'social', 'paid_ads', 'seo', 'sms'],
    brandVoice: 'Professional yet approachable',
    primaryCTA: 'Get Early Access',
    audiencePainPoints: 'Constant distractions, lack of focus, noisy home office environment',
    uniqueSellingPoints: 'AI-powered noise cancellation, integrates with all major tools, one-click focus mode',
    status: 'draft',
    createdAt: '2025-06-10T14:00:00Z',
    updatedAt: '2025-06-10T14:00:00Z',
    assetCount: 0,
    daysRemaining: null,
  },
  {
    id: 'camp-003',
    name: 'Local SEO Push Q2',
    businessName: 'Maple Street Dental',
    industry: 'Healthcare',
    targetAudience: 'Families and adults in the local area needing dental care',
    geographicMarket: 'Portland, OR (5-mile radius)',
    offer: 'Free new patient exam and X-rays',
    goal: 'Increase local search visibility and new patient bookings',
    channels: ['seo', 'email'],
    brandVoice: 'Warm, reassuring, and professional',
    primaryCTA: 'Book Your Free Exam',
    audiencePainPoints: 'Dental anxiety, cost concerns, finding a trustworthy local dentist',
    uniqueSellingPoints: 'Gentle care approach, same-day appointments, accepts most insurance',
    status: 'archived',
    createdAt: '2025-03-01T09:00:00Z',
    updatedAt: '2025-05-31T17:00:00Z',
    assetCount: 8,
    daysRemaining: 0,
  },
];

// ─── Mock Assets ──────────────────────────────────────────────────────────────

export const mockAssets: Asset[] = [
  {
    id: 'asset-001',
    campaignId: 'camp-001',
    campaignName: 'Summer Promo 2025',
    type: 'email',
    title: 'Welcome Email — Summer Membership Offer',
    preview: 'Subject: Your summer transformation starts here 🏊 Hi [First Name], we\'re excited to offer you...',
    channel: 'email',
    createdAt: '2025-05-16T10:00:00Z',
    wordCount: 312,
  },
  {
    id: 'asset-002',
    campaignId: 'camp-001',
    campaignName: 'Summer Promo 2025',
    type: 'social_post',
    title: 'Instagram Carousel — 5 Reasons to Join This Summer',
    preview: 'Slide 1: Beat the heat. Cool off AND get fit. 🌊 Slide 2: Our heated indoor pool is open 6am–10pm...',
    channel: 'social',
    createdAt: '2025-05-16T10:15:00Z',
    wordCount: 185,
  },
  {
    id: 'asset-003',
    campaignId: 'camp-001',
    campaignName: 'Summer Promo 2025',
    type: 'ad_copy',
    title: 'Google Ads Headline Set — Summer Membership',
    preview: 'Headline 1: 50% Off Your First Month | Headline 2: Indoor Pool + Fitness Classes | Headline 3: Join AquaFit Today...',
    channel: 'paid_ads',
    createdAt: '2025-05-17T09:00:00Z',
    wordCount: 94,
  },
  {
    id: 'asset-004',
    campaignId: 'camp-001',
    campaignName: 'Summer Promo 2025',
    type: 'ad_copy',
    title: 'Facebook Ad Copy — Retargeting Warm Audiences',
    preview: 'Still thinking about joining? You\'ve got nothing to lose — your first month is 50% off and we\'ll throw in a free...',
    channel: 'paid_ads',
    createdAt: '2025-05-18T11:30:00Z',
    wordCount: 128,
  },
  {
    id: 'asset-005',
    campaignId: 'camp-001',
    campaignName: 'Summer Promo 2025',
    type: 'blog_outline',
    title: '5 Tips for Building a Summer Fitness Routine',
    preview: 'Introduction: Why summer is the best time to start. Tip 1: Start with low-impact activities like swimming...',
    channel: 'seo',
    createdAt: '2025-05-19T14:00:00Z',
    wordCount: 247,
  },
  {
    id: 'asset-006',
    campaignId: 'camp-001',
    campaignName: 'Summer Promo 2025',
    type: 'sms',
    title: 'Thank-You SMS — Post Signup',
    preview: 'Welcome to AquaFit! 🎉 Your 50% discount has been applied. Book your first class at aquafit.com/book...',
    channel: 'sms',
    createdAt: '2025-05-20T08:00:00Z',
    wordCount: 38,
  },
];

// ─── Mock Stats ───────────────────────────────────────────────────────────────

export const mockStats: DashboardStat[] = [
  {
    id: 'stat-001',
    title: 'Total Campaigns',
    value: '3',
    change: '+1 this month',
    changeType: 'positive',
    iconType: 'campaigns',
  },
  {
    id: 'stat-002',
    title: 'Assets Generated',
    value: '20',
    change: '+8 this month',
    changeType: 'positive',
    iconType: 'assets',
  },
  {
    id: 'stat-003',
    title: 'Active Channels',
    value: '5',
    change: 'No change',
    changeType: 'neutral',
    iconType: 'channels',
  },
  {
    id: 'stat-004',
    title: 'Avg. Campaign Duration',
    value: '30 days',
    change: 'Standard',
    changeType: 'neutral',
    iconType: 'time',
  },
];

// ─── Industry Options ─────────────────────────────────────────────────────────

export const industryOptions = [
  'Health & Fitness',
  'Healthcare',
  'Food & Beverage',
  'Retail & E-commerce',
  'Real Estate',
  'Professional Services',
  'Technology & SaaS',
  'Productivity Tools',
  'Education & Coaching',
  'Home Services',
  'Beauty & Wellness',
  'Finance & Insurance',
  'Non-Profit',
  'Other',
];

export const goalOptions = [
  'Generate new leads',
  'Drive product/service sales',
  'Build brand awareness',
  'Grow email list',
  'Increase repeat purchases',
  'Launch a new product',
  'Drive event registrations',
  'Boost local visibility',
  'Re-engage past customers',
];

export const brandVoiceOptions = [
  'Professional and authoritative',
  'Friendly and conversational',
  'Energetic and motivating',
  'Warm and empathetic',
  'Bold and direct',
  'Educational and informative',
  'Playful and fun',
  'Luxury and premium',
];

export const channelOptions: { value: Channel; label: string }[] = [
  { value: 'email', label: 'Email Marketing' },
  { value: 'social', label: 'Social Media' },
  { value: 'paid_ads', label: 'Paid Ads' },
  { value: 'seo', label: 'SEO / Blog' },
  { value: 'sms', label: 'SMS' },
];
