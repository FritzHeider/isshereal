import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { ToolsSection } from '@/components/ToolsSection';
import { HowItWorks } from '@/components/HowItWorks';
import dynamic from 'next/dynamic';
import { HomePageJsonLd } from '@/components/JsonLd';

const VerifiedAuditsGrid = dynamic(() => import('@/components/VerifiedAuditsGrid').then(m => ({ default: m.VerifiedAuditsGrid })), { 
  loading: () => <div className="py-24 text-center text-slate-400">Loading verified audits...</div>
});
const SampleReports = dynamic(() => import('@/components/SampleReports').then(m => ({ default: m.SampleReports })), {
  loading: () => <div className="py-24 text-center text-slate-400">Loading sample reports...</div>
});
const FAQ = dynamic(() => import('@/components/FAQ').then(m => ({ default: m.FAQ })), {
  loading: () => <div className="py-16 text-center text-slate-400">Loading FAQ...</div>
});

export default function Home() {
  return (
    <>
      <HomePageJsonLd />
      <Hero />
      <div className="scroll-reveal">
        <VerifiedAuditsGrid />
      </div>
      <div className="scroll-reveal">
        <Features />
      </div>
      <div className="scroll-reveal content-defer">
        <ToolsSection />
      </div>
      <div className="scroll-reveal content-defer">
        <HowItWorks />
      </div>
      <div className="scroll-reveal content-defer">
        <SampleReports />
      </div>
      <div className="scroll-reveal content-defer">
        <FAQ />
      </div>
    </>
  );
}
