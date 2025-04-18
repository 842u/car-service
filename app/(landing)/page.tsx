import { Footer } from '@/components/ui/Footer/Footer';
import { CTASection } from '@/components/ui/sections/CTASection/CTASection';
import { FeaturesSection } from '@/components/ui/sections/FeaturesSection/FeaturesSection';
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
