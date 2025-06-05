import { ReactNode } from 'react';

import { useDropdownContent } from './useDropdownContent';

type DropdownContentProps = { children: ReactNode };

export function DropdownContent({ children }: DropdownContentProps) {
  const { isOpen, position, contentRef } = useDropdownContent();

  return (
    isOpen && (
      <div
        ref={contentRef}
        className={`absolute top-[${position.top}] left-[${position.left}] bg-light-500 dark:bg-dark-500 border-alpha-grey-500 p8 z-50 my-1 overflow-hidden rounded-lg border p-2`}
      >
        <div
          aria-hidden
          className="bg-alpha-grey-200 absolute top-0 left-0 h-full w-full"
        />
        {children}
      </div>
    )
  );
}
