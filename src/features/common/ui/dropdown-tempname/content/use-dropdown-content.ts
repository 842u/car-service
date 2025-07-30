import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { useDropdown } from '../dropdown-tempname';

type Dimensions = {
  trigger: {
    width: number;
    height: number;
    offsetTop: number;
    offsetLeft: number;
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

type SideCollisions = {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
};

type AlignCollisions = {
  start: boolean;
  end: boolean;
};

function getDimensions(
  triggerElement: HTMLElement,
  contentElement: HTMLElement,
  collisionDetectionRootElement: HTMLElement | null,
) {
  const containerElement = collisionDetectionRootElement || document.body;

  const triggerRect = triggerElement.getBoundingClientRect();
  const contentRect = contentElement.getBoundingClientRect();
  const containerRect = containerElement.getBoundingClientRect();

  const dimensions = {
    trigger: {
      width: triggerRect.width,
      height: triggerRect.height,
      offsetTop:
        triggerRect.top - containerRect.top + containerElement.scrollTop,
      offsetLeft:
        triggerRect.left - containerRect.left + containerElement.scrollLeft,
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

  return dimensions;
}

function getSpaceRemains(dimensions: Dimensions) {
  const { trigger, container } = dimensions;

  const top = trigger.offsetTop;
  const right = container.width - (trigger.offsetLeft + trigger.width);
  const bottom = container.height - (trigger.offsetTop + trigger.height);
  const left = trigger.offsetLeft;

  return { top, right, bottom, left };
}

function getSpaceRequirements(dimensions: Dimensions) {
  const { content } = dimensions;

  return {
    top: content.height,
    right: content.width,
    bottom: content.height,
    left: content.width,
  };
}

function getSideCollision(
  collisionDetection: boolean,
  spaceRemains: Spaces,
  spaceRequirements: Spaces,
) {
  if (!collisionDetection) {
    return {
      top: false,
      right: false,
      bottom: false,
      left: false,
    };
  }

  const sideCollisions = {
    top: spaceRemains.top < spaceRequirements.top,
    right: spaceRemains.right < spaceRequirements.right,
    bottom: spaceRemains.bottom < spaceRequirements.bottom,
    left: spaceRemains.left < spaceRequirements.left,
  };

  return sideCollisions;
}

function getAlignCollision(
  collisionDetection: boolean,
  spaceRemains: Spaces,
  spaceRequirements: Spaces,
  side: DropdownContentSide,
) {
  if (!collisionDetection) {
    return {
      start: false,
      end: false,
    };
  }

  switch (side) {
    case 'top':
    case 'bottom':
      return {
        start: spaceRemains.right < spaceRequirements.right,
        end: spaceRemains.left < spaceRequirements.left,
      };

    case 'right':
    case 'left':
      return {
        start: spaceRemains.bottom < spaceRequirements.bottom,
        end: spaceRemains.top < spaceRequirements.top,
      };
  }
}

function getFallbackSide(
  side: DropdownContentSide,
  sideCollisions: SideCollisions,
) {
  return !sideCollisions[side]
    ? side
    : (Object.entries(sideCollisions).find(
        ([_, collision]) => !collision,
      )?.[0] as DropdownContentSide) || side;
}

function getFallbackAlign(
  align: DropdownContentAlign,
  alignCollisions: AlignCollisions,
) {
  return !alignCollisions[align]
    ? align
    : (Object.entries(alignCollisions).find(
        ([_, collision]) => !collision,
      )?.[0] as DropdownContentSide) || align;
}

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

    const dimensions = getDimensions(
      triggerRef.current,
      contentRef.current,
      collisionDetectionRoot,
    );

    const spaceRemains = getSpaceRemains(dimensions);

    const spaceRequirements = getSpaceRequirements(dimensions);

    const sideCollisionInfo = getSideCollision(
      collisionDetection,
      spaceRemains,
      spaceRequirements,
    );

    const fallbackSide = getFallbackSide(side, sideCollisionInfo);

    const alignCollisionsInfo = getAlignCollision(
      collisionDetection,
      spaceRemains,
      spaceRequirements,
      side,
    );

    let fallbackAlign = getFallbackAlign(align, alignCollisionsInfo);

    if (fallbackSide !== side) {
      const fallbackSpaceRequirements = getSpaceRequirements(dimensions);

      const fallbackAlignCollisions = getAlignCollision(
        collisionDetection,
        spaceRemains,
        fallbackSpaceRequirements,
        fallbackSide,
      );

      fallbackAlign = getFallbackAlign(align, fallbackAlignCollisions);
    }

    let top = 0;
    let left = 0;

    switch (fallbackSide) {
      case 'top':
        top = -dimensions.content.height;
        if (fallbackAlign === 'start') {
          left = 0;
        } else {
          left = -dimensions.content.width + dimensions.trigger.width;
        }
        break;

      case 'right':
        if (align === 'start') {
          top = 0;
        } else {
          top = -dimensions.content.height + dimensions.trigger.height;
        }
        left = dimensions.trigger.width;
        break;

      case 'bottom':
        top = dimensions.trigger.height;
        if (fallbackAlign === 'start') {
          left = 0;
        } else {
          left = -dimensions.content.width + dimensions.trigger.width;
        }
        break;

      case 'left':
        if (align === 'start') {
          top = 0;
        } else {
          top = -dimensions.content.height + dimensions.trigger.height;
        }
        left = -dimensions.content.width;
    }

    return { top, left };
  }, [triggerRef, collisionDetection, collisionDetectionRoot, side, align]);

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
