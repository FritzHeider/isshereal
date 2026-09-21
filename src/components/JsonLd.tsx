import React from 'react';

export function HomePageJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'isshereal.com',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    description: 'Check for fake followers, bots, and scams on social media platforms.',
    url: 'https://isshereal.com',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ReportPageJsonLd({ handle, score, verdict }: { handle: string; score: number; verdict: string }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      identifier: handle,
      name: handle,
      description: `Authenticity audit report for @${handle}. Score: ${score}/100. Verdict: ${verdict}.`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
