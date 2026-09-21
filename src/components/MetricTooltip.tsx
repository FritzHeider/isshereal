
import { HelpCircle } from 'lucide-react';
export function MetricTooltip({ label }: { label: string }) {
  return (
    <div className="group relative inline-flex items-center justify-center">
      <HelpCircle className="w-4 h-4 text-slate-400 cursor-help" />
      <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-slate-900 dark:bg-slate-800 text-white text-xs rounded-lg shadow-xl z-50 text-center">
        {label}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-800"></div>
      </div>
    </div>
  );
}
