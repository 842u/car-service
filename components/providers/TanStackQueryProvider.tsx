'use client';

import {
  QueryClient,
  QueryClientConfig,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, useState } from 'react';

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
