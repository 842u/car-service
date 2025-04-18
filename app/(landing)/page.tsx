import { FeaturesSection } from '@/components/sections/FeaturesSection/FeaturesSection';
import { HeroSection } from '@/components/sections/HeroSection/HeroSection';
import { Footer } from '@/components/ui/Footer/Footer';
import { CTASection } from '@/components/ui/sections/CTASection/CTASection';

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
