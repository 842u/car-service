import './globals.css';

import type { Metadata } from 'next';

import { ColorThemeProvider } from '@/components/providers/ColorThemeProvider';
import { ToastsProvider } from '@/components/providers/ToastsProvider';
import { Toaster } from '@/components/ui/Toaster/Toaster';
import { inter } from '@/utils/fonts';

export const metadata: Metadata = {
  title: 'Car Service',
  description: "Car's Story Safely Managed. Store, Track, Drive.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`bg-light-500 text-dark-500 transition-colors dark:bg-dark-500 dark:text-light-500 ${inter.className}`}
      >
        <ToastsProvider>
          <ColorThemeProvider>
            <Toaster />
            {children}
          </ColorThemeProvider>
        </ToastsProvider>
      </body>
    </html>
  );
}
