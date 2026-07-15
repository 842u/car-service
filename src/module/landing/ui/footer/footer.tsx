import Link from 'next/link';

import { GitHubIcon } from '@/icons/github';
import { MailIcon } from '@/icons/mail';
import { LandingSection } from '@/landing/ui/section/section';
import { BrandLabel } from '@/ui/brand-label/brand-label';
import { buttonVariants } from '@/ui/variants/button';

export function LandingFooter() {
  return (
    <footer className="border-alpha-grey-300 bg-light-500 dark:bg-dark-500 border-t">
      <LandingSection className="my-0 flex flex-col gap-8 py-8 md:my-0 md:flex-row md:items-start md:justify-between lg:my-0">
        <div className="flex flex-col gap-4">
          <BrandLabel className="block w-fit" />
          <p className="text-alpha-grey-900 text-sm">
            Car&apos;s Story Safely Managed.
          </p>
          <address className="flex h-10 items-center gap-2">
            <a
              aria-label="GitHub"
              className={buttonVariants.transparent}
              href="https://github.com/842u/car-service"
              rel="noreferrer"
              target="_blank"
            >
              <GitHubIcon className="stroke-dark-500 dark:stroke-light-500 h-full stroke-2 p-2" />
            </a>
            <a
              aria-label="Mail"
              className={buttonVariants.transparent}
              href="mailto:contact@842u.dev"
            >
              <MailIcon className="stroke-dark-500 dark:stroke-light-500 h-full stroke-2 p-2" />
            </a>
          </address>
        </div>

        <nav aria-label="footer navigation">
          <ul className="flex flex-col gap-1">
            <li>
              <Link
                className="text-alpha-grey-900 hover:text-dark-500 dark:hover:text-light-500 block py-1 text-sm transition-colors"
                href="/dashboard"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                className="text-alpha-grey-900 hover:text-dark-500 dark:hover:text-light-500 block py-1 text-sm transition-colors"
                href="/dashboard/sign-in"
              >
                Sign In
              </Link>
            </li>
            <li>
              <Link
                className="text-alpha-grey-900 hover:text-dark-500 dark:hover:text-light-500 block py-1 text-sm transition-colors"
                href="/dashboard/sign-up"
              >
                Sign Up
              </Link>
            </li>
          </ul>
        </nav>
      </LandingSection>
    </footer>
  );
}
