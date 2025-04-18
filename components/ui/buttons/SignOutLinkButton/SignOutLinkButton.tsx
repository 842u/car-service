import { Route } from 'next';
import { twMerge } from 'tailwind-merge';

import { SignOutIcon } from '@/components/decorative/icons/SignOutIcon';
import { buttonVariants } from '@/utils/tailwindcss/button';

export function SignOutLinkButton() {
  return (
    <a
      className={twMerge(
        'flex h-10 w-full items-center justify-start p-1',
        buttonVariants.transparent,
      )}
      href={'/api/auth/sign-out' satisfies Route}
      title="sign out"
    >
      <SignOutIcon className="stroke-dark-500 dark:stroke-light-500 h-full w-full stroke-2" />
      <span className="sr-only">Sign Out</span>
    </a>
  );
}
