import { ReactNode } from 'react';

import { ColorThemeProvider } from './ColorThemeProvider';
import { TenStackQueryProvider } from './TenStackQueryProvider';
import { ToastsProvider } from './ToastsProvider';

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <ToastsProvider>
      <ColorThemeProvider>
        <TenStackQueryProvider>{children}</TenStackQueryProvider>
      </ColorThemeProvider>
    </ToastsProvider>
  );
}
