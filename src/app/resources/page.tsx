'use client';

import { useState } from 'react';
import { BookOpen, TrendingUp, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ResourcesPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const articles = [
    {
      title: "How to Spot Fake Followers in 2026",
      summary: "A comprehensive guide to identifying bot accounts and inflated followings on major social platforms.",
      icon: <BookOpen className="w-8 h-8 text-emerald-500" />,
      content: "As social media platforms evolve, so do the tactics of fake accounts. In 2026, spotting a fake follower requires more than just checking for a profile picture. Look for highly generic comments, follower-to-following ratios that lean heavily towards following, and sudden spikes in follower count without corresponding viral content. AI-generated avatars are common, often identifiable by inconsistencies in lighting and background. Remember, an authentic audience engages meaningfully with content."
    },
    {
      title: "What is a Good Engagement Rate?",
      summary: "Understanding the metrics that matter and how they vary by platform and audience size.",
      icon: <TrendingUp className="w-8 h-8 text-emerald-500" />,
      content: "Engagement rate is the true currency of social media. While a 'good' rate depends on the platform and niche, generally, a rate between 1% to 5% is considered healthy for larger accounts, while micro-influencers often see rates of 5% to 10% or higher. Video content, particularly short-form like Reels and TikToks, tends to drive higher engagement. When evaluating an account, don't just look at likes; comments, saves, and shares indicate deeper audience investment."
    },
    {
      title: "Romance Scam Red Flags: Complete Guide",
      summary: "Protect yourself online by recognizing the common signs of romance scams and fake profiles.",
      icon: <ShieldAlert className="w-8 h-8 text-emerald-500" />,
      content: "Romance scams often begin with unexpected messages from seemingly perfect individuals. Key red flags include rapid declarations of love, requests to move conversations off the initial platform quickly, and eventual pleas for money (often citing emergencies, travel expenses, or investment opportunities). Always reverse image search profile pictures, be wary of individuals who refuse video calls, and never send money to someone you haven't met in person."
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Educational Resources</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">Insights and guides to help you navigate digital authenticity.</p>
        </div>
        
        <div className="space-y-6">
          {articles.map((article, index) => (
            <article 
              key={index} 
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <div 
                className="p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl shrink-0">
                    {article.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{article.title}</h2>
                    <p className="text-slate-600 dark:text-slate-400">{article.summary}</p>
                  </div>
                  <div className="shrink-0 text-slate-400">
                    {expandedIndex === index ? (
                      <ChevronUp className="w-6 h-6" />
                    ) : (
                      <ChevronDown className="w-6 h-6" />
                    )}
                  </div>
                </div>
              </div>
              
              {expandedIndex === index && (
                <div className="p-6 pt-0 text-slate-700 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800">
                  <div className="mt-4 prose dark:prose-invert max-w-none">
                    <p>{article.content}</p>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
