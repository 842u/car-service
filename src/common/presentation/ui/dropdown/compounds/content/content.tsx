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
  const { isOpen, position, contentRef, contentId, handleKeyDown } =
    useDropdownContent({
      collisionDetection,
      side,
      align,
    });

  if (!isOpen) return null;

  //! The portal is what keeps `fixed` below resolving against the viewport,
  //! which is what useDropdownContent measures its coordinates against.
  //! Otherwise `fixed` resolves against the nearest ancestor establishing a
  //! containing block, and a transform, filter, backdrop-filter, contain, or
  //! container-type is enough to establish one. Rendered inline, this panel
  //! would land offset and be clipped by any overflow in between the moment
  //! the dashboard's main region became a query container, with nothing in the
  //! failure pointing at the cause.
  return createPortal(
    /* eslint-disable-next-line jsx-a11y/no-static-element-interactions --
       the panel is not interactive and takes no role. The handler only sends
       focus back to the trigger when Tab is about to carry it off either end,
       which is keyboard support rather than an interaction of its own. */
    <div
      ref={contentRef}
      className="bg-light-500 dark:bg-dark-500 border-alpha-grey-500 fixed z-60 rounded-lg border p-1"
      id={contentId}
      style={{ top: position.top, left: position.left }}
      // Focused on open, so it has to be able to hold focus. It stays out of
      // the sequential tab order: the panel is the last node in the document,
      // and tabbing into it from there would read as a jump backwards.
      tabIndex={-1}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>,
    document.body,
  );
}
