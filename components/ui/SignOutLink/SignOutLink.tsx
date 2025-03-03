import { Route } from 'next';

import { SignOutIcon } from '@/components/decorative/icons/SignOutIcon';

export function SignOutLink() {
  return (
    <a
      className="flex items-center justify-start"
      href={'/api/auth/sign-out' satisfies Route}
    >
      <div className="mx-2 aspect-square h-8 md:shrink-0 md:transition-colors">
        <SignOutIcon className="stroke-dark-500 dark:stroke-light-500 h-full w-full stroke-10" />
      </div>
      <span className="whitespace-nowrap md:translate-x-0 md:opacity-0 md:transition-all md:@[64px]:translate-x-1 md:@[64px]:opacity-100">
        Sign Out
      </span>
    </a>
  );
}
