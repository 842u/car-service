import { useEffect, useRef, useState } from 'react';

import { useDropdown } from '../Dropdown';

export type DropdownContentSnap =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export function useDropdownContent({ snap }: { snap: DropdownContentSnap }) {
  const contentRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState({ top: 0, left: 0 });

  const { isOpen, close, triggerRef } = useDropdown();

  useEffect(() => {
    if (isOpen && triggerRef.current && contentRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();

      const contentComputedStyle = window.getComputedStyle(contentRef.current);
      const contentTopMargin = Number.parseInt(contentComputedStyle.marginTop);

      let top = 0;
      let left = 0;

      switch (snap) {
        case 'bottom-left':
          top = triggerRect.height;
          left = 0;
          break;

        case 'bottom-right':
          top = triggerRect.height;
          left = -contentRect.width + triggerRect.width;
          break;

        case 'top-left':
          top = -contentRect.height - 2 * contentTopMargin;
          left = 0;
          break;

        case 'top-right':
          top = -contentRect.height - 2 * contentTopMargin;
          left = -contentRect.width + triggerRect.width;
          break;
      }

      setPosition({ top, left });
    }
  }, [isOpen, triggerRef, snap]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        close();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, close, triggerRef]);

  return { position: position, isOpen, contentRef };
}
