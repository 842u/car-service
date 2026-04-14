import './globals.css';

import type { Metadata } from 'next';
import { headers } from 'next/headers';

import { Providers } from '@/common/presentation/provider/providers';
import { inter } from '@/lib/next/fonts';
import LazyToaster from '@/ui/toaster/lazy-toaster';

export const metadata: Metadata = {
  title: 'Car Service',
  description: "Car's Story Safely Managed. Store, Track, Drive.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await headers();

  return (
    <html
      suppressHydrationWarning
      className="[scrollbar-gutter:stable]"
      lang="en"
    >
      <body
        className={`bg-light-500 text-dark-500 dark:bg-dark-500 dark:text-light-500 transition-colors ${inter.className}`}
      >
        <Providers>
          <LazyToaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
