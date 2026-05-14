import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

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
  const { isOpen, position, contentRef } = useDropdownContent({
    collisionDetection,
    side,
    align,
  });

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={contentRef}
      className="bg-light-500 dark:bg-dark-500 border-alpha-grey-500 fixed z-10 rounded-lg border p-1"
      style={{ top: position.top, left: position.left }}
    >
      {children}
    </div>,
    document.body,
  );
}
