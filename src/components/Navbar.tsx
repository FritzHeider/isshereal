'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

const NAV_LINKS = [
  { label: 'Features', href: '/#features' },
  { label: 'Tools', href: '/#tools' },
  { label: 'Sample reports', href: '/#samples' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'History', href: '/history' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setOpen(false);
    if (href.startsWith('/#')) {
      const id = href.slice(2);
      if (pathname !== '/') {
        router.push('/');
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      router.push(href);
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-xs'
          : 'bg-transparent'
      }`}
    >
      <nav className="container-x flex items-center justify-between h-16 sm:h-20">
        {/* Brand Logo with 3D FAL.AI Generated Emblem */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl overflow-hidden shadow-md shadow-emerald-600/15 border border-emerald-500/30 group-hover:scale-105 transition-all duration-300">
            <Image
              src="/images/logo.png"
              alt="isshereal.com logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 leading-none">
                isshereal<span className="text-emerald-600">.com</span>
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                v2.4
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide">
              Authenticity Intelligence
            </span>
          </div>
        </Link>

        {/* Center Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            onClick={() => router.push('/analyze')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-5 py-2.5 font-semibold text-sm shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all active:scale-[0.98]"
          >
            <span>Analyze a profile</span>
            <ArrowRight size={15} className="ml-1.5" />
          </Button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="md:hidden p-2 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          onClick={() => setOpen(!open)}
          aria-label="Toggle Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-b border-slate-200 px-6 py-5 space-y-4 shadow-xl animate-fade-up">
          <div className="flex flex-col space-y-3">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="block w-full text-left text-base font-semibold text-slate-700 hover:text-emerald-600 py-1.5 transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>
          <div className="pt-2">
            <Button
              onClick={() => {
                setOpen(false);
                router.push('/analyze');
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full py-3 text-sm font-semibold shadow-md"
            >
              Analyze a profile
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
