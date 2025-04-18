import { FeaturesSection } from '@/components/sections/FeaturesSection/FeaturesSection';
import { Footer } from '@/components/ui/Footer/Footer';
import { CTASection } from '@/components/ui/sections/CTASection/CTASection';
import { HeroSection } from '@/components/ui/sections/HeroSection/HeroSection';

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
