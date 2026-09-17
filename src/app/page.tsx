import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { VerifiedAuditsGrid } from '@/components/VerifiedAuditsGrid';
import { ToolsSection } from '@/components/ToolsSection';
import { HowItWorks } from '@/components/HowItWorks';
import { SampleReports } from '@/components/SampleReports';
import { FAQ } from '@/components/FAQ';

export default function Home() {
  return (
    <>
      <Hero />
      <VerifiedAuditsGrid />
      <Features />
      <ToolsSection />
      <HowItWorks />
      <SampleReports />
      <FAQ />
    </>
  );
}
