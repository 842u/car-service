import type { Route } from 'next';
import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

import { SignOutIcon } from '@/icons/sign-out';
import { buttonVariants } from '@/utils/tailwindcss/button';

type SignOutButtonProps = ComponentProps<'a'>;

export function SignOutButton({ className, ...props }: SignOutButtonProps) {
  return (
    <a
      className={twMerge(
        'flex h-10 w-full items-center justify-start p-1',
        buttonVariants.transparent,
        className,
      )}
      href={'/api/auth/sign-out' satisfies Route}
      title="sign out"
      {...props}
    >
      <SignOutIcon className="stroke-dark-500 dark:stroke-light-500 h-full w-full stroke-2" />
      <span className="sr-only">Sign Out</span>
    </a>
  );
}
