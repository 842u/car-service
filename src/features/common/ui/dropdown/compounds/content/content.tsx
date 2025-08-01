import type { ReactNode } from 'react';

import type { UseDropdownContentOptions } from './use-content';
import { useDropdownContent } from './use-content';

type DropdownContentProps = {
  children: ReactNode;
} & UseDropdownContentOptions;

export function DropdownContent({
  collisionDetection,
  side,
  align,
  children,
}: DropdownContentProps) {
  const { isOpen, position, contentRef } = useDropdownContent({
    collisionDetection,
    side,
    align,
  });

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
