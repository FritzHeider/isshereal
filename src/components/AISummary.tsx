'use client';

import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface AISummaryProps {
  handle: string;
  score: number;
  verdict: string;
  riskSignals: string[];
  verifiedSignals?: string[];
}

export function AISummary({ handle, score, verdict, riskSignals, verifiedSignals = [] }: AISummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [supported, setSupported] = useState<boolean | null>(null);

  React.useEffect(() => {
    // Feature detect the Summarizer API
    setSupported('ai' in globalThis && 'summarizer' in (globalThis as any).ai);
  }, []);

  if (supported === false || supported === null) return null;

  const handleSummarize = async () => {
    setLoading(true);
    try {
      const ai = (globalThis as any).ai;
      const summarizer = await ai.summarizer.create({
        type: 'tl;dr',
        length: 'short',
      });

      const text = [
        `Authenticity audit report for @${handle}.`,
        `Trust score: ${score}/100. Verdict: ${verdict}.`,
        `Risk signals: ${riskSignals.join('. ')}.`,
        verifiedSignals.length > 0 ? `Verified signals: ${verifiedSignals.join('. ')}.` : '',
      ].filter(Boolean).join(' ');

      const result = await summarizer.summarize(text);
      setSummary(result);
    } catch (e) {
      setSummary('Unable to generate summary. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      {!summary ? (
        <button
          onClick={handleSummarize}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-950/50 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {loading ? 'Summarizing...' : 'AI Summary'}
        </button>
      ) : (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">AI Summary</span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{summary}</p>
        </div>
      )}
    </div>
  );
}
