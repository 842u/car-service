import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type DashboardMainProps = {
  children: ReactNode;
  className?: string;
};

export function DashboardMain({ children, className }: DashboardMainProps) {
  return (
    <main
      className={twMerge(
        // `max-w-full` rather than `max-w-screen`: `100vw` counts the classic
        // scrollbar, so it exceeds the content box by the gutter width.
        // Safe centering so that content wider than the viewport overflows the
        // end edge only, where it stays reachable by scrolling.
        'flex min-h-screen max-w-full items-center-safe justify-center-safe pt-16 md:pl-16',
        className,
      )}
    >
      {children}
    </main>
  );
}
