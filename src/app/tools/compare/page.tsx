'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScoreGauge } from '@/components/ScoreGauge';
import { ProgressBar } from '@/components/ProgressBar';
import { RiskBadge } from '@/components/RiskBadge';
import { Loader2, ArrowUpCircle, ArrowDownCircle, MinusCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ComparePage() {
  const [handleA, setHandleA] = useState('');
  const [handleB, setHandleB] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ a: any; b: any } | null>(null);
  const [error, setError] = useState('');

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleA || !handleB) {
      setError('Please enter both handles');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const [resA, resB] = await Promise.all([
        fetch(`/api/audit?handle=${encodeURIComponent(handleA)}&platform=${platform}`),
        fetch(`/api/audit?handle=${encodeURIComponent(handleB)}&platform=${platform}`),
      ]);

      if (!resA.ok || !resB.ok) {
        throw new Error('Failed to fetch audit data');
      }

      const dataA = await resA.json();
      const dataB = await resB.json();

      setResults({ a: dataA, b: dataB });
    } catch (err: any) {
      setError(err.message || 'An error occurred during comparison');
    } finally {
      setLoading(false);
    }
  };

  const getWinnerIcon = (valA: number, valB: number, higherIsBetter: boolean) => {
    if (valA === valB) return <MinusCircle className="w-5 h-5 text-slate-400" />;
    
    let isAWinner = higherIsBetter ? valA > valB : valA < valB;
    
    if (isAWinner) {
      return <ArrowUpCircle className="w-5 h-5 text-emerald-500" />;
    }
    return <ArrowDownCircle className="w-5 h-5 text-red-500" />;
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Compare Profiles
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Analyze and compare two creator profiles side-by-side to see who has better engagement and more authentic followers.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8 mb-12">
        <form onSubmit={handleCompare} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Profile A Handle</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">@</span>
              <input
                type="text"
                value={handleA}
                onChange={(e) => setHandleA(e.target.value.replace('@', ''))}
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="cristiano"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-center py-4 md:py-0 px-2 text-slate-400 font-medium">
            VS
          </div>
          
          <div className="flex-1 w-full space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Profile B Handle</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">@</span>
              <input
                type="text"
                value={handleB}
                onChange={(e) => setHandleB(e.target.value.replace('@', ''))}
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="leomessi"
              />
            </div>
          </div>

          <div className="w-full md:w-auto space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full md:w-40 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            >
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="twitter">X (Twitter)</option>
              <option value="youtube">YouTube</option>
            </select>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full md:w-auto py-3 px-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-[50px]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Compare'}
          </Button>
        </form>

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm text-center">
            {error}
          </div>
        )}
      </div>

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile A */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden mb-4">
              {results.a.avatarUrl ? (
                <img src={results.a.avatarUrl} alt={results.a.handle} className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-slate-400" />
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{results.a.name || `@${results.a.handle}`}</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">@{results.a.handle}</p>
            
            <div className="mb-8 w-full flex justify-center">
              <ScoreGauge score={results.a.score} size={180} />
            </div>

            <div className="w-full space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="text-slate-600 dark:text-slate-400">Engagement Rate</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 dark:text-white">{results.a.engagementRate}%</span>
                  {getWinnerIcon(parseFloat(results.a.engagementRate), parseFloat(results.b.engagementRate), true)}
                </div>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="text-slate-600 dark:text-slate-400">Real Followers</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 dark:text-white">{results.a.realFollowersPercentage}%</span>
                  {getWinnerIcon(parseFloat(results.a.realFollowersPercentage), parseFloat(results.b.realFollowersPercentage), true)}
                </div>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="text-slate-600 dark:text-slate-400">Bot Risk</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 dark:text-white">{100 - parseFloat(results.a.realFollowersPercentage)}%</span>
                  {getWinnerIcon(100 - parseFloat(results.a.realFollowersPercentage), 100 - parseFloat(results.b.realFollowersPercentage), false)}
                </div>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-slate-600 dark:text-slate-400">Verdict</span>
                <RiskBadge score={results.a.score} />
              </div>
            </div>
          </div>

          {/* Profile B */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden mb-4">
              {results.b.avatarUrl ? (
                <img src={results.b.avatarUrl} alt={results.b.handle} className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-slate-400" />
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{results.b.name || `@${results.b.handle}`}</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">@{results.b.handle}</p>
            
            <div className="mb-8 w-full flex justify-center">
              <ScoreGauge score={results.b.score} size={180} />
            </div>

            <div className="w-full space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="text-slate-600 dark:text-slate-400">Engagement Rate</span>
                <div className="flex items-center gap-2">
                  {getWinnerIcon(parseFloat(results.b.engagementRate), parseFloat(results.a.engagementRate), true)}
                  <span className="font-semibold text-slate-900 dark:text-white">{results.b.engagementRate}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="text-slate-600 dark:text-slate-400">Real Followers</span>
                <div className="flex items-center gap-2">
                  {getWinnerIcon(parseFloat(results.b.realFollowersPercentage), parseFloat(results.a.realFollowersPercentage), true)}
                  <span className="font-semibold text-slate-900 dark:text-white">{results.b.realFollowersPercentage}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="text-slate-600 dark:text-slate-400">Bot Risk</span>
                <div className="flex items-center gap-2">
                  {getWinnerIcon(100 - parseFloat(results.b.realFollowersPercentage), 100 - parseFloat(results.a.realFollowersPercentage), false)}
                  <span className="font-semibold text-slate-900 dark:text-white">{100 - parseFloat(results.b.realFollowersPercentage)}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center pb-2">
                <RiskBadge score={results.b.score} />
                <span className="text-slate-600 dark:text-slate-400">Verdict</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
