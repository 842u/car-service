import type { ReactNode } from 'react';

import type { UseDropdownContentParams } from './use-content';
import { useDropdownContent } from './use-content';

type DropdownContentProps = {
  children: ReactNode;
} & UseDropdownContentParams;

export function DropdownContent({
  collisionDetection,
  side,
  align,
  children,
}: DropdownContentProps) {
  const { isOpen, position, contentRef, contentId } = useDropdownContent({
    collisionDetection,
    side,
    align,
  });

  if (!isOpen) return null;

  return (
    <div
      ref={contentRef}
      className="bg-light-500 dark:bg-dark-500 border-alpha-grey-500 fixed z-20 rounded-lg border p-1"
      id={contentId}
      style={{ top: position.top, left: position.left }}
    >
      {children}
    </div>
  );
}
