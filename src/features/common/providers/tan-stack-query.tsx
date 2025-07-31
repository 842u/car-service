'use client';

import type { QueryClientConfig } from '@tanstack/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { ReactNode } from 'react';
import { useState } from 'react';

const queryClientOptions: QueryClientConfig | undefined =
  process.env.NODE_ENV === 'test' || process.env.CI
    ? {
        defaultOptions: { queries: { gcTime: Infinity, retry: false } },
      }
    : undefined;

type TanStackQueryProviderProps = {
  children: ReactNode;
};

export function TanStackQueryProvider({
  children,
}: TanStackQueryProviderProps) {
  const [queryClient] = useState(() => new QueryClient(queryClientOptions));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools
        initialIsOpen={false}
        styleNonce={'reactQueryDevtools'}
      />
    </QueryClientProvider>
  );
}
