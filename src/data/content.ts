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
    desc: 'Tinder, Bumble, Hinge: catfish and romance-scam patterns',
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

export const SAMPLE_REPORTS: SampleReport[] = [
  {
    id: 'fritzthatcat',
    name: 'Fritz',
    handle: '@fritzthatcat',
    platform: 'Instagram',
    score: 87,
    followers: '4.8K followers',
    verdict: 'Came through clean',
    fakePct: 11,
    avatarColor: 'bg-emerald-600',
    avatarImage: '/images/avatars/fritzthatcat.jpg',
    engagementRate: '3.4%',
    suspiciousSpike: 'Posted steadily for years: 2,222 posts, no bursts',
    riskSignals: [
      'No signs of engagement pods or automated scripts',
    ],
    verifiedSignals: [
      'More than 2,220 posts over several years, the pace of a person, not a script',
      'Follows about one account for every 2.4 followers, normal for an active small creator',
      'Comments come from a recognisable community of cat and lifestyle accounts',
    ],
  },
  {
    id: 'mrbeast',
    name: 'MrBeast',
    handle: '@mrbeast',
    platform: 'YouTube',
    score: 94,
    followers: '342M subscribers',
    verdict: 'Came through clean',
    fakePct: 4,
    avatarColor: 'bg-red-500',
    avatarImage: '/images/avatars/mrbeast.jpg',
    engagementRate: '8.4%',
    suspiciousSpike: 'Grew steadily for more than eight years, no sudden jumps',
    riskSignals: [
      'No ghost patterns found in the partner channel numbers',
      'Comments vary in wording and length the way real viewers write',
    ],
    verifiedSignals: [
      'YouTube Partner badge',
      'Views per video spread the way organic audiences do',
      'Likes and comments keep pace with views',
    ],
  },
  {
    id: 'lucamodels',
    name: 'Luca, lifestyle',
    handle: '@lucamodels',
    platform: 'Instagram',
    score: 31,
    followers: '480K followers',
    verdict: 'Mostly ghost',
    fakePct: 67,
    avatarColor: 'bg-purple-500',
    avatarImage: '/images/avatars/luca.jpg',
    engagementRate: '0.42%',
    suspiciousSpike: '180,000 followers arrived in 48 hours, four months ago',
    riskSignals: [
      'Engagement is 88% below the normal range for accounts over 400K',
      'Followers arrived in bursts, from accounts with no posts of their own',
      'Comments are mostly repeated emoji, the mark of an engagement pod',
    ],
    verifiedSignals: [
      'Account has been active for more than three years',
      'Photo quality is consistent from post to post',
    ],
  },
  {
    id: 'maya',
    name: 'Maya',
    handle: '@dance.maya',
    platform: 'TikTok',
    score: 78,
    followers: '1.2M followers',
    verdict: 'Mostly came through',
    fakePct: 18,
    avatarColor: 'bg-pink-500',
    avatarImage: '/images/avatars/maya.jpg',
    engagementRate: '5.8%',
    suspiciousSpike: 'A viral video brought a real wave of followers',
    riskSignals: [
      'A small number of bots followed after a trending sound',
      'The follower spike lines up with one viral dance video',
    ],
    verifiedSignals: [
      'Videos reach more than 65% of followers, a strong sign of a live audience',
      'Talks back and forth with other dancers in the same niche',
      'No sign of bought follower batches',
    ],
  },
  {
    id: 'alex',
    name: '“Alex” on Hinge',
    handle: 'alex_travels',
    platform: 'Hinge',
    score: 22,
    followers: 'Dating profile',
    verdict: 'Romance-scam pattern',
    fakePct: 78,
    avatarColor: 'bg-amber-600',
    avatarImage: '/images/avatars/alex.jpg',
    engagementRate: 'N/A (Dating)',
    suspiciousSpike: 'Profile is 12 days old, with photos from a luxury stock catalogue',
    riskSignals: [
      'Asks to move to WhatsApp or Telegram within the first three messages',
      'Photos match a commercial modelling catalogue in a reverse image search',
      'The story about work and travel changes between messages',
    ],
    verifiedSignals: [
      'Phone number was verified with the app',
    ],
  },
  {
    id: 'quickdeals',
    name: 'QuickDeals Store',
    handle: 'quickdeals_store',
    platform: 'Marketplace',
    score: 38,
    followers: '3-day-old seller',
    verdict: 'Mostly ghost: slow down',
    fakePct: 62,
    avatarColor: 'bg-blue-500',
    avatarImage: '/images/avatars/quickdeals.jpg',
    engagementRate: '1.2%',
    suspiciousSpike: 'A new seller listing high-end electronics at 70% off',
    riskSignals: [
      'Asks for Zelle or crypto, off the platform',
      'Opened in the last 72 hours, already with 20 luxury listings',
      'Refuses escrow and the platform’s buyer protection',
    ],
    verifiedSignals: [
      'Email address was confirmed automatically',
    ],
  },
  {
    id: 'fittitan',
    name: 'Fit Titan',
    handle: '@fittitan',
    platform: 'Instagram',
    score: 88,
    followers: '210K followers',
    verdict: 'Came through clean',
    fakePct: 7,
    avatarColor: 'bg-emerald-600',
    avatarImage: '/images/avatars/fittitan.jpg',
    engagementRate: '3.9%',
    suspiciousSpike: 'Grew a little every month, no jumps',
    riskSignals: [
      'A handful of bots, normal for a visible fitness account',
    ],
    verifiedSignals: [
      'Comments ask detailed training questions and get answers',
      'Regularly tagged by real clients and gym members',
      'People answer story polls within hours',
    ],
  },
  {
    id: 'pixelpro',
    name: 'Pixel Pro Dev',
    handle: 'pixel_pro_dev',
    platform: 'Fiverr / Upwork',
    score: 71,
    followers: 'Freelancer / Gig',
    verdict: 'Mostly came through',
    fakePct: 29,
    avatarColor: 'bg-indigo-500',
    avatarImage: '/images/avatars/pixelpro.jpg',
    engagementRate: '94% response',
    suspiciousSpike: 'Twelve reviews arrived in a single day',
    riskSignals: [
      'Reviews cluster together, which suggests review swapping',
      'Portfolio links point to template code, not original work',
    ],
    verifiedSignals: [
      'Identity verified by the platform',
      'More than 40 completed orders over 18 months',
      'Top Rated badge in full-stack development',
    ],
  },
  {
    id: 'cryptogainz',
    name: 'Crypto Gainz',
    handle: '@crypto_gainz',
    platform: 'X / Twitter',
    score: 19,
    followers: '95K followers',
    verdict: 'Mostly ghost',
    fakePct: 81,
    avatarColor: 'bg-rose-600',
    avatarImage: '/images/avatars/cryptogainz.jpg',
    engagementRate: '0.18%',
    suspiciousSpike: 'Went from 2,000 to 95,000 followers in five days',
    riskSignals: [
      '81% of followers have default avatars and no followers of their own',
      'Promotes paid Telegram trading-signal groups',
      'Replies are full of bots posting the same text',
    ],
    verifiedSignals: [
      'Blue check is a paid subscription, not verification',
    ],
  },
];

export const FAQS: FAQItem[] = [
  {
    q: 'Does it cost anything?',
    a: 'No. There is no account, no paywall and no card. You paste a handle, the print develops, and you can share the link.',
  },
  {
    q: 'Is the score real, or made up?',
    a: 'It is arithmetic over public numbers: followers against following, how much the account has posted, and engagement against the normal range for an audience that size. Where a platform answers, the numbers are pulled live; where it doesn’t, we ask you to type in what the profile shows. Nothing is randomised and nothing is guessed.',
  },
  {
    q: 'Do you need a password or private data?',
    a: 'Never. We only read what anyone can already see on a public profile. We will never ask you to log in to anything.',
  },
  {
    q: 'Which profiles can I check?',
    a: 'Instagram, TikTok, YouTube and X, plus dating profiles (Tinder, Bumble, Hinge), marketplace sellers and freelance profiles on sites like Fiverr and Upwork.',
  },
  {
    q: 'How sure is it?',
    a: 'Sure enough to tell you where to look, not sure enough to decide for you. A ghost can be a bought follower, a bot, or a real person who stopped using the app. Read the flags, then use your own judgement, especially where money or your safety is involved.',
  },
  {
    q: 'Can it catch a romance scam?',
    a: 'It catches the patterns romance scams usually leave: a profile a few days old, photos that match a modelling catalogue, a push to move to WhatsApp or Telegram, and any talk of money. If you see those, slow down and talk to someone you trust.',
  },
];
