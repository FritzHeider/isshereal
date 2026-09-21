import type { MetadataRoute } from 'next';
import { VERIFIED_CREATORS } from '@/data/verified-creators';
import { SAMPLE_REPORTS } from '@/data/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://isshereal.com';
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/analyze`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/history`, lastModified: now, changeFrequency: 'daily', priority: 0.6 },
    { url: `${baseUrl}/resources`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/top-creators`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/api-docs`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/tools/compare`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ];

  // Add verified creator report pages
  const creatorPages: MetadataRoute.Sitemap = Object.keys(VERIFIED_CREATORS).map(handle => ({
    url: `${baseUrl}/report/instagram_${handle}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Add sample report pages
  const samplePages: MetadataRoute.Sitemap = SAMPLE_REPORTS.map(report => ({
    url: `${baseUrl}/report/${report.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...creatorPages, ...samplePages];
}
