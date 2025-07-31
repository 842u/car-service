import type { ReactNode } from 'react';

import { ColorThemeProvider } from './color-theme';
import { TanStackQueryProvider } from './tan-stack-query';
import { ToastsProvider } from './toasts/toasts';

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <ToastsProvider>
      <ColorThemeProvider>
        <TanStackQueryProvider>{children}</TanStackQueryProvider>
      </ColorThemeProvider>
    </ToastsProvider>
  );
}
