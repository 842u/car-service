'use client';

import { ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

import { GitHubIcon } from '@/components/decorative/icons/GitHubIcon';
import { GoogleIcon } from '@/components/decorative/icons/GoogleIcon';

import { Button } from '../Button/Button';

type OAuthProvidersProps = ComponentPropsWithoutRef<'section'> & {
  className?: string;
};

export function OAuthProviders({ className, ...props }: OAuthProvidersProps) {
  const gitHubButtonClickHandler = async () => {
    const { getBrowserClient } = await import('@/utils/supabase');
    const { auth } = getBrowserClient();
    const requestUrl = new URL(window.location.origin);

    requestUrl.pathname = 'api/auth/callback';

    await auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: requestUrl.href,
      },
    });
  };

  const googleButtonClickHandler = async () => {
    const { getBrowserClient } = await import('@/utils/supabase');
    const { auth } = getBrowserClient();
    const requestUrl = new URL(window.location.origin);

    requestUrl.pathname = 'api/auth/callback';

    await auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: requestUrl.href,
      },
    });
  };

  return (
    <section
      className={twMerge('flex flex-col gap-4', className)}
      {...props}
      aria-label="OAuth Providers"
    >
      <Button onClick={gitHubButtonClickHandler}>
        <GitHubIcon className="mr-2 h-full fill-light-500" />
        <span>Continue with GitHub</span>
      </Button>
      <Button onClick={googleButtonClickHandler}>
        <GoogleIcon className="mr-2 h-full fill-light-500" />
        <span>Continue with Google</span>
      </Button>
    </section>
  );
}
