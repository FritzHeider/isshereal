import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { ToolsSection } from '@/components/ToolsSection';
import { HowItWorks } from '@/components/HowItWorks';
import { SampleReports } from '@/components/SampleReports';
import { Pricing } from '@/components/Pricing';
import { FAQ } from '@/components/FAQ';

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <ToolsSection />
      <HowItWorks />
      <SampleReports />
      <Pricing />
      <FAQ />
    </>
  );
}
