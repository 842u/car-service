import { ReactNode } from 'react';

import { ColorThemeProvider } from './ColorThemeProvider';
import { TenStackQueryProvider } from './TenStackQueryProvider';
import { ToastsProvider } from './ToastsProvider';
import { UserProfileProvider } from './UserProfileProvider';

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <UserProfileProvider>
      <ToastsProvider>
        <ColorThemeProvider>
          <TenStackQueryProvider>{children}</TenStackQueryProvider>
        </ColorThemeProvider>
      </ToastsProvider>
    </UserProfileProvider>
  );
}
