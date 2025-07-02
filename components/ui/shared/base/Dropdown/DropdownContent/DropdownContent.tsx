import { ReactNode } from 'react';

import { DropdownContentSnap, useDropdownContent } from './useDropdownContent';

type DropdownContentProps = { children: ReactNode; snap?: DropdownContentSnap };

export function DropdownContent({
  children,
  snap = 'bottom-left',
}: DropdownContentProps) {
  const { isOpen, position, contentRef } = useDropdownContent({ snap });

  return (
    isOpen && (
      <div
        ref={contentRef}
        className="bg-light-500 dark:bg-dark-500 border-alpha-grey-500 absolute z-10 rounded-lg border p-1"
        style={{ top: position.top, left: position.left }}
      >
        {children}
      </div>
    )
  );
}
