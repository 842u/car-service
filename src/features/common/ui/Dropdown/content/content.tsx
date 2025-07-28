import { ReactNode } from 'react';

import {
  useDropdownContent,
  UseDropdownContentOptions,
} from './use-dropdown-content';

type ContentProps = {
  children: ReactNode;
} & UseDropdownContentOptions;

export function Content({
  collisionDetection,
  side,
  align,
  children,
}: ContentProps) {
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
