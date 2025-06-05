import { useEffect, useRef, useState } from 'react';

import { useDropdown } from '../Dropdown';

export function useDropdownContent() {
  const contentRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState({ top: 0, left: 0 });

  const { isOpen, close, triggerRef } = useDropdown();

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();

      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [isOpen, triggerRef]);

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

  return { position, isOpen, contentRef };
}
