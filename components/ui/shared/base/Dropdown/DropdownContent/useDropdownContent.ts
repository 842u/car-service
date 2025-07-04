import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { useDropdown } from '../Dropdown';

type Dimensions = {
  trigger: {
    width: number;
    height: number;
  };
  content: {
    width: number;
    height: number;
  };
  container: {
    width: number;
    height: number;
  };
};

type Spaces = { top: number; right: number; bottom: number; left: number };

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

  const getSpaceRemains = useCallback(
    (
      dimensions: Dimensions,
      triggerOffsetTop: number,
      triggerOffsetLeft: number,
    ): Spaces => {
      const { trigger, container } = dimensions;

      const top = triggerOffsetTop;
      const right = container.width - (triggerOffsetLeft + trigger.width);
      const bottom = container.height - (triggerOffsetTop + trigger.height);
      const left = triggerOffsetLeft;

      return { top, right, bottom, left };
    },
    [],
  );

  const getSpaceRequirements = useCallback(
    (dimensions: Dimensions, side: DropdownContentSide): Spaces => {
      const { trigger, content } = dimensions;

      switch (side) {
        case 'top':
        case 'bottom':
          return {
            top: content.height,
            right: Math.abs(content.width - trigger.width),
            bottom: content.height,
            left: Math.abs(content.width - trigger.width),
          };

        case 'right':
        case 'left':
          return {
            top: Math.abs(content.height - trigger.height),
            right: content.width,
            bottom: Math.abs(content.height - trigger.height),
            left: content.width,
          };
      }
    },
    [],
  );

  const getCollisionInfo = useCallback(
    (
      collisionDetection: boolean,
      spaceRemains: Spaces,
      dimensions: Dimensions,
      side: DropdownContentSide,
    ) => {
      if (!collisionDetection) {
        return {
          canFitSide: { top: true, right: true, bottom: true, left: true },
          canFitAlign: { start: true, end: true },
        };
      }

      const spaceRequirements = getSpaceRequirements(dimensions, side);

      const canFitSide = {
        top: spaceRemains.top >= spaceRequirements.top,
        right: spaceRemains.right >= spaceRequirements.right,
        bottom: spaceRemains.bottom >= spaceRequirements.bottom,
        left: spaceRemains.left >= spaceRequirements.left,
      };

      const canFitAlign = {
        start: true,
        end: true,
      };
      switch (side) {
        case 'top':
        case 'bottom':
          canFitAlign.start = spaceRemains.right >= spaceRequirements.right;
          canFitAlign.end = spaceRemains.left >= spaceRequirements.left;
          break;

        case 'right':
        case 'left':
          canFitAlign.start = spaceRemains.bottom >= spaceRequirements.bottom;
          canFitAlign.end = spaceRemains.top >= spaceRequirements.top;
          break;
      }

      // const fallbackSide = canFitSide[side]
      //   ? side
      //   : (Object.entries(canFitSide).find(
      //       ([_, fits]) => fits,
      //     )?.[0] as DropdownContentSide) || side;

      // const fallbackSideSpaceRequirements = getSpaceRequirements(
      //   dimensions,
      //   fallbackSide,
      // );

      // switch (fallbackSide) {
      //   case 'top':
      //   case 'bottom':
      //     canFitAlign.start =
      //       spaceRemains.right >= fallbackSideSpaceRequirements.right;
      //     canFitAlign.end =
      //       spaceRemains.left >= fallbackSideSpaceRequirements.left;
      //     break;

      //   case 'right':
      //   case 'left':
      //     canFitAlign.start =
      //       spaceRemains.bottom >= fallbackSideSpaceRequirements.bottom;
      //     canFitAlign.end =
      //       spaceRemains.top >= fallbackSideSpaceRequirements.top;
      //     break;
      // }

      return { canFitSide, canFitAlign };
    },
    [getSpaceRequirements],
  );

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

    const dimensions = {
      trigger: {
        width: triggerRect.width,
        height: triggerRect.height,
      },
      content: {
        width: contentRect.width,
        height: contentRect.height,
      },
      container: {
        width: containerRect.width,
        height: containerRect.height,
      },
    };

    const spaceRemains = getSpaceRemains(
      dimensions,
      triggerOffsetTop,
      triggerOffsetLeft,
    );

    const collisionInfo = getCollisionInfo(
      collisionDetection,
      spaceRemains,
      dimensions,
      side,
    );

    console.log(collisionInfo);

    // if (collisionDetection) {
    //   if (side === 'top') {
    //     fitsAboveTrigger = spaceAbove >= contentHeight;
    //   } else if ((side === 'right' || side === 'left') && align === 'end') {
    //     fitsAboveTrigger = spaceAbove >= contentHeight - triggerHeight;
    //   }

    //   if ((side === 'top' || side === 'bottom') && align === 'start') {
    //     fitsBesideRightTrigger = spaceRight >= contentWidth;
    //   } else if (side === 'right') {
    //     fitsBesideRightTrigger = spaceRight >= contentWidth;
    //   }

    //   if ((side === 'right' || side === 'left') && align === 'start') {
    //     fitsBelowTrigger = spaceBelow >= contentHeight - triggerHeight;
    //   } else if (side === 'bottom') {
    //     fitsBelowTrigger = spaceBelow >= contentHeight;
    //   }

    //   if ((side === 'top' || side === 'bottom') && align === 'end') {
    //     fitsBesideLeftTrigger = spaceLeft >= contentWidth - triggerWidth;
    //   } else if (side === 'left') {
    //     fitsBesideLeftTrigger = spaceLeft >= contentWidth;
    //   }
    // }

    const top = 0;
    const left = 0;

    // switch (side) {
    //   case 'top':
    //     top = fitsAboveTrigger ? -contentHeight : triggerHeight;
    //     if (align === 'start') {
    //       left = fitsBesideRightTrigger ? 0 : -triggerWidth;
    //     } else if (align === 'end') {
    //       left = fitsBesideLeftTrigger ? -contentWidth + triggerWidth : 0;
    //     }
    //     break;

    //   case 'right':
    //     if (align === 'start') {
    //       top = fitsBelowTrigger ? 0 : -contentHeight + triggerHeight;
    //     } else if (align === 'end') {
    //       top = fitsAboveTrigger ? -contentHeight + triggerHeight : 0;
    //     }
    //     left = fitsBesideRightTrigger ? triggerWidth : -contentWidth;
    //     break;

    //   case 'bottom':
    //     top = fitsBelowTrigger ? triggerHeight : -contentHeight;
    //     if (align === 'start') {
    //       left = fitsBesideRightTrigger ? 0 : -contentWidth + triggerWidth;
    //     } else if (align === 'end') {
    //       left = fitsBesideLeftTrigger ? -contentWidth + triggerWidth : 0;
    //     }
    //     break;

    //   case 'left':
    //     if (align === 'start') {
    //       top = fitsBelowTrigger ? 0 : -contentHeight + triggerHeight;
    //     } else if (align === 'end') {
    //       top = fitsAboveTrigger ? -contentHeight + triggerHeight : 0;
    //     }
    //     left = fitsBesideLeftTrigger ? -contentWidth : triggerWidth;
    //     break;
    // }

    return { top, left };
  }, [
    triggerRef,
    collisionDetection,
    collisionDetectionRoot,
    getSpaceRemains,
    side,
    getCollisionInfo,
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
