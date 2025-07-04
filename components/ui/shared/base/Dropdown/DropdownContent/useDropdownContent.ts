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

  const calculateSpaces = useCallback(
    ({
      triggerElement,
      collisionDetectionRoot,
    }: {
      triggerElement: HTMLButtonElement;
      collisionDetectionRoot: HTMLElement | null;
    }) => {
      const containerElement = collisionDetectionRoot || document.body;

      const triggerRect = triggerElement.getBoundingClientRect();
      const containerRect = containerElement.getBoundingClientRect();

      const triggerHeight = triggerRect.height;
      const containerHeight = containerRect.height;

      const triggerWidth = triggerRect.width;
      const containerWidth = containerRect.width;

      const triggerOffsetTop =
        triggerRect.top - containerRect.top + containerElement.scrollTop;
      const triggerOffsetLeft =
        triggerRect.left - containerRect.left + containerElement.scrollLeft;

      const spaceAbove = triggerOffsetTop;
      const spaceRight = containerWidth - (triggerOffsetLeft + triggerWidth);
      const spaceBelow = containerHeight - (triggerOffsetTop + triggerHeight);
      const spaceLeft = triggerOffsetLeft;

      return { spaceAbove, spaceRight, spaceBelow, spaceLeft };
    },
    [],
  );

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !contentRef.current) {
      return { top: 0, left: 0 };
    }

    const triggerElement = triggerRef.current;
    const contentElement = contentRef.current;

    const triggerRect = triggerElement.getBoundingClientRect();
    const contentRect = contentElement.getBoundingClientRect();

    const triggerHeight = triggerRect.height;
    const contentHeight = contentRect.height;

    const triggerWidth = triggerRect.width;
    const contentWidth = contentRect.width;

    let fitsAboveTrigger = true;
    let fitsBesideRightTrigger = true;
    let fitsBelowTrigger = true;
    let fitsBesideLeftTrigger = true;

    const { spaceAbove, spaceBelow, spaceLeft, spaceRight } = calculateSpaces({
      collisionDetectionRoot,
      triggerElement,
    });

    if (collisionDetection) {
      if (side === 'top') {
        fitsAboveTrigger = spaceAbove >= contentHeight;
      } else if ((side === 'right' || side === 'left') && align === 'end') {
        fitsAboveTrigger = spaceAbove >= contentHeight - triggerHeight;
      }

      if ((side === 'top' || side === 'bottom') && align === 'start') {
        fitsBesideRightTrigger = spaceRight >= contentWidth;
      } else if (side === 'right') {
        fitsBesideRightTrigger = spaceRight >= contentWidth;
      }

      if ((side === 'right' || side === 'left') && align === 'start') {
        fitsBelowTrigger = spaceBelow >= contentHeight - triggerHeight;
      } else if (side === 'bottom') {
        fitsBelowTrigger = spaceBelow >= contentHeight;
      }

      if ((side === 'top' || side === 'bottom') && align === 'end') {
        fitsBesideLeftTrigger = spaceLeft >= contentWidth - triggerWidth;
      } else if (side === 'left') {
        fitsBesideLeftTrigger = spaceLeft >= contentWidth;
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
  }, [
    triggerRef,
    collisionDetectionRoot,
    side,
    align,
    collisionDetection,
    calculateSpaces,
  ]);

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
