'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, useState } from 'react';

type TanStackQueryProviderProps = {
  children: ReactNode;
};

export function TanStackQueryProvider({
  children,
}: TanStackQueryProviderProps) {
  const [queryClient] = useState(() => new QueryClient());

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
