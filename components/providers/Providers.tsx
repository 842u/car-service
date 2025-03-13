import { ReactNode } from 'react';

import { ColorThemeProvider } from './ColorThemeProvider';
import { TanStackQueryProvider } from './TanStackQueryProvider';
import { ToastsProvider } from './ToastsProvider';

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
