import { BrandFullIcon } from '@/icons/brand-full';
import { CarsIcon } from '@/icons/cars';
import { CheckShieldIcon } from '@/icons/check-shield';
import { ClipboardIcon } from '@/icons/clipboard';
import { UsersIcon } from '@/icons/users';
import { FeatureCard } from '@/landing/ui/feature-card/feature-card';
import { LandingSection } from '@/landing/ui/section/section';

const features: {
  icon: React.ReactNode;
  backgroundIcon: React.ReactNode;
  heading: string;
  description: string;
  wide?: boolean;
}[] = [
  {
    icon: <CarsIcon className="stroke-accent-500 stroke-1.5 p-1" />,
    backgroundIcon: (
      <BrandFullIcon className="stroke-alpha-grey-300 w-full stroke-[0.1]" />
    ),
    heading: 'Your Garage, Organized',
    description:
      "Add and manage all your vehicles in one place. Remove them when you're done and keep your garage stays clean.",
    wide: true,
  },
  {
    icon: <UsersIcon className="stroke-accent-500 stroke-1 p-1" />,
    backgroundIcon: (
      <UsersIcon className="stroke-alpha-grey-300 w-full stroke-[0.1]" />
    ),
    heading: 'Share Without Losing Control',
    description:
      'Invite co-owners to manage a car together. Everyone stays in the loop, no one gets locked out.',
  },
  {
    icon: <ClipboardIcon className="stroke-accent-500 stroke-2 p-2" />,
    backgroundIcon: (
      <ClipboardIcon className="stroke-alpha-grey-300 w-full stroke-[0.1]" />
    ),
    heading: 'Log Every Service, Every Cost',
    description:
      'Record what was done, when, and how much it cost. Build a full service history you can actually trust.',
  },
  {
    icon: <CheckShieldIcon className="stroke-accent-500 stroke-2 p-2" />,
    backgroundIcon: (
      <CheckShieldIcon className="stroke-alpha-grey-300 w-full stroke-[0.1]" />
    ),
    heading: 'Never Miss a Deadline',
    description:
      'Track insurance renewals and technical inspection dates. Get ahead of expiry before it becomes a problem.',
    wide: true,
  },
];

export function FeaturesSection() {
  return (
    <LandingSection
      aria-label="platform features"
      className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-5"
    >
      {features.map((feature) => (
        <FeatureCard
          key={feature.heading}
          className={
            feature.wide ? 'lg:col-span-3' : 'lg:col-span-2 lg:mx-auto'
          }
        >
          <FeatureCard.Icon>{feature.icon}</FeatureCard.Icon>
          <FeatureCard.Heading>{feature.heading}</FeatureCard.Heading>
          <FeatureCard.Description>
            {feature.description}
          </FeatureCard.Description>
          <FeatureCard.Background>
            {feature.backgroundIcon}
          </FeatureCard.Background>
        </FeatureCard>
      ))}
    </LandingSection>
  );
}
