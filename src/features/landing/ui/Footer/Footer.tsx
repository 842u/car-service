import { GitHubIcon } from '@/features/common/ui/decorative/icons/GitHubIcon';
import { MailIcon } from '@/features/common/ui/decorative/icons/MailIcon';
import { LandingSection } from '@/features/landing/ui/LandingSection/LandingSection';
import { buttonVariants } from '@/utils/tailwindcss/button';

import { BrandLabel } from '../../../../features/common/ui/BrandLabel/BrandLabel';

export function Footer() {
  return (
    <footer className="from-light-500 to-light-600 before:from-alpha-grey-50 before:via-alpha-grey-300 before:to-alpha-grey-50 dark:from-dark-500 dark:to-dark-900 bg-linear-to-b before:absolute before:h-[1px] before:w-full before:bg-linear-to-l">
      <LandingSection className="my-0 py-5 md:my-0 lg:my-0">
        <BrandLabel className="mx-auto my-5 block w-fit md:h-20 md:w-fit" />

        <address className="flex h-10 items-center justify-evenly lg:justify-start lg:gap-10">
          <a
            aria-label="GitHub"
            className={buttonVariants.transparent}
            href="https://github.com/842u/car-service"
            rel="noreferrer"
            target="_blank"
          >
            <GitHubIcon className="stroke-dark-500 dark:stroke-light-500 h-full stroke-2 p-1" />
          </a>
          <a
            aria-label="Mail"
            className={buttonVariants.transparent}
            href="mailto:contact@842u.dev"
          >
            <MailIcon className="stroke-dark-500 dark:stroke-light-500 h-full stroke-2 p-1" />
          </a>
        </address>
      </LandingSection>
    </footer>
  );
}
