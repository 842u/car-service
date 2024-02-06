'use client';

import { ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

import { GitHubIcon } from '@/components/decorative/icons/GitHubIcon';
import { getBrowserClient, signInWithOAuthProvider } from '@/utils/supabase';

import { Button } from '../Button/Button';

type OAuthProvidersProps = ComponentPropsWithoutRef<'section'> & {
  className?: string;
};

export function OAuthProviders({ className, ...props }: OAuthProvidersProps) {
  const { auth } = getBrowserClient();

  const gitHubButtonClickHandler = async () => {
    await signInWithOAuthProvider(auth, 'github');
  };
  return (
    <section className={twMerge('flex flex-col gap-4', className)} {...props}>
      <Button onClick={gitHubButtonClickHandler}>
        <GitHubIcon className="mr-2 h-full fill-light-500" />
        <span>Continue with GitHub</span>
      </Button>
      <Button onClick={gitHubButtonClickHandler}>
        <GitHubIcon className="mr-2 h-full fill-light-500" />
        <span>Continue with GitHub</span>
      </Button>
    </section>
  );
}
