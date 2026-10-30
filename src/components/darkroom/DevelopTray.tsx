'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Reading } from './Reading';
import { createDevelopEngine, motionTokens, type DevelopEngine } from './develop-engine';

/**
 * The signature moment: a developer tray holding a print.
 *
 * The treated still underneath is the LCP image, the no-JS result and the
 * fallback when neither WebGL nor Canvas can read the photo. The first time
 * the tray comes on screen the print develops from blank paper: the liquid
 * moves while it is wet, the readings tick like a darkroom timer, and once
 * the print is fixed everything stops. `hold` keeps a faint latent image
 * in the tray (liquid moving) while a request is in flight.
 *
 * Reduced motion: the fixed print is drawn at once, readings show their
 * final values, nothing loops.
 */
export interface DevelopTrayProps {
  handle: string;
  followersLabel: string;
  realPct: number;
  fakePct: number;
  avatar?: string;
  alt: string;
  frame?: string;
  priority?: boolean;
  seed?: string;
  caption?: React.ReactNode;
  verdict?: React.ReactNode;
  hold?: boolean;
  children?: React.ReactNode;
}

type TrayState = 'idle' | 'developing' | 'holding' | 'fixed';

const HOLD_AT = 0.16;

export function DevelopTray({
  handle,
  followersLabel,
  realPct,
  fakePct,
  avatar,
  alt,
  frame = '14A',
  priority = false,
  seed,
  caption,
  verdict,
  hold = false,
  children,
}: DevelopTrayProps) {
  const remote = !!avatar && /^https?:\/\//.test(avatar);
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stillRef = useRef<HTMLImageElement>(null);
  const holdRef = useRef(hold);
  const kickRef = useRef<() => void>(() => {});
  const [state, setState] = useState<TrayState>('idle');
  const [shown, setShown] = useState<number | null>(null); // reading progress 0..1, null = final values
  const [announce, setAnnounce] = useState('');

  useEffect(() => {
    holdRef.current = hold;
    kickRef.current();
  }, [hold]);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let engine: DevelopEngine | null = null;
    let visible = false;
    let disposed = false;
    let raf = 0;
    let progress = 0; // development progress, persists across pauses
    let started = false;
    let fixed = false;
    let last = 0;
    let clock = 0; // liquid time, seconds
    let lastTick = 0;
    const { ms, ease } = motionTokens(root, '--dur-develop', '--ease-develop');
    const tick = motionTokens(root, '--dur-tick', '--ease-switch').ms || 90;
    const duration = Math.max(1, ms);

    const fix = () => {
      fixed = true;
      engine?.render(1, clock);
      setShown(null);
      setState('fixed');
      setAnnounce(`Print fixed. ${realPct}% developed, ${fakePct}% ghost.`);
      root.style.removeProperty('will-change');
    };

    const frameLoop = (now: number) => {
      raf = 0;
      if (disposed || !engine || !visible) return;
      const dt = last ? Math.min(64, now - last) : 16;
      last = now;
      clock += dt / 1000;
      const holding = holdRef.current;
      if (holding) {
        // ease towards the latent image and keep the liquid moving
        progress += (HOLD_AT - progress) * Math.min(1, dt / 220);
      } else {
        progress = Math.min(1, progress + dt / duration);
      }
      const eased = holding ? progress : ease(progress);
      engine.render(eased, clock);
      if (now - lastTick >= tick) {
        lastTick = now;
        setShown(eased);
      }
      if (!holding && progress >= 1) {
        fix();
        return;
      }
      raf = requestAnimationFrame(frameLoop);
    };

    const run = () => {
      if (!engine || !visible || raf || (fixed && !holdRef.current)) return;
      if (fixed && holdRef.current) {
        // a new request on an already fixed print: fade back to the latent image
        fixed = false;
        progress = 1;
      }
      if (!started) {
        started = true;
        setAnnounce('Developing the print.');
      }
      setState(holdRef.current ? 'holding' : 'developing');
      root.style.setProperty('will-change', 'transform');
      last = 0;
      raf = requestAnimationFrame(frameLoop);
    };
    kickRef.current = run;

    const boot = (img: HTMLImageElement | null) => {
      if (disposed) return;
      engine = createDevelopEngine({ canvas, image: img, realPct, seed: seed || handle });
      if (!engine) return;
      root.dataset.engine = 'on';
      root.dataset.engineKind = engine.kind;
      if (reduce) {
        fix();
        return;
      }
      engine.render(0, 0);
      setShown(0);
      run();
    };

    const loadSource = () => {
      const still = stillRef.current;
      if (!avatar) return boot(null);
      const img = new window.Image();
      img.decoding = 'async';
      img.onload = () => boot(img);
      if (remote) {
        // Remote avatars need CORS to be read; without it the CSS still stays.
        img.crossOrigin = 'anonymous';
        img.src = avatar;
        return;
      }
      const src = still?.currentSrc || still?.src;
      if (!src) return;
      img.src = src;
    };

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries.some((e) => e.isIntersecting);
        if (!visible) {
          if (raf) cancelAnimationFrame(raf);
          raf = 0;
          return;
        }
        if (!engine) loadSource();
        else if (fixed && !holdRef.current) engine.render(1, clock);
        else run();
      },
      { rootMargin: '0px', threshold: 0.25 },
    );
    io.observe(root);

    const ro = new ResizeObserver(() => {
      if (!engine) return;
      engine.resize();
      engine.render(fixed ? 1 : ease(progress), clock);
    });
    ro.observe(canvas);

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      engine?.destroy();
      kickRef.current = () => {};
      delete root.dataset.engine;
      root.style.removeProperty('will-change');
    };
  }, [avatar, remote, realPct, fakePct, seed, handle]);

  const real = shown == null ? realPct : Math.round(realPct * shown);
  const fake = shown == null ? fakePct : Math.round(fakePct * Math.min(1, shown * 1.15));

  return (
    <figure ref={rootRef} className="tray" data-state={state}>
      <div className="tray__bath">
        <div className={verdict ? 'tray__print tray__print--captioned' : 'tray__print'}>
          <div className="tray__emulsion">
            {avatar ? (
              <Image
                ref={stillRef}
                src={avatar}
                alt=""
                width={640}
                height={640}
                sizes="(max-width: 48rem) 86vw, 44vw"
                priority={priority}
                unoptimized={remote}
                className="tray__still"
              />
            ) : (
              <svg className="tray__still tray__still--blank" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <rect width="100" height="100" className="tray__blank-bg" />
                <ellipse cx="50" cy="40" rx="17" ry="21" className="tray__blank-fig" />
                <path d="M14 100 C 16 72, 34 64, 50 64 C 66 64, 84 72, 86 100 Z" className="tray__blank-fig" />
              </svg>
            )}
            <canvas
              ref={canvasRef}
              className="tray__grain"
              width={720}
              height={720}
              role="img"
              aria-label={`${alt}. Developed print: an estimated ${realPct}% of the audience came through as genuine, ${fakePct}% stayed as ghosts.`}
            />
          </div>
          <div className="tray__border">
            {verdict ? <span className="tray__verdict">{verdict}</span> : null}
            <span className="tray__frame label" aria-hidden="true">{frame}</span>
          </div>
        </div>
        {children}
      </div>
      <figcaption className="tray__meta">
        <span className="tray__subject">
          <span className="tray__handle">{handle}</span>
          <span className="label text-2">{followersLabel}</span>
        </span>
        <span className="tray__readings" aria-hidden={shown != null ? true : undefined}>
          <Reading value={real} label="Developed" tone="developed" size="s" />
          <Reading value={fake} label="Ghost" tone="ghost" size="s" />
        </span>
        {caption ? <span className="tray__caption">{caption}</span> : null}
      </figcaption>
      <span className="sr-only" role="status" aria-live="polite">{announce}</span>
    </figure>
  );
}
