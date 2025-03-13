import { GitHubIcon } from '@/components/decorative/icons/GitHubIcon';
import { MailIcon } from '@/components/decorative/icons/MailIcon';
import { Section } from '@/components/sections/Section';

import { BrandLabel } from '../BrandLabel/BrandLabel';

export function Footer() {
  return (
    <footer className="from-light-500 to-light-600 before:from-alpha-grey-50 before:via-alpha-grey-300 before:to-alpha-grey-50 dark:from-dark-500 dark:to-dark-900 bg-linear-to-b before:absolute before:h-[1px] before:w-full before:bg-linear-to-l">
      <Section className="my-0 py-5 md:my-0 lg:my-0">
        <BrandLabel className="mx-auto my-5 block w-20 md:h-20 md:w-fit" />

        <address className="flex h-10 items-center justify-evenly lg:justify-start lg:gap-10">
          <a
            aria-label="GitHub"
            href="https://github.com/842u/car-service"
            rel="noreferrer"
            target="_blank"
          >
            <GitHubIcon className="fill-alpha-grey-900 dark:fill-alpha-grey-500 w-8" />
          </a>
          <a aria-label="Mail" href="mailto:contact@842u.dev">
            <MailIcon className="fill-alpha-grey-900 dark:fill-alpha-grey-500 w-8" />
          </a>
        </address>
      </Section>
    </footer>
  );
}
