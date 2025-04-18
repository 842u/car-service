'use client';

import { ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

import { GitHubIcon } from '@/components/decorative/icons/GitHubIcon';
import { GoogleIcon } from '@/components/decorative/icons/GoogleIcon';
import { useToasts } from '@/hooks/useToasts';
import { signInWithOAuthHandler } from '@/utils/supabase/general';

import { Button } from '../../shared/base/Button/Button';

type OAuthProvidersSectionProps = ComponentPropsWithoutRef<'section'>;

export function OAuthProvidersSection({
  className,
  ...props
}: OAuthProvidersSectionProps) {
  const { addToast } = useToasts();

  const gitHubButtonClickHandler = async () => {
    const { error } = await signInWithOAuthHandler('github');

    error && addToast(error.message, 'error');
  };

  const googleButtonClickHandler = async () => {
    const { error } = await signInWithOAuthHandler('google');

    error && addToast(error.message, 'error');
  };

  return (
    <section
      aria-label="OAuth Providers"
      className={twMerge('flex flex-col gap-4', className)}
      {...props}
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
        <GoogleIcon className="fill-dark-500 dark:fill-light-500 stroke-dark-500 dark:stroke-light-500 h-full" />
        <span>Continue with Google</span>
      </Button>
    </section>
  );
}
