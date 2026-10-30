'use client';

import { useTheme } from './ThemeProvider';

/** The darkroom light switch. Pressed means the lights are on. */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const lightsOn = theme === 'light';
  return (
    <button
      type="button"
      className={['switch', className].filter(Boolean).join(' ')}
      aria-pressed={lightsOn}
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setTheme(lightsOn ? 'dark' : 'light', { x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
    >
      <span className="switch__lamp" aria-hidden="true" />
      <span className="switch__text">{lightsOn ? 'Lights off' : 'Lights on'}</span>
    </button>
  );
}
