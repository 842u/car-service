import { BrandLogoFull } from '@/components/decorative/BrandLogoFull';
import { HeroSection } from '@/components/sections/HeroSection/HeroSection';
import { Section } from '@/components/sections/Section';
import { Card } from '@/components/ui/Card/Card';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <Section className="flex flex-col gap-4">
        <Card className="flex h-96 max-w-sm flex-col items-center justify-start gap-2 text-center">
          <div className="w-16 rounded-2xl bg-accent-100 p-1.5 dark:bg-accent-900">
            <BrandLogoFull className="stroke-accent-900 stroke-[6] dark:stroke-accent-100" />
          </div>
          <h2 className="text-xl">Heading</h2>
          <p className="text-sm">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore
            magni, facere ea temporibus in nostrum?
          </p>
        </Card>
        <Card className="flex h-96 max-w-sm flex-col items-center justify-start gap-2 text-center">
          <div className="w-16 rounded-2xl bg-accent-100 p-1.5 dark:bg-accent-900">
            <BrandLogoFull className="stroke-accent-900 stroke-[6] dark:stroke-accent-100" />
          </div>
          <h2 className="text-xl">Heading</h2>
          <p className="text-sm">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore
            magni, facere ea temporibus in nostrum?
          </p>
        </Card>
        <Card className="flex h-96 max-w-sm flex-col items-center justify-start gap-2 text-center">
          <div className="w-16 rounded-2xl bg-accent-100 p-1.5 dark:bg-accent-900">
            <BrandLogoFull className="stroke-accent-900 stroke-[6] dark:stroke-accent-100" />
          </div>
          <h2 className="text-xl">Heading</h2>
          <p className="text-sm">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore
            magni, facere ea temporibus in nostrum?
          </p>
        </Card>
      </Section>
    </main>
  );
}
