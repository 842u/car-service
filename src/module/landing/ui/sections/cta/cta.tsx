import { LandingSectionHeading } from '@/landing/ui/section/compounds/heading/heading';
import { LandingSection } from '@/landing/ui/section/section';
import { LinkButton } from '@/ui/link-button/link-button';

export function CtaSection() {
  return (
    <LandingSection className="flex h-[50vh] flex-col items-center justify-center gap-10 text-center">
      <div className="flex flex-col items-center gap-3">
        <LandingSectionHeading
          className="text-xl font-medium md:text-2xl"
          headingLevel="h2"
        >
          Keep every car, every service, and every deadline in one place.
        </LandingSectionHeading>
        <p className="text-alpha-grey-700 text-sm md:text-base">
          Start for free.
        </p>
      </div>
      <LinkButton href="/dashboard/sign-up" variant="accent">
        Sign Up
      </LinkButton>
    </LandingSection>
  );
}
