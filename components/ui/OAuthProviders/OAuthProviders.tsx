'use client';

import { ComponentPropsWithoutRef, useContext } from 'react';
import { twMerge } from 'tailwind-merge';

import { GitHubIcon } from '@/components/decorative/icons/GitHubIcon';
import { GoogleIcon } from '@/components/decorative/icons/GoogleIcon';
import { ToastsContext } from '@/context/ToastsContext';

import { Button } from '../Button/Button';

type OAuthProvidersProps = ComponentPropsWithoutRef<'section'> & {
  className?: string;
};

export function OAuthProviders({ className, ...props }: OAuthProvidersProps) {
  const { addToast } = useContext(ToastsContext);

  const gitHubButtonClickHandler = async () => {
    const { signInWithOAuthHandler } = await import('@/utils/general');
    const { error } = await signInWithOAuthHandler('github');

    error && addToast(error.message, 'error');
  };

  const googleButtonClickHandler = async () => {
    const { signInWithOAuthHandler } = await import('@/utils/general');
    const { error } = await signInWithOAuthHandler('google');

    error && addToast(error.message, 'error');
  };

  return (
    <section
      className={twMerge('flex flex-col gap-4', className)}
      {...props}
      aria-label="OAuth Providers"
    >
      <Button onClick={gitHubButtonClickHandler}>
        <GitHubIcon className="fill-light-500 mr-2 h-full" />
        <span>Continue with GitHub</span>
      </Button>
      <Button onClick={googleButtonClickHandler}>
        <GoogleIcon className="fill-light-500 mr-2 h-full" />
        <span>Continue with Google</span>
      </Button>
    </section>
  );
}
