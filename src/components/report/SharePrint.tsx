'use client';

import React, { useState } from 'react';
import { Glyph } from '@/components/darkroom/Glyph';
import { toast } from '@/components/Toast';

/**
 * Share actions for a report. "Save the print" draws the print card the
 * same way the OG image does: dark room, white-bordered print, readings,
 * and the grease-pencil verdict.
 */
export function SharePrint({
  handle,
  name,
  platform,
  realPct,
  fakePct,
  verdict,
}: {
  handle: string;
  name: string;
  platform: string;
  realPct: number;
  fakePct: number;
  verdict: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast('Link copied. Anyone with it sees the same print.', 'success');
      setTimeout(() => setCopied(false), 2400);
    } catch {
      toast('Your browser blocked the clipboard. Copy the address bar instead.', 'error');
    }
  };

  const save = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    try {
      await document.fonts.ready;
    } catch {
      /* fonts API unavailable: system fallback is fine for a download */
    }
    const css = getComputedStyle(document.documentElement);
    const room = '#170c0a';
    const paper = '#f1e6da';
    const amber = '#f2af48';
    const cyan = '#6cc7d7';
    const safe = '#de3d34';
    const text = '#f2d8ca';
    const display = css.getPropertyValue('--font-display') || 'Impact, sans-serif';
    const mono = css.getPropertyValue('--font-mono') || 'monospace';

    ctx.fillStyle = room;
    ctx.fillRect(0, 0, 1200, 630);
    const glow = ctx.createRadialGradient(1100, 0, 0, 1100, 0, 700);
    glow.addColorStop(0, 'rgba(222,61,52,0.45)');
    glow.addColorStop(1, 'rgba(222,61,52,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 1200, 630);

    // The print: a grain field split by the real share of the audience
    ctx.save();
    ctx.translate(90, 70);
    ctx.rotate(-0.02);
    ctx.fillStyle = paper;
    ctx.fillRect(0, 0, 440, 490);
    const cols = 24;
    const cell = 400 / cols;
    let seed = handle.split('').reduce((a, c) => a + c.charCodeAt(0), 7);
    const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
    for (let y = 0; y < cols; y++) {
      for (let x = 0; x < cols; x++) {
        const real = rnd() * 100 < realPct;
        ctx.fillStyle = real ? `rgba(40,24,20,${0.55 + rnd() * 0.45})` : 'rgba(108,199,215,0.18)';
        ctx.fillRect(20 + x * cell, 20 + y * cell, cell - 1.5, cell - 1.5);
      }
    }
    ctx.fillStyle = '#8a5a1e';
    ctx.font = `700 34px ${display}`;
    ctx.fillText(verdict.toUpperCase(), 22, 466);
    ctx.restore();

    ctx.fillStyle = safe;
    ctx.font = `500 22px ${mono}`;
    ctx.fillText(`ISSHEREAL 5063  ▸  ${platform.toUpperCase()}`, 600, 110);
    ctx.fillStyle = text;
    ctx.font = `900 76px ${display}`;
    ctx.fillText(handle.toUpperCase().slice(0, 18), 600, 190);
    ctx.font = `400 30px ${mono}`;
    ctx.fillText(name.slice(0, 32), 600, 236);

    ctx.font = `300 150px ${display}`;
    ctx.fillStyle = amber;
    ctx.fillText(`${realPct}%`, 600, 420);
    ctx.fillStyle = cyan;
    ctx.fillText(`${fakePct}%`, 880, 420);
    ctx.font = `500 22px ${mono}`;
    ctx.fillStyle = amber;
    ctx.fillText('DEVELOPED', 604, 460);
    ctx.fillStyle = cyan;
    ctx.fillText('GHOST', 884, 460);
    ctx.fillStyle = text;
    ctx.font = `500 22px ${mono}`;
    ctx.fillText('isshereal.com', 600, 560);

    const a = document.createElement('a');
    a.download = `${handle.replace('@', '')}-print.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
    toast('Print saved as an image.', 'success');
  };

  return (
    <div className="share">
      <button type="button" className="btn btn--line btn--compact" onClick={copy}>
        <Glyph name={copied ? 'check' : 'copy'} size={16} />
        {copied ? 'Link copied' : 'Copy link'}
      </button>
      <button type="button" className="btn btn--line btn--compact" onClick={save}>
        <Glyph name="export" size={16} />
        Save the print
      </button>
    </div>
  );
}
