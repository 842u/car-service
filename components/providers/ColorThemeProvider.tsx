'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

type ColorThemeProviderProps = {
  children: ReactNode;
};

export function ColorThemeProvider({ children }: ColorThemeProviderProps) {
  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
}
