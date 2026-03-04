'use client';

import type { Provider } from '@supabase/supabase-js';

import { Button } from '@/ui/button/button';
import { Spinner } from '@/ui/decorative/spinner/spinner';

import { providerMappings, useOAuth } from './use-o-auth';

type OAuthButtonProps = {
  provider: Provider;
};

export function OAuthButton({ provider }: OAuthButtonProps) {
  const { isLoading, handleSignIn } = useOAuth(provider);

  return (
    <Button
      className="relative flex items-center justify-center gap-2 py-1.5"
      onClick={handleSignIn}
    >
      {providerMappings[provider]?.icon}
      <span>Continue with {providerMappings[provider]?.text}</span>
      {isLoading && (
        <Spinner className="fill-dark-500 dark:fill-light-500 stroke-dark-500 dark:stroke-light-500 absolute right-0 mx-1" />
      )}
    </Button>
  );
}
