import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { useDropdown } from '../../dropdown';

/**
 * Which side of the trigger the panel should prefer to open on.
 *
 * When `collisionDetection` is enabled, the opposite side is used automatically
 * if there is insufficient space.
 */
type DropdownContentSide = 'top' | 'right' | 'bottom' | 'left';

/**
 * How the panel should be aligned along the axis perpendicular to `side`.
 *
 * - "start" - left-aligned for top/bottom, top-aligned for left/right.
 * - "end"   - right-aligned for top/bottom, bottom-aligned for left/right.
 */
type DropdownContentAlign = 'start' | 'end';

type Rect = { top: number; right: number; bottom: number; left: number };

type Dimensions = {
  trigger: { width: number; height: number; top: number; left: number };
  content: { width: number; height: number };
  collisionBoundary: Rect;
};

type Spaces = { top: number; right: number; bottom: number; left: number };

type SideCollisions = {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
};

type AlignCollisions = { start: boolean; end: boolean };

/** Returns the intersection of two rectangles (the overlapping region). */
function intersectRects(a: Rect, b: Rect): Rect {
  return {
    top: Math.max(a.top, b.top),
    right: Math.min(a.right, b.right),
    bottom: Math.min(a.bottom, b.bottom),
    left: Math.max(a.left, b.left),
  };
}

function getViewportRect(): Rect {
  return {
    top: 0,
    right: window.innerWidth,
    bottom: window.innerHeight,
    left: 0,
  };
}

/**
 * Returns the visible (scrollbar-excluded) rect of an element in viewport
 * coordinates.
 */
function getVisibleRect(element: HTMLElement): Rect {
  const { top, left } = element.getBoundingClientRect();
  return {
    top,
    left,
    right: left + element.clientWidth,
    bottom: top + element.clientHeight,
  };
}

function getDimensions(
  triggerElement: HTMLElement,
  contentElement: HTMLElement,
  collisionDetectionRoot: HTMLElement | null,
): Dimensions {
  const triggerRect = triggerElement.getBoundingClientRect();
  const contentRect = contentElement.getBoundingClientRect();
  const viewportRect = getViewportRect();

  // Intersect the root's visible rect (scrollbar-excluded) with the viewport to
  // get the region that is both inside the container and on screen.
  const collisionBoundary = collisionDetectionRoot
    ? intersectRects(viewportRect, getVisibleRect(collisionDetectionRoot))
    : viewportRect;

  return {
    trigger: {
      width: triggerRect.width,
      height: triggerRect.height,
      top: triggerRect.top,
      left: triggerRect.left,
    },
    content: {
      width: contentRect.width,
      height: contentRect.height,
    },
    collisionBoundary,
  };
}

function getSpaceRemaining(dimensions: Dimensions): Spaces {
  const { trigger, collisionBoundary } = dimensions;
  return {
    top: trigger.top - collisionBoundary.top,
    right: collisionBoundary.right - (trigger.left + trigger.width),
    bottom: collisionBoundary.bottom - (trigger.top + trigger.height),
    left: trigger.left - collisionBoundary.left,
  };
}

function getSpaceRequired(dimensions: Dimensions): Spaces {
  const { content } = dimensions;
  return {
    top: content.height,
    right: content.width,
    bottom: content.height,
    left: content.width,
  };
}

function getSideCollisions(
  collisionDetection: boolean,
  spaceRemaining: Spaces,
  spaceRequired: Spaces,
): SideCollisions {
  if (!collisionDetection) {
    return { top: false, right: false, bottom: false, left: false };
  }
  return {
    top: spaceRemaining.top < spaceRequired.top,
    right: spaceRemaining.right < spaceRequired.right,
    bottom: spaceRemaining.bottom < spaceRequired.bottom,
    left: spaceRemaining.left < spaceRequired.left,
  };
}

function getAlignCollisions(
  collisionDetection: boolean,
  spaceRemaining: Spaces,
  spaceRequired: Spaces,
  side: DropdownContentSide,
): AlignCollisions {
  if (!collisionDetection) {
    return { start: false, end: false };
  }

  switch (side) {
    case 'top':
    case 'bottom':
      return {
        start: spaceRemaining.right < spaceRequired.right,
        end: spaceRemaining.left < spaceRequired.left,
      };

    case 'right':
    case 'left':
      return {
        start: spaceRemaining.bottom < spaceRequired.bottom,
        end: spaceRemaining.top < spaceRequired.top,
      };
  }
}

function resolveEffectiveSide(
  preferredSide: DropdownContentSide,
  sideCollisions: SideCollisions,
): DropdownContentSide {
  if (!sideCollisions[preferredSide]) return preferredSide;

  return (
    (Object.entries(sideCollisions).find(
      ([, collides]) => !collides,
    )?.[0] as DropdownContentSide) ?? preferredSide
  );
}

function resolveEffectiveAlign(
  preferredAlign: DropdownContentAlign,
  alignCollisions: AlignCollisions,
): DropdownContentAlign {
  if (!alignCollisions[preferredAlign]) return preferredAlign;

  return (
    (Object.entries(alignCollisions).find(
      ([, collides]) => !collides,
    )?.[0] as DropdownContentAlign) ?? preferredAlign
  );
}

function calculatePanelPosition(
  dimensions: Dimensions,
  effectiveSide: DropdownContentSide,
  effectiveAlign: DropdownContentAlign,
): { top: number; left: number } {
  const { trigger, content } = dimensions;

  let top = trigger.top;
  let left = trigger.left;

  switch (effectiveSide) {
    case 'top':
      top -= content.height;
      left += effectiveAlign === 'start' ? 0 : trigger.width - content.width;
      break;

    case 'right':
      top += effectiveAlign === 'start' ? 0 : trigger.height - content.height;
      left += trigger.width;
      break;

    case 'bottom':
      top += trigger.height;
      left += effectiveAlign === 'start' ? 0 : trigger.width - content.width;
      break;

    case 'left':
      top += effectiveAlign === 'start' ? 0 : trigger.height - content.height;
      left -= content.width;
      break;
  }

  return { top, left };
}

export type UseDropdownContentParams = {
  collisionDetection?: boolean;
  side?: DropdownContentSide;
  align?: DropdownContentAlign;
};

export function useDropdownContent({
  collisionDetection = false,
  side = 'bottom',
  align = 'start',
}: UseDropdownContentParams) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const contentRef = useRef<HTMLDivElement>(null);

  const { isOpen, close, triggerRef, collisionDetectionRoot } = useDropdown();

  const computePosition = useCallback((): { top: number; left: number } => {
    if (!triggerRef.current || !contentRef.current) {
      return { top: 0, left: 0 };
    }

    const dimensions = getDimensions(
      triggerRef.current,
      contentRef.current,
      collisionDetectionRoot,
    );

    const spaceRemaining = getSpaceRemaining(dimensions);
    const spaceRequired = getSpaceRequired(dimensions);

    const sideCollisions = getSideCollisions(
      collisionDetection,
      spaceRemaining,
      spaceRequired,
    );
    const effectiveSide = resolveEffectiveSide(side, sideCollisions);

    // Re-evaluate alignment collisions for whichever side was resolved, since
    // the cross-axis changes when the side changes.
    const alignCollisions = getAlignCollisions(
      collisionDetection,
      spaceRemaining,
      spaceRequired,
      effectiveSide,
    );
    const effectiveAlign = resolveEffectiveAlign(align, alignCollisions);

    return calculatePanelPosition(dimensions, effectiveSide, effectiveAlign);
  }, [triggerRef, collisionDetection, collisionDetectionRoot, side, align]);

  const updatePosition = useCallback(() => {
    setPosition(computePosition());
  }, [computePosition]);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const clickedOutsidePanel =
        contentRef.current &&
        !contentRef.current.contains(event.target as Node);
      const clickedOutsideTrigger =
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node);

      if (clickedOutsidePanel && clickedOutsideTrigger) {
        close();
      }
    },
    [close, triggerRef],
  );

  // Synchronously update position before the browser paints so there is no
  // flash of the panel at (0, 0).
  useLayoutEffect(() => {
    if (!isOpen) return;
    updatePosition();
  }, [isOpen, updatePosition]);

  // Re-position on scroll or resize while the panel is open.
  useEffect(() => {
    if (!isOpen) return;

    // `capture: true` catches scroll events on any scrollable ancestor via the
    // window, since scroll does not bubble in all environments.
    window.addEventListener('scroll', updatePosition, { capture: true });
    window.addEventListener('resize', updatePosition);

    // Also listen directly on the collision root in case its scroll event does
    // not bubble to `window`.
    collisionDetectionRoot?.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, { capture: true });
      window.removeEventListener('resize', updatePosition);
      collisionDetectionRoot?.removeEventListener('scroll', updatePosition);
    };
  }, [isOpen, updatePosition, collisionDetectionRoot]);

  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

  return { position, isOpen, contentRef };
}
