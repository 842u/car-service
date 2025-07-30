'use client';

import { Provider } from '@supabase/supabase-js';
import { JSX, useState } from 'react';

import { useToasts } from '@/features/common/hooks/use-toasts';
import { Button } from '@/ui/button/button';
import { GitHubIcon } from '@/ui/decorative/icons/github';
import { GoogleIcon } from '@/ui/decorative/icons/google';
import { Spinner } from '@/ui/decorative/spinner/spinner';
import { signInWithOAuthHandler } from '@/utils/supabase/general';

const providerMappings: {
  [K in Provider]?: { text: string; icon: JSX.Element };
} = {
  github: {
    text: 'GitHub',
    icon: (
      <GitHubIcon className="fill-dark-500 dark:fill-light-500 stroke-dark-500 dark:stroke-light-500 h-full" />
    ),
  },
  google: {
    text: 'Google',
    icon: (
      <GoogleIcon className="fill-dark-500 dark:fill-light-500 stroke-dark-500 dark:stroke-light-500 h-full" />
    ),
  },
};

type OAuthButtonProps = {
  provider: Provider;
};

export function OAuthButton({ provider }: OAuthButtonProps) {
  /**
   * As for @supabase/ssr v0.6.1 & @supabase/supabase-js v2.49.4,
   * auth.signInWithOAuth() immediately returns a successful response when there is no
   * connection error. Due to this, the loading state is removed only on error and kept until
   * redirection takes place and the component unmounts.
   */
  const [isLoading, setIsLoading] = useState(false);

  const { addToast } = useToasts();

  const handleButtonClick = async () => {
    setIsLoading(true);

    const { data, error } = await signInWithOAuthHandler(provider);

    if (error) {
      addToast(error.message, 'error');
      setIsLoading(false);
    }

    data &&
      addToast(
        `Successfully connected with ${providerMappings[provider]?.text}.`,
        'success',
      );
  };

  return (
    <Button
      className="relative flex items-center justify-center gap-2 py-1.5"
      onClick={handleButtonClick}
    >
      {providerMappings[provider]?.icon}
      <span>Continue with {providerMappings[provider]?.text}</span>
      {isLoading && (
        <Spinner className="fill-dark-500 dark:fill-light-500 stroke-dark-500 dark:stroke-light-500 absolute right-0 mx-1" />
      )}
    </Button>
  );
}
