import type { Provider } from '@supabase/supabase-js';
import type { Route } from 'next';
import type { JSX } from 'react';
import { useState } from 'react';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { browserAuthClient } from '@/dependency/auth-client/browser';
import { GitHubIcon } from '@/icons/github';
import { GoogleIcon } from '@/icons/google';

export const providerMappings: {
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

export function useOAuth(provider: Provider) {
  /**
   * As for @supabase/ssr v0.6.1 & @supabase/supabase-js v2.49.4, auth.signInWithOAuth() immediately returns a successful response when there is no connection error.
   *  Due to this, the loading state is removed only on error and kept until redirection takes place and the component unmounts.
   */
  const [isLoading, setIsLoading] = useState(false);

  const { addToast } = useToasts();

  const handleSignIn = async () => {
    setIsLoading(true);

    const redirectUrl = new URL(window.location.origin);
    redirectUrl.pathname = '/api/auth/o-auth' satisfies Route;

    const signInResult = await browserAuthClient.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectUrl.toString(),
      },
    });

    if (!signInResult.success) {
      const { message } = signInResult.error;
      addToast(message, 'error');
      setIsLoading(false);
      return;
    }

    addToast(
      `Successfully connected with ${providerMappings[provider]?.text}.`,
      'success',
    );
  };

  return { isLoading, handleSignIn };
}
