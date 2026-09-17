export interface Platform {
  id: string;
  label: string;
  color: string;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
  desc: string;
  platforms: string[];
}

export interface Feature {
  icon: string;
  title: string;
  text: string;
  image?: string;
  badge?: string;
}

export interface ToolItem {
  id: string;
  icon: string;
  title: string;
  text: string;
  path: string;
}

export interface StepItem {
  step: number;
  icon: string;
  title: string;
  text: string;
}

export interface SampleReport {
  id: string;
  name: string;
  handle: string;
  platform: string;
  score: number;
  followers: string;
  verdict: string;
  fakePct: number;
  avatarColor: string;
  avatarImage: string;
  engagementRate: string;
  suspiciousSpike: string;
  riskSignals: string[];
  verifiedSignals: string[];
  tag?: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export const PLATFORMS: Platform[] = [
  { id: 'instagram', label: 'Instagram', color: '#E1306C' },
  { id: 'tiktok', label: 'TikTok', color: '#111827' },
  { id: 'youtube', label: 'YouTube', color: '#FF0000' },
  { id: 'x', label: 'X / Twitter', color: '#111827' },
  { id: 'facebook', label: 'Facebook', color: '#1877F2' },
  { id: 'linkedin', label: 'LinkedIn', color: '#0A66C2' },
  { id: 'reddit', label: 'Reddit', color: '#FF4500' },
];

export const CATEGORIES: Category[] = [
  {
    id: 'social',
    label: 'Social / Influencer',
    icon: 'BadgeCheck',
    desc: 'Instagram, TikTok, YouTube, X, Facebook, LinkedIn',
    platforms: PLATFORMS.map((p) => p.id),
  },
  {
    id: 'dating',
    label: 'Dating profile',
    icon: 'HeartHandshake',
    desc: 'Tinder, Bumble, Hinge — catfish & romance-scam checks',
    platforms: ['tinder', 'bumble', 'hinge', 'other'],
  },
  {
    id: 'marketplace',
    label: 'Marketplace seller',
    icon: 'Store',
    desc: 'eBay, Facebook Marketplace, Etsy, resellers',
    platforms: ['marketplace'],
  },
  {
    id: 'freelance',
    label: 'Freelancer / gig',
    icon: 'Briefcase',
    desc: 'Fiverr, Upwork, freelance profiles',
    platforms: ['freelance'],
  },
];

export const SPOTLIGHT_FEATURES: Feature[] = [
  {
    icon: 'UserX',
    title: 'Fake Follower & Bot Detection',
    badge: 'Core Engine',
    text: 'We model 100% of the audience to expose mass followings, automated bot farms, and ghost accounts that will never convert.',
    image: '/images/features/fake-detector.png',
  },
  {
    icon: 'HeartHandshake',
    title: 'Romance-Scam & Catfish Shield',
    badge: 'Safety First',
    text: 'Advanced pattern recognition flags fast off-platform requests, stolen photos, and financial bait across Tinder, Bumble, and Hinge.',
    image: '/images/features/romance-shield.png',
  },
  {
    icon: 'ShieldCheck',
    title: 'Marketplace Seller Trust',
    badge: 'Transaction Security',
    text: 'Verify sellers and freelancers before you wire funds. Exposes 3-day-old ghost accounts and fake escrow requests instantly.',
    image: '/images/features/marketplace-trust.png',
  },
  {
    icon: 'Bot',
    title: 'AI Forensic Audit Assistant',
    badge: 'Neural Analysis',
    text: 'Our specialized AI model reasons over multi-vector engagement metrics to produce an executive verdict and actionable safety score.',
    image: '/images/features/ai-forensics.png',
  },
];

export const FEATURES: Feature[] = [
  {
    icon: 'Activity',
    title: 'Engagement Quality Analysis',
    text: 'Score likes and comments to separate true engagement from bot-driven, pod, and purchased fakes.',
  },
  {
    icon: 'Globe2',
    title: 'Audience Demographics Plausibility',
    text: 'Signals on plausibility of gender, age, language and geography so you focus on audiences that actually convert.',
  },
  {
    icon: 'TrendingUp',
    title: 'Velocity & Spike Tracking',
    text: 'Spot suspicious follower spikes over time that reveal purchased bulk followers or aggressive bot injections.',
  },
  {
    icon: 'ScanSearch',
    title: 'Deep Profile Health Audit',
    text: 'Posting cadence, hashtag health, and content performance combine into a single authenticity score.',
  },
  {
    icon: 'Layers',
    title: 'Cross-Platform Footprint',
    text: 'Audit Instagram, TikTok, YouTube, X, Facebook, LinkedIn — plus dating, marketplace and freelance profiles.',
  },
];

export const TOOLS: ToolItem[] = [
  {
    id: 'engagement-rate',
    icon: 'Percent',
    title: 'Engagement Rate Calculator',
    text: 'Instantly compute real engagement rate and compare it to benchmarks for the audience size.',
    path: '/tools/engagement-rate',
  },
  {
    id: 'compare',
    icon: 'GitCompareArrows',
    title: 'Profile Comparison',
    text: 'Put two profiles head-to-head and see which one has the healthier, more authentic audience.',
    path: '/tools/compare',
  },
  {
    id: 'hashtags',
    icon: 'Hash',
    title: 'Hashtag Analyzer',
    text: 'Detect banned/spammy hashtags that shadowban posts and score your tag set quality.',
    path: '/tools/hashtags',
  },
  {
    id: 'bulk',
    icon: 'FileSpreadsheet',
    title: 'Bulk CSV Audit',
    text: 'Upload a CSV of profiles and audit hundreds at once — perfect for agencies vetting creator lists.',
    path: '/tools/bulk',
  },
  {
    id: 'audit',
    icon: 'ScanFace',
    title: 'Full Authenticity Audit',
    text: 'The complete audit across social, dating, marketplace and freelance profiles.',
    path: '/analyze',
  },
];

export const HOW_IT_WORKS: StepItem[] = [
  {
    step: 1,
    icon: 'MousePointerClick',
    title: 'Pick a profile type',
    text: 'Choose social, dating, marketplace or freelancer — and the platform.',
  },
  {
    step: 2,
    icon: 'Keyboard',
    title: 'Enter what you can see',
    text: 'Paste a YouTube handle for live data, or type the public numbers from any profile.',
  },
  {
    step: 3,
    icon: 'Cpu',
    title: 'Get a real verdict',
    text: 'Genuine industry math + an AI assistant produce a score, red flags and safety tips in seconds.',
  },
];

export const SAMPLE_REPORTS: SampleReport[] = [
  {
    id: 'mrbeast',
    name: 'MrBeast',
    handle: '@mrbeast',
    platform: 'YouTube',
    score: 94,
    followers: '342M subscribers',
    verdict: 'Likely authentic',
    fakePct: 4,
    avatarColor: 'bg-red-500',
    avatarImage: '/images/avatars/mrbeast.jpg',
    engagementRate: '8.4%',
    suspiciousSpike: 'Consistent exponential organic growth over 8+ years',
    riskSignals: [
      'None detected — verified partner channel metrics',
      'Comment diversity and linguistic variance well above threshold',
    ],
    verifiedSignals: [
      'Verified Google YouTube Partner badge',
      'Consistent organic video view distribution',
      'High retention and genuine interaction ratios',
    ],
  },
  {
    id: 'lucamodels',
    name: 'Luca — Lifestyle',
    handle: '@lucamodels',
    platform: 'Instagram',
    score: 31,
    followers: '480K followers',
    verdict: 'High risk — likely fake',
    fakePct: 67,
    avatarColor: 'bg-purple-500',
    avatarImage: '/images/avatars/luca.jpg',
    engagementRate: '0.42%',
    suspiciousSpike: 'Suspicious spike detected · 4 months old (+180K in 48h)',
    riskSignals: [
      'Engagement rate is 88% below benchmark for 400K+ accounts',
      'Mass follower bursts from generic accounts with zero posts',
      'Repetitive emoji-only comments indicating engagement pods',
    ],
    verifiedSignals: [
      'Account active for 3+ years',
      'Consistent photography quality',
    ],
  },
  {
    id: 'maya',
    name: 'Maya',
    handle: '@dance.maya',
    platform: 'TikTok',
    score: 78,
    followers: '1.2M followers',
    verdict: 'Mostly genuine, minor flags',
    fakePct: 18,
    avatarColor: 'bg-pink-500',
    avatarImage: '/images/avatars/maya.jpg',
    engagementRate: '5.8%',
    suspiciousSpike: 'Viral video ripple effect; legitimate platform traction',
    riskSignals: [
      'Minor bot spillover from trending sound exploitation',
      'Follower spike correlated with viral dance trend',
    ],
    verifiedSignals: [
      'Strong view-to-follower ratio exceeding 65%',
      'Active community interaction with creators in same niche',
      'No evidence of paid bulk follower injection',
    ],
  },
  {
    id: 'alex',
    name: '"Alex" — Hinge',
    handle: 'alex_travels',
    platform: 'Hinge',
    score: 22,
    followers: 'Dating profile',
    verdict: 'Romance-scam pattern',
    fakePct: 78,
    avatarColor: 'bg-amber-600',
    avatarImage: '/images/avatars/alex.jpg',
    engagementRate: 'N/A (Dating)',
    suspiciousSpike: 'Profile created 12 days ago with stock luxury photos',
    riskSignals: [
      'Pushes to WhatsApp / Telegram within first 3 messages',
      'Reverse image matches commercial modeling catalogue',
      'Inconsistent story regarding employment and travel location',
    ],
    verifiedSignals: [
      'Basic phone verification completed',
    ],
  },
  {
    id: 'quickdeals',
    name: 'QuickDeals Store',
    handle: 'quickdeals_store',
    platform: 'Marketplace',
    score: 38,
    followers: '3-day-old seller',
    verdict: 'Suspicious — proceed with caution',
    fakePct: 62,
    avatarColor: 'bg-blue-500',
    avatarImage: '/images/avatars/quickdeals.jpg',
    engagementRate: '1.2%',
    suspiciousSpike: 'New seller account listing high-end electronics at 70% discount',
    riskSignals: [
      'Demands Zelle or Crypto off-platform payment',
      'Account opened within last 72 hours with 20+ luxury listings',
      'Refuses platform escrow and buyer protection guarantees',
    ],
    verifiedSignals: [
      'Automated email address confirmation',
    ],
  },
  {
    id: 'fittitan',
    name: 'Fit Titan',
    handle: '@fittitan',
    platform: 'Instagram',
    score: 88,
    followers: '210K followers',
    verdict: 'Likely authentic',
    fakePct: 7,
    avatarColor: 'bg-emerald-600',
    avatarImage: '/images/avatars/fittitan.jpg',
    engagementRate: '3.9%',
    suspiciousSpike: 'Steady linear month-over-month community expansion',
    riskSignals: [
      'Negligible bot following typical of high-profile fitness niche',
    ],
    verifiedSignals: [
      'Healthy comment discussion with detailed fitness questions',
      'Consistent tag mentions from real clients and gym members',
      'Real-time story engagement and poll participation',
    ],
  },
  {
    id: 'pixelpro',
    name: 'Pixel Pro Dev',
    handle: 'pixel_pro_dev',
    platform: 'Fiverr / Upwork',
    score: 71,
    followers: 'Freelancer / Gig',
    verdict: 'Mostly genuine, minor flags',
    fakePct: 29,
    avatarColor: 'bg-indigo-500',
    avatarImage: '/images/avatars/pixelpro.jpg',
    engagementRate: '94% response',
    suspiciousSpike: '12 reviews received in single 24-hour block',
    riskSignals: [
      'Review clustering suggesting trade-review exchanges',
      'Portfolio links include template code repositories',
    ],
    verifiedSignals: [
      'Verified platform ID and identity badge',
      'Over 40 completed client orders over 18 months',
      'Top Rated badge in fullstack category',
    ],
  },
  {
    id: 'cryptogainz',
    name: 'Crypto Gainz',
    handle: '@crypto_gainz',
    platform: 'X / Twitter',
    score: 19,
    followers: '95K followers',
    verdict: 'High risk — likely fake',
    fakePct: 81,
    avatarColor: 'bg-rose-600',
    avatarImage: '/images/avatars/cryptogainz.jpg',
    engagementRate: '0.18%',
    suspiciousSpike: 'Follower count jumped from 2K to 95K in 5 days',
    riskSignals: [
      '81% of followers have default egg avatars and 0 followers',
      'Promotes unverified Telegram signals pump groups',
      'Comments filled with automated spam bots repeating identical text',
    ],
    verifiedSignals: [
      'Blue checkmark subscription (paid self-verification)',
    ],
  },
];

export const FAQS: FAQItem[] = [
  {
    q: 'Is isshereal.com free to use?',
    a: 'Yes, 100% free! There are no paid subscriptions, hidden fees, paywalls, or credit card requirements. Anyone can audit social, dating, and seller profiles with zero login needed.',
  },
  {
    q: 'Is the analysis real or made up?',
    a: 'Real. Every score comes from transparent, industry-standard formulas (engagement rate, comment-to-like ratio, view-to-subscriber ratio, growth plausibility and more). YouTube pulls live public data via the official API. Nothing is randomised.',
  },
  {
    q: "Do I need the person's password or private data?",
    a: 'Never. We only use public numbers you can already see on a profile, or public API data. isshereal.com never asks for logins or private information.',
  },
  {
    q: 'Which profiles can I check?',
    a: 'Instagram, TikTok, YouTube, X, Facebook and LinkedIn, plus dating apps (Tinder/Bumble/Hinge), marketplace sellers and freelancer/gig profiles.',
  },
  {
    q: 'How accurate is it?',
    a: 'The engine mirrors the same signals professional audit tools rely on. It gives a strong, explainable estimate — always use it alongside your own judgement, especially for money or dating decisions.',
  },
  {
    q: 'Can it catch romance scams?',
    a: 'Yes. The dating audit flags the classic romance-scam patterns — moving off-platform fast, requests for money or crypto, and inconsistent stories — with clear safety guidance.',
  },
];
