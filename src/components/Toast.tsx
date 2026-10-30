'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from 'motion/react';
import { Glyph, type GlyphName } from './darkroom/Glyph';
import { DUR, EASE } from '@/lib/motion-tokens';

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

const GLYPH: Record<ToastType, GlyphName> = {
  success: 'developed',
  error: 'fogged',
  info: 'timer',
};

let toastCounter = 0;
let globalAddToast: ((message: string, type?: ToastType) => void) | null = null;

export function toast(message: string, type: ToastType = 'success') {
  globalAddToast?.(message, type);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = ++toastCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  useEffect(() => {
    globalAddToast = addToast;
    return () => {
      globalAddToast = null;
    };
  }, [addToast]);

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="toasts" role="status" aria-live="polite">
      <MotionConfig reducedMotion="user">
        <LazyMotion features={domAnimation} strict>
          <AnimatePresence initial={false}>
            {toasts.map((t) => (
              <m.div
                key={t.id}
                layout="position"
                className={`toast toast--${t.type}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0, transition: { duration: DUR.enter, ease: EASE.enter } }}
                exit={{ opacity: 0, x: 24, transition: { duration: DUR.base, ease: EASE.exit } }}
              >
                <Glyph name={GLYPH[t.type]} size={16} />
                <span className="toast__msg">{t.message}</span>
                <button type="button" className="toast__close" onClick={() => dismiss(t.id)}>
                  <Glyph name="close" size={14} />
                  <span className="sr-only">Dismiss</span>
                </button>
              </m.div>
            ))}
          </AnimatePresence>
        </LazyMotion>
      </MotionConfig>
    </div>
  );
}
