import { Footer } from '@/landing/ui/footer-tempname/footer-tempname';
import { CTASection } from '@/landing/ui/sections/cta/cta';
import { FeaturesSection } from '@/landing/ui/sections/features/features';
import { HeroSection } from '@/landing/ui/sections/hero/hero';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </main>
  );
}
