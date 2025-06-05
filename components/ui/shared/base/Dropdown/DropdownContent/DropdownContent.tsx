import { ReactNode } from 'react';

import { useDropdownContent } from './useDropdownContent';

type DropdownContentProps = { children: ReactNode };

export function DropdownContent({ children }: DropdownContentProps) {
  const { isOpen, position, contentRef } = useDropdownContent();

  return (
    isOpen && (
      <div
        ref={contentRef}
        className={`absolute top-[${position.top}] left-[${position.left}] bg-light-500 dark:bg-dark-500 border-alpha-grey-500 z-50 my-1 overflow-hidden rounded-lg border p-1`}
      >
        {children}
      </div>
    )
  );
}
