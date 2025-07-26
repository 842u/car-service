import './globals.css';

import type { Metadata } from 'next';
import { headers } from 'next/headers';

import LazyToaster from '@/components/ui/Toaster/LazyToaster';
import { Providers } from '@/features/common/providers/Providers';
import { inter } from '@/utils/fonts';

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
    <html suppressHydrationWarning lang="en">
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
