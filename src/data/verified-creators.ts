export interface VerifiedCreator {
  handle: string;
  name: string;
  platform: 'Instagram' | 'YouTube' | 'TikTok' | 'X' | 'Reddit';
  followers: number;
  following: number;
  posts: number;
  avatarUrl: string;
  verified: boolean;
  score: number;
  verdict: string;
  fakePct: number;
  realPct: number;
  engagementRate: string;
  suspiciousSpike: string;
  riskSignals: string[];
  verifiedSignals: string[];
}

export const VERIFIED_CREATORS: Record<string, VerifiedCreator> = {
  nike: {
    handle: '@nike',
    name: 'Nike',
    platform: 'Instagram',
    followers: 291000000,
    following: 268,
    posts: 1665,
    avatarUrl: 'https://ui-avatars.com/api/?name=Nike&background=111827&color=ffffff&size=200&bold=true',
    verified: true,
    score: 91,
    verdict: 'Top Tier Authentic Brand',
    fakePct: 9,
    realPct: 91,
    engagementRate: '0.94%',
    suspiciousSpike: 'Consistent organic engagement trajectory across international markets',
    riskSignals: ['Zero active engagement pod or automated syndication signatures detected'],
    verifiedSignals: [
      'Healthy asymmetric follower-to-following ratio (1,085,820:1) typical of elite brand traction',
      'Consistent publishing history with 1,665 curated high-production campaigns',
      'Global presence indexed across Meta official verification registries',
    ],
  },
  nasa: {
    handle: '@nasa',
    name: 'NASA',
    platform: 'Instagram',
    followers: 97000000,
    following: 72,
    posts: 4500,
    avatarUrl: 'https://ui-avatars.com/api/?name=NASA&background=0B3D91&color=ffffff&size=200&bold=true',
    verified: true,
    score: 96,
    verdict: 'Exceptional Authenticity',
    fakePct: 4,
    realPct: 96,
    engagementRate: '1.45%',
    suspiciousSpike: 'Decade-long sustained organic growth anchored in major mission broadcasts',
    riskSignals: ['No bot spikes or commercial follower manipulation signatures detected'],
    verifiedSignals: [
      'Official scientific institution verified by Meta public agency registry',
      'Over 4,500 historical educational media releases',
      'High genuine comment linguistic variance spanning global educational demographics',
    ],
  },
  mrbeast: {
    handle: '@mrbeast',
    name: 'MrBeast',
    platform: 'YouTube',
    followers: 342000000,
    following: 240,
    posts: 840,
    avatarUrl: '/images/avatars/mrbeast.jpg',
    verified: true,
    score: 94,
    verdict: 'Likely authentic',
    fakePct: 6,
    realPct: 94,
    engagementRate: '8.4%',
    suspiciousSpike: 'Consistent exponential organic growth over 8+ years',
    riskSignals: ['Natural algorithmic spillover consistent with top 0.01% platform reach'],
    verifiedSignals: [
      'Verified Google YouTube Partner badge',
      'Organic video view distribution averaging 120M+ views per video',
      'High retention and genuine interaction ratios',
    ],
  },
  cristiano: {
    handle: '@cristiano',
    name: 'Cristiano Ronaldo',
    platform: 'Instagram',
    followers: 642000000,
    following: 580,
    posts: 3740,
    avatarUrl: 'https://ui-avatars.com/api/?name=CR7&background=EF4444&color=ffffff&size=200&bold=true',
    verified: true,
    score: 88,
    verdict: 'Verified Global Figure',
    fakePct: 12,
    realPct: 88,
    engagementRate: '1.82%',
    suspiciousSpike: 'World-record organic follower velocity tied to Ballon d’Or and international tournaments',
    riskSignals: ['Minor secondary bot accounts follow mega-profiles automatically'],
    verifiedSignals: [
      'Most followed human account in history',
      'High median engagement exceeding 7M likes per post',
      'Decade-long verified athletic and brand footprint',
    ],
  },
  leomessi: {
    handle: '@leomessi',
    name: 'Leo Messi',
    platform: 'Instagram',
    followers: 504000000,
    following: 315,
    posts: 1320,
    avatarUrl: 'https://ui-avatars.com/api/?name=LM10&background=0284C7&color=ffffff&size=200&bold=true',
    verified: true,
    score: 91,
    verdict: 'Elite Athletic Authenticity',
    fakePct: 9,
    realPct: 91,
    engagementRate: '2.14%',
    suspiciousSpike: 'Organic viral peaks corresponding with World Cup victory and Inter Miami matches',
    riskSignals: ['High passive follow volume from generic soccer enthusiast accounts'],
    verifiedSignals: [
      'Record-holding organic engagement for individual sporting post in internet history',
      'Organic follower ratio exceeding 1,600,000:1',
      'Zero commercial pod activity detected',
    ],
  },
  selenagomez: {
    handle: '@selenagomez',
    name: 'Selena Gomez',
    platform: 'Instagram',
    followers: 423000000,
    following: 290,
    posts: 2010,
    avatarUrl: 'https://ui-avatars.com/api/?name=Selena&background=EC4899&color=ffffff&size=200&bold=true',
    verified: true,
    score: 87,
    verdict: 'Authentic Creator & Artist',
    fakePct: 13,
    realPct: 87,
    engagementRate: '1.65%',
    suspiciousSpike: 'Smooth organic growth with cultural and beauty brand spikes',
    riskSignals: ['Inorganic bot scraping common across 400M+ accounts'],
    verifiedSignals: [
      'High personal engagement on Rare Beauty and organic candid updates',
      'Genuine community interaction without follow-unfollow automation',
    ],
  },
  apple: {
    handle: '@apple',
    name: 'Apple',
    platform: 'Instagram',
    followers: 34000000,
    following: 1,
    posts: 1120,
    avatarUrl: 'https://ui-avatars.com/api/?name=Apple&background=000000&color=ffffff&size=200&bold=true',
    verified: true,
    score: 97,
    verdict: 'Top Tier Authentic Brand',
    fakePct: 3,
    realPct: 97,
    engagementRate: '0.82%',
    suspiciousSpike: 'Shot on iPhone campaign organic curation with zero paid follower schemes',
    riskSignals: ['Zero spam or purchased engagement markers detected'],
    verifiedSignals: [
      'Uncompromising 1-following curation model',
      '100% community-submitted UGC photography and cinematography',
    ],
  },
  google: {
    handle: '@google',
    name: 'Google',
    platform: 'Instagram',
    followers: 15200000,
    following: 85,
    posts: 2800,
    avatarUrl: 'https://ui-avatars.com/api/?name=Google&background=4285F4&color=ffffff&size=200&bold=true',
    verified: true,
    score: 95,
    verdict: 'Exceptional Authenticity',
    fakePct: 5,
    realPct: 95,
    engagementRate: '0.75%',
    suspiciousSpike: 'Stable corporate publishing trajectory over 12+ years',
    riskSignals: ['None detected'],
    verifiedSignals: [
      'Official verified Meta brand badge',
      'Multi-regional employee and research engineering contributor posts',
    ],
  },
  taylorswift: {
    handle: '@taylorswift',
    name: 'Taylor Swift',
    platform: 'Instagram',
    followers: 283000000,
    following: 0,
    posts: 630,
    avatarUrl: 'https://ui-avatars.com/api/?name=TS&background=F59E0B&color=ffffff&size=200&bold=true',
    verified: true,
    score: 93,
    verdict: 'Top Tier Organic Fanbase',
    fakePct: 7,
    realPct: 93,
    engagementRate: '3.42%',
    suspiciousSpike: 'The Eras Tour stadium surges; organic ticket release ripples',
    riskSignals: ['Fan account duplication in comment sections'],
    verifiedSignals: [
      'Highest organic like-to-view ratio in music industry',
      'Zero following curation indicating purely one-directional broadcast authority',
    ],
  },
  therock: {
    handle: '@therock',
    name: 'Dwayne Johnson',
    platform: 'Instagram',
    followers: 396000000,
    following: 730,
    posts: 7800,
    avatarUrl: 'https://ui-avatars.com/api/?name=Rock&background=78350F&color=ffffff&size=200&bold=true',
    verified: true,
    score: 86,
    verdict: 'Verified High-Volume Creator',
    fakePct: 14,
    realPct: 86,
    engagementRate: '0.88%',
    suspiciousSpike: 'Consistent daily workout and film production publishing over 14 years',
    riskSignals: ['High presence of spam bots in open comment threads'],
    verifiedSignals: [
      'Over 7,800 active video and photo posts demonstrating prolonged human authenticity',
      'Strong cross-platform footprint across film box office and Teremana brand',
    ],
  },
  natgeo: {
    handle: '@natgeo',
    name: 'National Geographic',
    platform: 'Instagram',
    followers: 280000000,
    following: 150,
    posts: 29000,
    avatarUrl: 'https://ui-avatars.com/api/?name=NatGeo&background=FBBF24&color=000000&size=200&bold=true',
    verified: true,
    score: 95,
    verdict: 'Pinnacle Documentary Authenticity',
    fakePct: 5,
    realPct: 95,
    engagementRate: '0.62%',
    suspiciousSpike: 'Steady archival and field journalism publishing over 15 years',
    riskSignals: ['None detected'],
    verifiedSignals: [
      '29,000+ published field assignments from world-class photojournalists',
      'Global institutional verification',
    ],
  },
  khaby: {
    handle: '@khaby.lame',
    name: 'Khaby Lame',
    platform: 'TikTok',
    followers: 162000000,
    following: 80,
    posts: 1200,
    avatarUrl: 'https://ui-avatars.com/api/?name=Khaby&background=10B981&color=ffffff&size=200&bold=true',
    verified: true,
    score: 92,
    verdict: 'Top Organic Creator',
    fakePct: 8,
    realPct: 92,
    engagementRate: '4.8%',
    suspiciousSpike: 'Historic viral velocity with comedic lifehack reactions',
    riskSignals: ['Occasional repost accounts mirroring content'],
    verifiedSignals: [
      'Most followed individual on TikTok',
      'Exceptional view completion rate exceeding 72%',
    ],
  },
  charlidamelio: {
    handle: '@charlidamelio',
    name: "Charli D'Amelio",
    platform: 'TikTok',
    followers: 155000000,
    following: 1400,
    posts: 2400,
    avatarUrl: 'https://ui-avatars.com/api/?name=Charli&background=8B5CF6&color=ffffff&size=200&bold=true',
    verified: true,
    score: 85,
    verdict: 'Mainstream Creator',
    fakePct: 15,
    realPct: 85,
    engagementRate: '3.1%',
    suspiciousSpike: 'Early platform expansion phase; normalized organic velocity',
    riskSignals: ['Audience saturation with inactive casual teen user accounts'],
    verifiedSignals: [
      'Consistent multi-year creator presence across TikTok, Hulu, and fashion brands',
      'High video replay and sound attribution metrics',
    ],
  },
  lucamodels: {
    handle: '@lucamodels',
    name: 'Luca — Lifestyle',
    platform: 'Instagram',
    followers: 480000,
    following: 3400,
    posts: 65,
    avatarUrl: '/images/avatars/luca.jpg',
    verified: false,
    score: 31,
    verdict: 'High risk — likely fake',
    fakePct: 67,
    realPct: 33,
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
  maya: {
    handle: '@dance.maya',
    name: 'Maya',
    platform: 'TikTok',
    followers: 1200000,
    following: 410,
    posts: 340,
    avatarUrl: '/images/avatars/maya.jpg',
    verified: false,
    score: 78,
    verdict: 'Mostly genuine, minor flags',
    fakePct: 18,
    realPct: 82,
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
};

export function getVerifiedCreator(cleanHandle: string): VerifiedCreator | null {
  const norm = cleanHandle.replace(/^@/, '').toLowerCase().trim();
  // Direct match
  if (VERIFIED_CREATORS[norm]) return VERIFIED_CREATORS[norm];
  // Substring or aliases
  if (norm === 'nike' || norm.includes('nike')) return VERIFIED_CREATORS.nike;
  if (norm === 'nasa' || norm.includes('nasa')) return VERIFIED_CREATORS.nasa;
  if (norm === 'mrbeast' || norm.includes('mrbeast')) return VERIFIED_CREATORS.mrbeast;
  if (norm === 'ronaldo' || norm === 'cr7' || norm.includes('cristiano')) return VERIFIED_CREATORS.cristiano;
  if (norm === 'messi' || norm.includes('messi')) return VERIFIED_CREATORS.leomessi;
  if (norm.includes('selena')) return VERIFIED_CREATORS.selenagomez;
  if (norm === 'apple' || norm.includes('apple')) return VERIFIED_CREATORS.apple;
  if (norm === 'google' || norm.includes('google')) return VERIFIED_CREATORS.google;
  if (norm.includes('taylorswift') || norm === 'taylor') return VERIFIED_CREATORS.taylorswift;
  if (norm.includes('therock') || norm.includes('dwayne')) return VERIFIED_CREATORS.therock;
  if (norm.includes('natgeo') || norm.includes('nationalgeographic')) return VERIFIED_CREATORS.natgeo;
  if (norm.includes('khaby')) return VERIFIED_CREATORS.khaby;
  if (norm.includes('charli')) return VERIFIED_CREATORS.charlidamelio;
  if (norm === 'luca' || norm.includes('lucamodels')) return VERIFIED_CREATORS.lucamodels;
  if (norm === 'maya' || norm.includes('dance.maya')) return VERIFIED_CREATORS.maya;

  return null;
}
