import { BrandLogoFull } from '@/components/decorative/BrandLogoFull';
import { Card } from '@/components/ui/Card/Card';

import { Section } from '../Section';

export function FeaturesSection() {
  return (
    <Section
      aria-labelledby="platform features"
      className="mb-7 flex flex-col items-center justify-center gap-4 md:flex-row md:flex-wrap"
    >
      <Card className="relative flex h-96 flex-col items-center justify-start gap-2 overflow-hidden text-center md:w-1/3 md:flex-grow">
        <div className="w-16 rounded-2xl bg-accent-100 p-1.5 dark:bg-accent-900">
          <BrandLogoFull className="stroke-accent-900 stroke-[6] dark:stroke-accent-100" />
        </div>
        <h2 className="text-xl">Heading</h2>
        <p className="text-sm">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore
          magni, facere ea temporibus in nostrum?
        </p>
        <div className="absolute -z-10 flex h-[120%] w-[120%] rotate-12">
          <BrandLogoFull className="stroke-alpha-grey-200" />
        </div>
      </Card>
      <Card className="relative flex h-96 flex-col items-center justify-start gap-2 overflow-hidden text-center md:w-1/3 md:flex-grow lg:w-1/4 lg:flex-grow-0">
        <div className="w-16 rounded-2xl bg-accent-100 p-1.5 dark:bg-accent-900">
          <BrandLogoFull className="stroke-accent-900 stroke-[6] dark:stroke-accent-100" />
        </div>
        <h2 className="text-xl">Heading</h2>
        <p className="text-sm">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore
          magni, facere ea temporibus in nostrum?
        </p>
        <div className="absolute -z-10 flex h-[120%] w-[120%] rotate-12">
          <BrandLogoFull className="stroke-alpha-grey-200" />
        </div>
      </Card>
      <Card className="relative flex h-96 flex-col items-center justify-start gap-2 overflow-hidden text-center md:w-1/3 md:flex-grow lg:w-1/4 lg:flex-grow-0">
        <div className="w-16 rounded-2xl bg-accent-100 p-1.5 dark:bg-accent-900">
          <BrandLogoFull className="stroke-accent-900 stroke-[6] dark:stroke-accent-100" />
        </div>
        <h2 className="text-xl">Heading</h2>
        <p className="text-sm">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore
          magni, facere ea temporibus in nostrum?
        </p>
        <div className="absolute -z-10 flex h-[120%] w-[120%] rotate-12">
          <BrandLogoFull className="stroke-alpha-grey-200" />
        </div>
      </Card>
    </Section>
  );
}
