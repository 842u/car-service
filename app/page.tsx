import { CTASection } from '@/components/sections/CTASection/CTASection';
import { FeaturesSection } from '@/components/sections/FeaturesSection/FeaturesSection';
import { HeroSection } from '@/components/sections/HeroSection/HeroSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </main>
  );
}
