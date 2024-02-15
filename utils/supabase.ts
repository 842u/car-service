import {
  type CookieOptions,
  createBrowserClient,
  createServerClient,
} from '@supabase/ssr';
import { Provider } from '@supabase/supabase-js';
import { Route } from 'next';
import { cookies } from 'next/headers';

export function getBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export function getServerClient(cookieStore: ReturnType<typeof cookies>) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    },
  );
}

export function getActionClient(cookieStore: ReturnType<typeof cookies>) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    },
  );
}

const CALLBACK_API_ENDPOINT: Route = '/api/auth/callback';

export async function signInWithOAuthHandler(provider: Provider) {
  const { auth } = getBrowserClient();
  const requestUrl = new URL(window.location.origin);

  requestUrl.pathname = CALLBACK_API_ENDPOINT;

  const response = await auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: requestUrl.href,
    },
  });

  return response;
}
