import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { useDropdown } from '../Dropdown';

export type DropdownContentSnap =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export function useDropdownContent({ snap }: { snap: DropdownContentSnap }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

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

    switch (snap) {
      case 'bottom-left':
        top = fitsBelow ? triggerRect.height : -contentRect.height;
        left = 0;
        break;

      case 'bottom-right':
        top = fitsBelow ? triggerRect.height : -contentRect.height;
        left = triggerRect.width - contentRect.width;
        break;

      case 'top-left':
        top = -contentRect.height;
        left = 0;
        break;

      case 'top-right':
        top = -contentRect.height;
        left = triggerRect.width - contentRect.width;
        break;
    }

    return { top, left };
  }, [triggerRef, collisionDetectionRoot, snap]);

  useLayoutEffect(() => {
    if (!isOpen) return;

    const newPosition = calculatePosition();

    setPosition(newPosition);
  }, [isOpen, calculatePosition]);

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

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, close, triggerRef]);

  return { position, isOpen, contentRef };
}
