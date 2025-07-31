import { LandingFooter } from '@/landing/ui/footer/footer';
import { CtaSection } from '@/landing/ui/sections/cta/cta';
import { FeaturesSection } from '@/landing/ui/sections/features/features';
import { HeroSection } from '@/landing/ui/sections/hero/hero';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <CtaSection />
      <LandingFooter />
    </main>
  );
}
