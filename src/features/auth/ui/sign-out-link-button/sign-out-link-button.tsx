import { Route } from 'next';
import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

import { SignOutIcon } from '@/ui/decorative/icons/sign-out';
import { buttonVariants } from '@/utils/tailwindcss/button';

type SignOutLinkButtonProps = ComponentProps<'a'>;

export function SignOutLinkButton({
  className,
  ...props
}: SignOutLinkButtonProps) {
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
