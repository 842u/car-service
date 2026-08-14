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

  //! `fixed` below resolves against the viewport, which is what
  //! useDropdownContent measures its coordinates against. That holds only while
  //! no ancestor establishes a containing block. A transform, filter,
  //! backdrop-filter, contain, or container-type anywhere above this panel makes
  //! `fixed` resolve against that ancestor instead, so the panel lands offset and
  //! is clipped by any overflow between the two, with nothing pointing at the
  //! cause. The sticky table header is opaque rather than backdrop-blurred for
  //! exactly this reason, and no dropdown is rendered inside a Card, whose
  //! drop-shadow is a filter.
  return (
    <div
      ref={contentRef}
      className="bg-light-500 dark:bg-dark-500 border-alpha-grey-500 fixed z-60 rounded-lg border p-1"
      id={contentId}
      style={{ top: position.top, left: position.left }}
    >
      {children}
    </div>
  );
}
