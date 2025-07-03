import { useCallback, useEffect, useRef, useState } from 'react';

import { useDropdown } from '../Dropdown';

export type DropdownContentSide = 'top' | 'right' | 'bottom' | 'left';

export type DropdownContentAlign = 'start' | 'end';

export type UseDropdownContentOptions = {
  side?: DropdownContentSide;
  align?: DropdownContentAlign;
};

export function useDropdownContent({
  side = 'bottom',
  align = 'start',
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

    const spaceAboveTrigger = triggerOffsetTop;
    const spaceBesideRightTrigger =
      containerWidth - (triggerOffsetLeft + triggerWidth);
    const spaceBelowTrigger =
      containerHeight - (triggerOffsetTop + triggerHeight);
    const spaceBesideLeftTrigger = triggerOffsetLeft;

    // console.log(spaceAboveTrigger, 'spaceAboveTrigger');
    // console.log(spaceBesideRightTrigger, 'spaceBesideRightTrigger');
    // console.log(spaceBelowTrigger, 'spaceBelowTrigger');
    // console.log(spaceBesideLeftTrigger, 'spaceBesideLeftTrigger');

    let fitsAboveTrigger = true;
    if (side === 'top') {
      fitsAboveTrigger = spaceAboveTrigger >= contentWidth;
    }
    let fitsBesideRightTrigger = true;
    if (side === 'top' && align === 'start') {
      fitsBesideRightTrigger = spaceBesideRightTrigger >= contentWidth;
    }
    const fitsBelowTrigger = true;
    let fitsBesideLeftTrigger = true;
    if (side === 'top' && align === 'end') {
      fitsBesideLeftTrigger =
        spaceBesideLeftTrigger >= contentWidth - triggerWidth;
    }

    console.log(fitsAboveTrigger, 'fitsAboveTrigger');
    console.log(fitsBesideRightTrigger, 'fitsBesideRightTrigger');
    console.log(fitsBelowTrigger, 'fitsBelowTrigger');
    console.log(fitsBesideLeftTrigger, 'fitsBesideLeftTrigger');

    let top = 0;
    let left = 0;

    switch (side) {
      case 'top':
        top = fitsAboveTrigger ? -contentHeight : triggerHeight;
        if (align === 'start') {
          left = fitsBesideRightTrigger ? 0 : -triggerWidth;
        } else if (align === 'end') {
          left = fitsBesideLeftTrigger ? -contentWidth + triggerWidth : 0;
        }
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
  }, [triggerRef, collisionDetectionRoot, side, align]);

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
