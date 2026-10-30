'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

/**
 * Darkroom theme: "dark" is the darkroom, "light" is Lights on.
 * With no stored choice the root has no data-theme attribute and the CSS
 * follows prefers-color-scheme. The inline script in the root layout applies
 * a stored choice before first paint, so this provider only mirrors it.
 */
type Theme = 'dark' | 'light';

const ThemeContext = createContext<{ theme: Theme; setTheme: (t: Theme, origin?: { x: number; y: number }) => void }>({
  theme: 'dark',
  setTheme: () => {},
});

function resolve(): Theme {
  const attr = document.documentElement.dataset.theme;
  if (attr === 'light' || attr === 'dark') return attr;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    setThemeState(resolve());
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = () => setThemeState(resolve());
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const setTheme = useCallback((t: Theme, origin?: { x: number; y: number }) => {
    const root = document.documentElement;
    const apply = () => {
      root.dataset.theme = t;
      try {
        localStorage.setItem('theme', t);
      } catch {
        /* storage blocked: the choice lasts for this page view */
      }
      setThemeState(t);
    };
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } };
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!doc.startViewTransition || reduce) {
      apply();
      return;
    }
    // The light floods out from the switch that was pressed.
    root.style.setProperty('--vt-x', origin ? `${origin.x}px` : '90%');
    root.style.setProperty('--vt-y', origin ? `${origin.y}px` : '2rem');
    root.classList.add('vt-lights');
    const vt = doc.startViewTransition(apply);
    vt.finished.finally(() => root.classList.remove('vt-lights'));
  }, []);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);

/** Runs before paint (inlined in <head>) so a stored theme never flashes. */
export const THEME_BOOT_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t;}}catch(e){}})();`;
