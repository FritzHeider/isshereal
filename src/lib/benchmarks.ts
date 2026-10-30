/**
 * Engagement baselines by audience tier. These mirror the tiers used in
 * calculateProfileScore (src/lib/audit-engine.ts) so a report can show the
 * same yardstick the score was measured against.
 */
export interface Tier {
  label: string;
  min: number;
  expected: number; // percent
}

export const ENGAGEMENT_TIERS: Tier[] = [
  { label: 'Under 10K', min: 0, expected: 2.5 },
  { label: '10K–100K', min: 10_000, expected: 3.2 },
  { label: '100K–1M', min: 100_000, expected: 2.0 },
  { label: '1M–10M', min: 1_000_000, expected: 1.4 },
  { label: '10M+', min: 10_000_000, expected: 1.0 },
];

export function tierFor(followers: number): Tier {
  let t = ENGAGEMENT_TIERS[0];
  for (const tier of ENGAGEMENT_TIERS) if (followers > tier.min) t = tier;
  return t;
}

/** The engine flags engagement below 25% or above 350% of the tier baseline. */
export function engagementBands(expected: number) {
  return [
    { key: 'thin', label: 'Far below baseline', from: 0, to: expected * 0.25, tone: 'ghost' as const },
    { key: 'low', label: 'Below baseline', from: expected * 0.25, to: expected * 0.75, tone: 'neutral' as const },
    { key: 'healthy', label: 'Healthy for this tier', from: expected * 0.75, to: expected * 2, tone: 'developed' as const },
    { key: 'high', label: 'High', from: expected * 2, to: expected * 3.5, tone: 'neutral' as const },
    { key: 'spike', label: 'Unnaturally high', from: expected * 3.5, to: expected * 5, tone: 'ghost' as const },
  ];
}
