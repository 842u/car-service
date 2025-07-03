import { useCallback, useEffect, useRef, useState } from 'react';

import { useDropdown } from '../Dropdown';

export type DropdownContentSide = 'top' | 'right' | 'bottom' | 'left';

export type UseDropdownContentOptions = {
  side?: DropdownContentSide;
};

export function useDropdownContent({
  side = 'bottom',
}: UseDropdownContentOptions) {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const contentRef = useRef<HTMLDivElement>(null);

  const { isOpen, close, triggerRef, collisionDetectionRoot } = useDropdown();

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !contentRef.current || !collisionDetectionRoot) {
      return { top: 0, left: 0 };
    }

    const triggerElement = triggerRef.current;
    const contentElement = contentRef.current;
    const containerElement = collisionDetectionRoot;

    const triggerRect = triggerElement.getBoundingClientRect();
    const contentRect = contentElement.getBoundingClientRect();
    const containerRect = containerElement.getBoundingClientRect();

    const triggerOffsetTop =
      triggerRect.top - containerRect.top + containerElement.scrollTop;
    const triggerOffsetLeft =
      triggerRect.left - containerRect.left + containerElement.scrollLeft;

    const triggerHeight = triggerRect.height;
    const contentHeight = contentRect.height;
    const containerHeight = containerRect.height;

    const triggerWidth = triggerRect.width;
    const contentWidth = contentRect.width;
    const containerWidth = containerRect.width;

    const spaceBelowTrigger =
      containerHeight - (triggerOffsetTop + triggerHeight);
    const spaceAboveTrigger = triggerOffsetTop;
    const spaceBesideLeftTrigger = triggerOffsetLeft;
    const spaceBesideRightTrigger =
      containerWidth - (triggerOffsetLeft + triggerWidth);

    const fitsBelow = spaceBelowTrigger >= contentHeight;
    const fitsAbove = spaceAboveTrigger >= contentHeight;
    const fitsLeft = spaceBesideLeftTrigger >= contentWidth;
    const fitsRight = spaceBesideRightTrigger >= contentWidth;

    let top = 0;
    let left = 0;

    switch (side) {
      case 'top':
        top = -contentHeight;
        left = 0;
        break;

      case 'right':
        top = 0;
        left = triggerWidth;
        break;

      case 'bottom':
        top = triggerHeight;
        left = 0;
        break;

      case 'left':
        top = 0;
        left = -contentWidth;
        break;
    }

    return { top, left };
  }, [triggerRef, collisionDetectionRoot, side]);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        close();
      }
    },
    [close, triggerRef],
  );

  useEffect(() => {
    if (!isOpen) return;

    const newPosition = calculatePosition();

    setPosition(newPosition);
  }, [isOpen, calculatePosition]);

  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen, close, triggerRef, handleClickOutside]);

  return { position, isOpen, contentRef };
}
