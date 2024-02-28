import { ReactNode } from 'react';

import { ColorThemeProvider } from './ColorThemeProvider';
import { ToastsProvider } from './ToastsProvider';

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <ToastsProvider>
      <ColorThemeProvider>{children}</ColorThemeProvider>
    </ToastsProvider>
  );
}
