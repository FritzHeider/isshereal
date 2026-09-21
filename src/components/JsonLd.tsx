import React from 'react';

/**
 * Safely serialize JSON-LD to prevent XSS via </script> tag injection.
 * Replaces dangerous sequences that could break out of the script tag.
 */
function safeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/'/g, '\\u0027');
}

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
      dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
    />
  );
}

export function ReportPageJsonLd({ handle, score, verdict }: { handle: string; score: number; verdict: string }) {
  // Sanitize user-controlled inputs
  const safeHandle = handle.replace(/[^a-zA-Z0-9_.]/g, '').slice(0, 64);
  const safeVerdict = verdict.replace(/[<>"'&]/g, '').slice(0, 200);
  const safeScore = Math.max(0, Math.min(100, Math.round(score)));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      identifier: safeHandle,
      name: safeHandle,
      description: `Authenticity audit report for @${safeHandle}. Score: ${safeScore}/100. Verdict: ${safeVerdict}.`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
    />
  );
}
