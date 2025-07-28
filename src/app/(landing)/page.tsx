import { CTASection } from '@/features/landing/ui/CTASection/CTASection';
import { FeaturesSection } from '@/features/landing/ui/FeaturesSection/FeaturesSection';
import { Footer } from '@/features/landing/ui/Footer/Footer';
import { HeroSection } from '@/features/landing/ui/HeroSection/HeroSection';

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
