
'use client';
import { useTheme } from './ThemeProvider';
import { Sun, Moon } from 'lucide-react';
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-transform hover:scale-110 active:scale-95 duration-200">
      {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-500 animate-in spin-in-180" /> : <Moon className="w-5 h-5 text-slate-700 animate-in spin-in-180" />}
    </button>
  );
}
