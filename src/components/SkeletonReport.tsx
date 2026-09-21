
export function SkeletonReport() {
  return (
    <div className="animate-pulse space-y-8 max-w-4xl mx-auto p-6">
      <div className="flex items-center space-x-4"><div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-800"></div><div className="space-y-2"><div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div><div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div></div></div>
      <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full max-w-sm mx-auto"></div>
      <div className="grid grid-cols-2 gap-4"><div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl"></div><div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl"></div></div>
    </div>
  );
}
