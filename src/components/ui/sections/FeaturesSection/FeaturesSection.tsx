import { BrandFullIcon } from '@/features/common/ui/decorative/icons/BrandFullIcon';
import { BrandSimpleIcon } from '@/features/common/ui/decorative/icons/BrandSimpleIcon';

import { FeatureCard } from '../../shared/FeatureCard/FeatureCard';
import { LandingSection } from '../../shared/LandingSection/LandingSection';

export function FeaturesSection() {
  return (
    <LandingSection
      aria-label="platform features"
      className="flex flex-col items-center justify-center gap-5 md:flex-row md:flex-wrap"
    >
      <FeatureCard className="md:w-1/3 md:grow">
        <FeatureCard.Icon>
          <BrandSimpleIcon className="stroke-accent-500" />
        </FeatureCard.Icon>
        <FeatureCard.Heading>Feature</FeatureCard.Heading>
        <FeatureCard.Description>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dignissimos
          temporibus officia nostrum at, sed unde!
        </FeatureCard.Description>
        <FeatureCard.Background>
          <BrandFullIcon className="stroke-alpha-grey-300 w-full stroke-[0.1]" />
        </FeatureCard.Background>
      </FeatureCard>

      <FeatureCard className="md:w-1/3 md:grow lg:w-1/4 lg:grow-0">
        <FeatureCard.Icon>
          <BrandSimpleIcon className="stroke-accent-500" />
        </FeatureCard.Icon>
        <FeatureCard.Heading>Feature</FeatureCard.Heading>
        <FeatureCard.Description>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dignissimos
          temporibus officia nostrum at, sed unde!
        </FeatureCard.Description>
        <FeatureCard.Background>
          <BrandFullIcon className="stroke-alpha-grey-300 w-full stroke-[0.1]" />
        </FeatureCard.Background>
      </FeatureCard>

      <FeatureCard className="md:w-1/3 md:grow lg:w-1/4 lg:grow-0">
        <FeatureCard.Icon>
          <BrandSimpleIcon className="stroke-accent-500" />
        </FeatureCard.Icon>
        <FeatureCard.Heading>Feature</FeatureCard.Heading>
        <FeatureCard.Description>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dignissimos
          temporibus officia nostrum at, sed unde!
        </FeatureCard.Description>
        <FeatureCard.Background>
          <BrandFullIcon className="stroke-alpha-grey-300 w-full stroke-[0.1]" />
        </FeatureCard.Background>
      </FeatureCard>
    </LandingSection>
  );
}
