import { ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FraudFlagsProps {
  riskSignals: string[];
  score: number;
}

export function FraudFlags({ riskSignals, score }: FraudFlagsProps) {
  const getSeverity = () => {
    if (score < 30) return 'critical';
    if (score < 60) return 'warning';
    return 'minor';
  };

  const severity = getSeverity();

  const getIcon = () => {
    if (severity === 'critical') return <ShieldAlert className="w-5 h-5 text-red-500" />;
    if (severity === 'warning') return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
  };

  const getLabel = () => {
    if (severity === 'critical') return 'Critical Risk';
    if (severity === 'warning') return 'Warning';
    return 'Minor Risk';
  };

  if (!riskSignals || riskSignals.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          Fraud Flags Identified
        </h3>
      </div>
      
      <div className="p-6">
        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
          {riskSignals.map((signal, index) => (
            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                {getIcon()}
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className={cn(
                    "text-xs font-semibold uppercase tracking-wider",
                    severity === 'critical' ? "text-red-500" : severity === 'warning' ? "text-amber-500" : "text-emerald-500"
                  )}>
                    {getLabel()}
                  </span>
                </div>
                <div className="text-slate-700 dark:text-slate-300 text-sm mt-1">
                  {signal}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
