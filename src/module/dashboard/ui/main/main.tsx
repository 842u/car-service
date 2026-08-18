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
        // The padding tracks the nav's resting width, so an expanded nav takes
        // the width from here rather than covering what is under it. It is not
        // transitioned: a mode change is instant, and animating this width
        // would make every page re-resolve its layout on each frame.
        'md:nav-expanded:pl-56 flex min-h-screen max-w-full items-center-safe justify-center-safe pt-16 transition-none md:pl-16',
        className,
      )}
    >
      {children}
    </main>
  );
}
