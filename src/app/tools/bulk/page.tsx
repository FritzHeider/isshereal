'use client';

import React, { useState } from 'react';
import { FileSpreadsheet, ArrowLeft, Upload, CheckCircle2, Download } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function BulkPage() {
  const [fileUploaded, setFileUploaded] = useState(false);

  return (
    <div className="pt-28 pb-20 container-x max-w-2xl">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Home
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FileSpreadsheet size={20} />
          </div>
          <div>
            <h1 className="font-extrabold text-xl sm:text-2xl text-slate-900">
              Bulk CSV Audit
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Upload a list of creators or sellers to audit hundreds at once
            </p>
          </div>
        </div>

        {/* Upload dropzone */}
        <div
          onClick={() => setFileUploaded(true)}
          className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-emerald-50/20"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <Upload size={22} />
          </div>
          <div className="font-bold text-sm text-slate-900">
            Click to upload your profile list CSV
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Accepts handles or profile URLs (up to 500 rows)
          </div>
        </div>

        {fileUploaded && (
          <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between animate-fade-up">
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 size={16} className="text-emerald-600" />
              creators_batch_sept.csv (34 profiles parsed)
            </span>
            <Button size="sm" className="bg-emerald-600 text-white rounded-full text-xs">
              Start Batch Audit
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
