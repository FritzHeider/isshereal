'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ScoreGauge } from '@/components/ScoreGauge';
import { Button } from '@/components/ui/button';
import { Clock, Trash2, ArrowRight, Search, User } from 'lucide-react';

interface AuditHistory {
  id: string;
  handle: string;
  platform: string;
  score: number;
  name?: string;
  avatarUrl?: string;
  timestamp: number;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<AuditHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const items: AuditHistory[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('audit_')) {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          if (data && data.handle) {
            items.push(data);
          }
        }
      }
      items.sort((a, b) => b.timestamp - a.timestamp);
      setHistory(items);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all audit history?')) {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('audit_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      setHistory([]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Audit History</h1>
          <p className="text-slate-600 dark:text-slate-400">Recently analyzed profiles</p>
        </div>
        
        {history.length > 0 && (
          <Button 
            variant="outline" 
            onClick={clearHistory}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-900/30"
          >
            <Trash2 className="w-4 h-4" />
            Clear History
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No audits yet</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Start by analyzing a profile to see your history here.</p>
          <Link href="/">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
              New Audit
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item) => (
            <Link href={`/report/${item.id || encodeURIComponent(item.handle)}?platform=${item.platform}`} key={item.id || item.handle}>
              <div className="group bg-white dark:bg-slate-900 rounded-3xl shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-800 p-6 transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                      {item.avatarUrl ? (
                        <img src={item.avatarUrl} alt={item.handle} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white truncate max-w-[120px]">
                        {item.name || `@${item.handle}`}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">@{item.handle}</p>
                    </div>
                  </div>
                  <div className="w-12 h-12">
                    <ScoreGauge score={item.score} size={48} showLabel={false} />
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 capitalize">
                    <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                    {item.platform}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {new Date(item.timestamp).toLocaleDateString(undefined, { 
                        month: 'short', day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
