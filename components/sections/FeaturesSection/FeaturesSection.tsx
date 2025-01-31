import { BrandLogoFull } from '@/components/decorative/icons/BrandLogoFull';
import { Card } from '@/components/ui/Card/Card';
import { CardBackgroundImage } from '@/components/ui/Card/CardBackgroundImage';
import { CardDescription } from '@/components/ui/Card/CardDescription';
import { CardHeading } from '@/components/ui/Card/CardHeading';
import { CardImage } from '@/components/ui/Card/CardImage';

import { Section } from '../Section';

export function FeaturesSection() {
  return (
    <Section
      aria-label="platform features"
      className="mb-7 flex flex-col items-center justify-center gap-4 md:flex-row md:flex-wrap"
    >
      <div className="@container h-96 w-full md:w-1/3 md:grow">
        <Card className="relative flex h-full flex-col items-center justify-start gap-2 overflow-hidden text-center @sm:items-start @sm:text-left">
          <CardImage className="w-16 p-1.5">
            <BrandLogoFull className="stroke-accent-500 stroke-6" />
          </CardImage>
          <CardHeading headingLevel="h2">Title</CardHeading>
          <CardDescription className="@sm:w-3/4">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Dignissimos temporibus officia nostrum at, sed unde!
          </CardDescription>
          <CardBackgroundImage className="h-[130%] w-[130%] rotate-12 @sm:top-16 @sm:right-10 @sm:h-3/4 @sm:w-auto @sm:-rotate-12">
            <BrandLogoFull className="stroke-alpha-grey-300 w-full" />
          </CardBackgroundImage>
        </Card>
      </div>

      <div className="@container h-96 w-full md:w-1/3 md:grow lg:w-1/4 lg:grow-0">
        <Card className="relative flex h-full flex-col items-center justify-start gap-2 overflow-hidden text-center @sm:items-start @sm:text-left">
          <CardImage className="w-16 p-1.5">
            <BrandLogoFull className="stroke-accent-500 stroke-6" />
          </CardImage>
          <CardHeading headingLevel="h2">Title</CardHeading>
          <CardDescription className="@sm:w-3/4">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Dignissimos temporibus officia nostrum at, sed unde!
          </CardDescription>
          <CardBackgroundImage className="h-[130%] w-[130%] rotate-12 @sm:top-16 @sm:right-10 @sm:h-3/4 @sm:w-auto @sm:-rotate-12">
            <BrandLogoFull className="stroke-alpha-grey-300 w-full" />
          </CardBackgroundImage>
        </Card>
      </div>

      <div className="@container h-96 w-full md:w-1/3 md:grow lg:w-1/4 lg:grow-0">
        <Card className="relative flex h-full flex-col items-center justify-start gap-2 overflow-hidden text-center @sm:items-start @sm:text-left">
          <CardImage className="w-16 p-1.5">
            <BrandLogoFull className="stroke-accent-500 stroke-6" />
          </CardImage>
          <CardHeading headingLevel="h2">Title</CardHeading>
          <CardDescription className="@sm:w-3/4">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Dignissimos temporibus officia nostrum at, sed unde!
          </CardDescription>
          <CardBackgroundImage className="h-[130%] w-[130%] rotate-12 @sm:top-16 @sm:right-10 @sm:h-3/4 @sm:w-auto @sm:-rotate-12">
            <BrandLogoFull className="stroke-alpha-grey-300 w-full" />
          </CardBackgroundImage>
        </Card>
      </div>
    </Section>
  );
}
