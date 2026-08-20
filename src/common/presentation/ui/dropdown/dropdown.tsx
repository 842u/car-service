import type { ReactNode } from 'react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

import { DropdownContent } from './compounds/content/content';
import { DropdownTrigger } from './compounds/trigger/trigger';
import { DropdownContext } from './use-dropdown';

type DropdownProps = {
  children: ReactNode;
  className?: string;
  collisionDetectionRoot?: HTMLElement | null;
};

export function Dropdown({
  children,
  className,
  collisionDetectionRoot = null,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const contentId = useId();

  const close = useCallback(() => {
    // Read now, before the panel unmounts: afterwards activeElement is <body>,
    // which answers false both for the case that has to restore focus and for
    // the case that must not. Restoring unconditionally would take focus back
    // from an element the user clicked outside, and from a modal that a panel
    // button opened just before closing the dropdown.
    if (contentRef.current?.contains(document.activeElement)) {
      triggerRef.current?.focus();
    }

    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    if (!isOpen) return;

    // Both refs are read at event time rather than captured here, so the
    // effect does not need to re-run when the panel mounts.
    const isOutside = (node: Node | null) =>
      !rootRef.current?.contains(node) && !contentRef.current?.contains(node);

    const handleFocusOut = (event: FocusEvent) => {
      const next = event.relatedTarget as Node | null;
      // null when focus leaves the document entirely (window switch,
      // devtools), which must not close the panel.
      if (next && isOutside(next)) close();
    };

    // close() restores focus to the trigger on its own when focus is in the
    // panel, which is where Escape finds it.
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (isOutside(event.target as Node)) close();
    };

    // All three bind to document rather than to the root, so they keep firing
    // for a panel that is not a descendant of the root.
    document.addEventListener('focusout', handleFocusOut);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('focusout', handleFocusOut);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen, close]);

  return (
    <DropdownContext
      value={{
        isOpen,
        toggle,
        close,
        triggerRef,
        contentRef,
        collisionDetectionRoot,
        contentId,
      }}
    >
      <div ref={rootRef} className={className}>
        {children}
      </div>
    </DropdownContext>
  );
}

Dropdown.Trigger = DropdownTrigger;
Dropdown.Content = DropdownContent;
