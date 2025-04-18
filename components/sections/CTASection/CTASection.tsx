import { LinkButton } from '@/components/ui/shared/LinkButton/LinkButton';

import { Section } from '../Section';

export function CTASection() {
  return (
    <Section className="flex h-[50vh] flex-col items-center justify-center gap-10 text-center">
      <h2 className="text-xl font-medium md:text-2xl">
        <p className="text-alpha-grey-900 md:mr-2 md:inline-block">
          Car&apos;s Story Safely Managed.
        </p>
        <p className="md:inline-block">Store, Track, Drive.</p>
      </h2>
      <LinkButton href="/dashboard/sign-up" variant="accent">
        Sign Up
      </LinkButton>
    </Section>
  );
}
