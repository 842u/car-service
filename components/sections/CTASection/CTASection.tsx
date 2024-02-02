import { LinkButton } from '@/components/ui/LinkButton/LinkButton';

import { Section } from '../Section';

export function CTASection() {
  return (
    <Section className="relative flex h-[25vh] flex-col items-center justify-center text-center">
      <h2 className="my-10 text-xl font-medium md:text-2xl">
        <p className="text-alpha-grey-900 md:mr-2 md:inline-block">
          Car&apos;s Story Safely Managed.
        </p>
        <p className="md:inline-block">Store, Track, Drive.</p>
      </h2>
      <LinkButton className="text-sm" href="/dashboard/sign-up">
        Sign Up
      </LinkButton>
    </Section>
  );
}
