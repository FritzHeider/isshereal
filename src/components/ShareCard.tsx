'use client';
import React, { useRef } from 'react';
import { Download, Link as LinkIcon, Twitter } from 'lucide-react';

interface ShareCardProps {
  profileName: string;
  handle: string;
  score: number;
  verdict: string;
  platform: string;
}

export function ShareCard({ profileName, handle, score, verdict, platform }: ShareCardProps = { profileName: 'Alex', handle: '@alex', score: 85, verdict: 'Authentic', platform: 'Instagram' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 1200, 630);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(0, 0, 1200, 16);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 80px sans-serif';
    ctx.fillText(profileName, 100, 150);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '40px sans-serif';
    ctx.fillText(handle + ' • ' + platform, 100, 220);
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 180px sans-serif';
    ctx.fillText(score.toString(), 100, 420);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 60px sans-serif';
    ctx.fillText(verdict, 100, 520);
    ctx.fillStyle = '#475569';
    ctx.font = '30px sans-serif';
    ctx.fillText('isshereal.com', 950, 580);

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${handle.replace('@', '')}-report.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center space-y-4">
      <h3 className="font-semibold text-lg dark:text-white">Share Your Report</h3>
      <canvas ref={canvasRef} width={1200} height={630} className="hidden" />
      <button
        onClick={handleDownload}
        className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-medium"
      >
        <Download className="w-4 h-4" />
        Download Image
      </button>
      <div className="flex justify-center gap-6 pt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
        <button className="flex items-center gap-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition">
          <LinkIcon className="w-4 h-4" />
          Copy Link
        </button>
        <button className="flex items-center gap-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition">
          <Twitter className="w-4 h-4" />
          Share
        </button>
      </div>
    </div>
  );
}
