'use client';

import { ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

import { GitHubIcon } from '@/components/decorative/icons/GitHubIcon';
import { GoogleIcon } from '@/components/decorative/icons/GoogleIcon';
import { useToasts } from '@/hooks/useToasts';

import { Button } from '../Button/Button';

type OAuthProvidersProps = ComponentPropsWithoutRef<'section'> & {
  className?: string;
};

export function OAuthProviders({ className, ...props }: OAuthProvidersProps) {
  const { addToast } = useToasts();

  const gitHubButtonClickHandler = async () => {
    const { signInWithOAuthHandler } = await import('@/utils/supabase/general');
    const { error } = await signInWithOAuthHandler('github');

    error && addToast(error.message, 'error');
  };

  const googleButtonClickHandler = async () => {
    const { signInWithOAuthHandler } = await import('@/utils/supabase/general');
    const { error } = await signInWithOAuthHandler('google');

    error && addToast(error.message, 'error');
  };

  return (
    <section
      className={twMerge('flex flex-col gap-4', className)}
      {...props}
      aria-label="OAuth Providers"
    >
      <Button
        className="flex items-center justify-center gap-2 py-1.5"
        onClick={gitHubButtonClickHandler}
      >
        <GitHubIcon className="fill-dark-500 dark:fill-light-500 stroke-dark-500 dark:stroke-light-500 h-full" />
        <span>Continue with GitHub</span>
      </Button>
      <Button
        className="flex items-center justify-center gap-2 py-1.5"
        onClick={googleButtonClickHandler}
      >
        <GoogleIcon className="fill-dark-500 dark:fill-light-500 h-full" />
        <span>Continue with Google</span>
      </Button>
    </section>
  );
}
