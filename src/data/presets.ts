import type { Channel } from '@/data/mock';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface IndustryPreset {
  id: string;
  label: string;
  description: string;
  icon: string; // emoji
  // Fields that prefill into the campaign form
  industry: string;
  targetAudience: string;
  audiencePainPoints: string;
  uniqueSellingPoints: string;
  brandVoice: string;
  primaryCTA: string;
  channels: Channel[];
  // Preview-only (not written to form)
  sampleGoal: string;
  sampleContentFocus: string;
}

export interface CampaignTemplate {
  id: string;
  label: string;
  description: string;
  icon: string; // emoji
  // Fields that prefill into the campaign form
  goal: string;
  primaryCTA: string;
  offer: string; // hint/example text
  brandVoice: string;
  channels: Channel[];
  // Preview-only
  sampleMessaging: string;
  sampleContentFocus: string;
}

// ── Industry Presets ──────────────────────────────────────────────────────────

export const industryPresets: IndustryPreset[] = [
  {
    id: 'home-services',
    label: 'Home Services',
    description: 'Plumbers, electricians, HVAC, cleaning, landscaping, and similar trades.',
    icon: '🏠',
    industry: 'Home Services',
    targetAudience: 'Homeowners aged 30–60 in the local area who need reliable, professional home services',
    audiencePainPoints:
      'Hard to find trustworthy contractors, fear of overcharging, inconvenient scheduling, past bad experiences with unreliable trades',
    uniqueSellingPoints:
      'Licensed and insured, upfront pricing, same-day or next-day availability, local reputation and reviews',
    brandVoice: 'Warm and empathetic',
    primaryCTA: 'Book a Free Estimate',
    channels: ['email', 'social', 'seo'],
    sampleGoal: 'Generate new local service bookings',
    sampleContentFocus: 'Trust-building, before/after results, seasonal tips, local testimonials',
  },
  {
    id: 'med-spa',
    label: 'Med Spa',
    description: 'Aesthetic clinics, skin care, injectables, laser treatments, and wellness spas.',
    icon: '✨',
    industry: 'Beauty & Wellness',
    targetAudience: 'Women and men aged 28–55 interested in non-surgical aesthetic treatments and self-confidence',
    audiencePainPoints:
      'Unsure which treatments work, afraid of looking unnatural, high perceived cost, nervous about first visit',
    uniqueSellingPoints:
      'Board-certified practitioners, natural-looking results, complimentary consultations, flexible payment options',
    brandVoice: 'Luxury and premium',
    primaryCTA: 'Book a Free Consultation',
    channels: ['social', 'email', 'paid_ads'],
    sampleGoal: 'Drive consultation bookings and new client acquisition',
    sampleContentFocus: 'Before/after transformations, treatment education, confidence stories, seasonal promotions',
  },
  {
    id: 'gym-fitness',
    label: 'Gym / Fitness',
    description: 'Gyms, personal trainers, yoga studios, CrossFit boxes, and fitness coaches.',
    icon: '💪',
    industry: 'Health & Fitness',
    targetAudience: 'Adults aged 22–50 who want to get in shape, build strength, or improve their health and energy levels',
    audiencePainPoints:
      'Lack of motivation, intimidating gym environments, not knowing where to start, inconsistent results, busy schedule',
    uniqueSellingPoints:
      'Beginner-friendly environment, expert coaching, flexible class times, community atmosphere, proven results',
    brandVoice: 'Energetic and motivating',
    primaryCTA: 'Claim Your Free Week',
    channels: ['social', 'email', 'paid_ads'],
    sampleGoal: 'Drive new memberships and trial sign-ups',
    sampleContentFocus: 'Transformation stories, workout tips, community highlights, limited-time offers',
  },
  {
    id: 'real-estate',
    label: 'Real Estate',
    description: 'Agents, brokers, property managers, and real estate investors.',
    icon: '🏡',
    industry: 'Real Estate',
    targetAudience: 'Home buyers, sellers, and investors aged 28–60 in the local or regional market',
    audiencePainPoints:
      'Overwhelmed by the buying/selling process, fear of overpaying or underselling, not knowing who to trust, timing uncertainty',
    uniqueSellingPoints:
      'Deep local market knowledge, proven track record, full-service support from listing to close, clear communication throughout',
    brandVoice: 'Professional and authoritative',
    primaryCTA: 'Get a Free Home Valuation',
    channels: ['email', 'social', 'seo'],
    sampleGoal: 'Generate seller leads and buyer consultations',
    sampleContentFocus: 'Market updates, neighborhood spotlights, client success stories, buying/selling tips',
  },
  {
    id: 'local-professional',
    label: 'Local Professional Services',
    description: 'Attorneys, accountants, consultants, financial advisors, and similar professionals.',
    icon: '💼',
    industry: 'Professional Services',
    targetAudience: 'Small business owners and individuals aged 30–60 who need expert professional guidance',
    audiencePainPoints:
      'Confusing and jargon-heavy processes, fear of costly mistakes, not knowing which professional to trust, previous bad experiences',
    uniqueSellingPoints:
      'Clear plain-language communication, transparent pricing, local expertise, proven client outcomes, responsive service',
    brandVoice: 'Professional and authoritative',
    primaryCTA: 'Schedule a Free Consultation',
    channels: ['email', 'seo', 'social'],
    sampleGoal: 'Drive consultation bookings and new client acquisition',
    sampleContentFocus: 'Educational content, FAQ posts, case studies, client testimonials, local credibility',
  },
  {
    id: 'ecommerce',
    label: 'E-commerce Brand',
    description: 'Online stores selling physical or digital products to consumers.',
    icon: '🛍️',
    industry: 'Retail & E-commerce',
    targetAudience: 'Online shoppers aged 20–45 who value quality, convenience, and finding the right product for their needs',
    audiencePainPoints:
      'Too many options, unsure about product quality, slow shipping, bad return experiences, feeling like just another order number',
    uniqueSellingPoints:
      'High-quality products, fast shipping, easy returns, excellent customer support, loyal community of buyers',
    brandVoice: 'Friendly and conversational',
    primaryCTA: 'Shop Now',
    channels: ['email', 'social', 'paid_ads', 'sms'],
    sampleGoal: 'Drive online sales and repeat purchases',
    sampleContentFocus: 'Product spotlights, user-generated content, promotions, behind-the-scenes, loyalty rewards',
  },
];

// ── Campaign Templates ────────────────────────────────────────────────────────

export const campaignTemplates: CampaignTemplate[] = [
  {
    id: 'lead-generation',
    label: 'Lead Generation Offer',
    description: 'Attract new prospects with a compelling lead magnet or free offer.',
    icon: '🎯',
    goal: 'Generate new leads',
    primaryCTA: 'Claim Your Free [Offer]',
    offer:
      'A free consultation, audit, guide, or trial that gives prospects a low-risk way to experience your value.',
    brandVoice: 'Friendly and conversational',
    channels: ['email', 'social', 'paid_ads'],
    sampleMessaging: 'Lead with the free offer, reduce risk, build trust before asking for commitment.',
    sampleContentFocus: 'Problem-aware content, lead magnet value, social proof, urgency to act now',
  },
  {
    id: 'seasonal-promo',
    label: 'Seasonal Promotion',
    description: 'Time-limited offer tied to a season, holiday, or calendar event.',
    icon: '📅',
    goal: 'Drive product/service sales',
    primaryCTA: 'Claim This Offer',
    offer:
      'A discount, bundle, or bonus tied to a specific time window — e.g. Black Friday, New Year, Summer Sale.',
    brandVoice: 'Energetic and motivating',
    channels: ['email', 'social', 'paid_ads', 'sms'],
    sampleMessaging: 'Create urgency with deadline, highlight savings, repeat CTA across channels.',
    sampleContentFocus: 'Countdown content, offer highlights, testimonials, reminder emails, last-chance posts',
  },
  {
    id: 'new-service-launch',
    label: 'New Service Launch',
    description: 'Announce and drive awareness for a brand-new service or product.',
    icon: '🚀',
    goal: 'Launch a new product',
    primaryCTA: 'Be the First to Try It',
    offer:
      'Early access pricing, founder discount, or a launch bonus for the first wave of customers.',
    brandVoice: 'Bold and direct',
    channels: ['email', 'social', 'paid_ads'],
    sampleMessaging: 'Build anticipation before launch, reveal value clearly, celebrate early adopters.',
    sampleContentFocus: 'Teaser content, behind-the-scenes, launch day announcement, early adopter stories',
  },
  {
    id: 'brand-awareness',
    label: 'Brand Awareness Campaign',
    description: 'Grow visibility, build authority, and stay top-of-mind in your market.',
    icon: '📣',
    goal: 'Build brand awareness',
    primaryCTA: 'Learn More',
    offer:
      'Valuable content, educational resources, or community-building that positions your brand as the expert.',
    brandVoice: 'Educational and informative',
    channels: ['social', 'seo', 'email'],
    sampleMessaging: 'Lead with value, not selling. Build trust through consistency and expertise.',
    sampleContentFocus: 'Educational posts, thought leadership, how-to content, community spotlights, FAQs',
  },
  {
    id: 're-engagement',
    label: 'Re-engagement Campaign',
    description: 'Win back past customers or inactive subscribers with a targeted offer.',
    icon: '🔄',
    goal: 'Re-engage past customers',
    primaryCTA: 'Come Back and Save',
    offer:
      'A win-back discount, exclusive returning-customer offer, or a compelling reason to reconnect.',
    brandVoice: 'Warm and empathetic',
    channels: ['email', 'sms', 'paid_ads'],
    sampleMessaging: 'Acknowledge the gap, show what\'s new, give them a reason to return without pressure.',
    sampleContentFocus: 'Personal outreach emails, "we\'ve missed you" posts, updated offer highlights, testimonials',
  },
  {
    id: 'appointment-booking',
    label: 'Appointment Booking Push',
    description: 'Fill your calendar with booked appointments and consultations.',
    icon: '📆',
    goal: 'Drive event registrations',
    primaryCTA: 'Book Your Appointment',
    offer:
      'A free or discounted first appointment, consultation, or call to reduce friction on the first step.',
    brandVoice: 'Friendly and conversational',
    channels: ['email', 'social', 'sms'],
    sampleMessaging: 'Make booking feel easy, show availability, reduce hesitation with a low-commitment first step.',
    sampleContentFocus: 'Testimonials, easy booking CTA, FAQ about what to expect, reminder sequences',
  },
];
