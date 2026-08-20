import type { KeyboardEvent } from 'react';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

import { useDropdown } from '../../use-dropdown';

/**
 * Everything inside `root` that Tab can reach, in document order. Used to find
 * the two ends of the panel's own tab order, not to trap focus between them.
 *
 * Both conditions are the platform's own answer rather than a restatement of
 * it. `tabIndex` falls back to the element type's default when the attribute is
 * absent, which is 0 for a focusable area and -1 for everything else, so an
 * explicit `tabindex="-1"` on an otherwise focusable control is excluded.
 * `:disabled` carries the `fieldset` inheritance a `[disabled]` selector cannot
 * see. Enumerating tag names instead would restate both, and get both wrong.
 *
 * Visibility is not checked: every panel in the app renders its controls
 * conditionally rather than hiding them.
 */
function findFocusable(root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>('*')].filter(
    (element) => element.tabIndex >= 0 && !element.matches(':disabled'),
  );
}

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

  // Owned by the Dropdown context because the dismissal listeners need it to
  // decide whether an event landed inside the panel.
  const { isOpen, triggerRef, contentRef, collisionDetectionRoot, contentId } =
    useDropdown();

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
  }, [
    triggerRef,
    contentRef,
    collisionDetection,
    collisionDetectionRoot,
    side,
    align,
  ]);

  const updatePosition = useCallback(() => {
    setPosition(computePosition());
  }, [computePosition]);

  // Synchronously update position before the browser paints so there is no
  // flash of the panel at (0, 0).
  useLayoutEffect(() => {
    if (!isOpen) return;
    updatePosition();
  }, [isOpen, updatePosition]);

  // The panel is portaled out of the trigger's subtree, so DOM order no longer
  // carries the keyboard from one to the other. Focus lands on the container
  // rather than on the first control: one panel leads with a text filter, and
  // landing there would make the same gesture type a character in one dropdown
  // and activate a button in another.
  useEffect(() => {
    if (!isOpen) return;

    contentRef.current?.focus();
  }, [isOpen, contentRef]);

  /**
   * Sends focus back to the trigger when Tab would carry it off either end of
   * the panel.
   *
   * The default action is deliberately left to run: the browser resolves the
   * next tab stop against whatever holds focus once the handler returns, so
   * moving focus to the trigger first is what makes the page continue tabbing
   * from the trigger's place in document order rather than from the end of the
   * body. The panel then closes behind the user through the focus-out listener
   * on the document.
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== 'Tab') return;

      const panel = contentRef.current;

      if (!panel) return;

      const focusable = findFocusable(panel);

      // Backwards counts the panel itself as a boundary as well as its first
      // control: the container holds focus on open, and its tabindex of -1
      // keeps it out of the sequential order, so a Shift+Tab from the first
      // control skips past it and leaves the panel too.
      const isLeaving = event.shiftKey
        ? event.target === panel || event.target === focusable[0]
        : event.target === focusable[focusable.length - 1];

      if (isLeaving) triggerRef.current?.focus();
    },
    [contentRef, triggerRef],
  );

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

  return { position, isOpen, contentRef, contentId, handleKeyDown };
}
