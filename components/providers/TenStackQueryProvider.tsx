'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';

type TenStackQueryProviderProps = {
  children: ReactNode;
};

const queryClient = new QueryClient();

export function TenStackQueryProvider({
  children,
}: TenStackQueryProviderProps) {
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
