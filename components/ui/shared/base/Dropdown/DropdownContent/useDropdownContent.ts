import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { useDropdown } from '../Dropdown';

export type DropdownContentSide = 'top' | 'right' | 'bottom' | 'left';

export type DropdownContentAlign = 'start' | 'end';

export type UseDropdownContentOptions = {
  collisionDetection?: boolean;
  side?: DropdownContentSide;
  align?: DropdownContentAlign;
};

export function useDropdownContent({
  collisionDetection = false,
  side = 'bottom',
  align = 'start',
}: UseDropdownContentOptions) {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const contentRef = useRef<HTMLDivElement>(null);

  const { isOpen, close, triggerRef, collisionDetectionRoot } = useDropdown();

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !contentRef.current) {
      return { top: 0, left: 0 };
    }

    const triggerElement = triggerRef.current;
    const contentElement = contentRef.current;
    const containerElement = collisionDetectionRoot || document.body;

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

    let fitsAboveTrigger = true;
    let fitsBesideRightTrigger = true;
    let fitsBelowTrigger = true;
    let fitsBesideLeftTrigger = true;

    if (collisionDetection) {
      if (side === 'top') {
        fitsAboveTrigger = spaceAboveTrigger >= contentHeight;
      } else if ((side === 'right' || side === 'left') && align === 'end') {
        fitsAboveTrigger = spaceAboveTrigger >= contentHeight - triggerHeight;
      }

      if ((side === 'top' || side === 'bottom') && align === 'start') {
        fitsBesideRightTrigger = spaceBesideRightTrigger >= contentWidth;
      } else if (side === 'right') {
        fitsBesideRightTrigger = spaceBesideRightTrigger >= contentWidth;
      }

      if ((side === 'right' || side === 'left') && align === 'start') {
        fitsBelowTrigger = spaceBelowTrigger >= contentHeight - triggerHeight;
      } else if (side === 'bottom') {
        fitsBelowTrigger = spaceBelowTrigger >= contentHeight;
      }

      if ((side === 'top' || side === 'bottom') && align === 'end') {
        fitsBesideLeftTrigger =
          spaceBesideLeftTrigger >= contentWidth - triggerWidth;
      } else if (side === 'left') {
        fitsBesideLeftTrigger = spaceBesideLeftTrigger >= contentWidth;
      }
    }

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
        if (align === 'start') {
          top = fitsBelowTrigger ? 0 : -contentHeight + triggerHeight;
        } else if (align === 'end') {
          top = fitsAboveTrigger ? -contentHeight + triggerHeight : 0;
        }
        left = fitsBesideRightTrigger ? triggerWidth : -contentWidth;
        break;

      case 'bottom':
        top = fitsBelowTrigger ? triggerHeight : -contentHeight;
        if (align === 'start') {
          left = fitsBesideRightTrigger ? 0 : -contentWidth + triggerWidth;
        } else if (align === 'end') {
          left = fitsBesideLeftTrigger ? -contentWidth + triggerWidth : 0;
        }
        break;

      case 'left':
        if (align === 'start') {
          top = fitsBelowTrigger ? 0 : -contentHeight + triggerHeight;
        } else if (align === 'end') {
          top = fitsAboveTrigger ? -contentHeight + triggerHeight : 0;
        }
        left = fitsBesideLeftTrigger ? -contentWidth : triggerWidth;
        break;
    }

    return { top, left };
  }, [triggerRef, collisionDetectionRoot, side, align, collisionDetection]);

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

  useLayoutEffect(() => {
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
