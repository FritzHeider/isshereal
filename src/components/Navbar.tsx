'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Glyph } from './darkroom/Glyph';
import { ThemeToggle } from './ThemeToggle';

const NAV = [
  { label: 'Equipment', href: '/#equipment', match: '/tools' },
  { label: 'Cases', href: '/#cases', match: '/use-cases' },
  { label: 'Proof wall', href: '/top-creators', match: '/top-creators' },
  { label: 'Archive', href: '/history', match: '/history' },
];

export function Wordmark() {
  return (
    <span className="wordmark">
      <span className="wordmark__lamp" aria-hidden="true" />
      <span className="wordmark__word">isshereal</span>
      <span className="wordmark__tld">.com</span>
    </span>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    sheetRef.current?.querySelector<HTMLElement>('a, button')?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const isCurrent = (match: string) => (pathname || '').startsWith(match);

  return (
    <header className="site-header">
      <div className="site-header__bar">
        <Link href="/" className="site-header__home" aria-label="isshereal.com, home">
          <Wordmark />
        </Link>

        <nav className="site-nav" aria-label="Primary">
          <ul role="list">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="site-nav__link" aria-current={isCurrent(item.match) ? 'page' : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          <ThemeToggle className="site-header__switch" />
          <Link href="/analyze" className="btn btn--safe btn--compact" aria-current={isCurrent('/analyze') ? 'page' : undefined}>
            Develop
          </Link>
          <button
            ref={buttonRef}
            type="button"
            className="site-header__menu btn btn--line btn--compact"
            aria-expanded={open}
            aria-controls="site-sheet"
            onClick={() => setOpen((o) => !o)}
          >
            <Glyph name={open ? 'close' : 'menu'} size={18} />
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          </button>
        </div>
      </div>

      <div id="site-sheet" ref={sheetRef} className="site-sheet" data-open={open} hidden={!open}>
        <nav aria-label="Primary, mobile">
          <ul role="list" className="site-sheet__list">
            <li><Link href="/analyze" className="site-sheet__link"><span className="label text-2">01</span>Develop a profile</Link></li>
            {NAV.map((item, i) => (
              <li key={item.href}>
                <Link href={item.href} className="site-sheet__link" aria-current={isCurrent(item.match) ? 'page' : undefined}>
                  <span className="label text-2">{String(i + 2).padStart(2, '0')}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ThemeToggle className="site-sheet__switch" />
      </div>
    </header>
  );
}
