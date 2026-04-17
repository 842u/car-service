import { fireEvent, renderHook } from '@testing-library/react';

import { useDropdown } from '../../dropdown';
import { useDropdownContent } from './use-content';

jest.mock('../../dropdown', () => ({
  useDropdown: jest.fn(),
}));

const mockUseDropdown = useDropdown as jest.Mock;
const mockClose = jest.fn();
const mockTriggerRef: { current: HTMLButtonElement | null } = { current: null };

function makeFakeElement(rect: {
  top?: number;
  left?: number;
  width?: number;
  height?: number;
}): HTMLElement {
  const top = rect.top ?? 0;
  const left = rect.left ?? 0;
  const width = rect.width ?? 0;
  const height = rect.height ?? 0;

  const el = document.createElement('div');
  jest.spyOn(el, 'getBoundingClientRect').mockReturnValue({
    top,
    left,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
    toJSON: () => ({}),
  } as DOMRect);
  return el;
}

const TRIGGER_RECT = { top: 100, left: 100, width: 50, height: 20 };
const CONTENT_RECT = { top: 0, left: 0, width: 80, height: 30 };

function setupMockContext(
  overrides: {
    isOpen?: boolean;
    collisionDetectionRoot?: HTMLElement | null;
  } = {},
) {
  mockUseDropdown.mockReturnValue({
    isOpen: overrides.isOpen ?? false,
    close: mockClose,
    triggerRef: mockTriggerRef,
    collisionDetectionRoot: overrides.collisionDetectionRoot ?? null,
  });
}

/**
 * Renders the hook with isOpen=false, sets up refs, then re-renders with
 * isOpen=true so useLayoutEffect fires with non-null refs.
 */
function renderAndOpen(
  params: Parameters<typeof useDropdownContent>[0],
  triggerRect = TRIGGER_RECT,
  contentRect = CONTENT_RECT,
) {
  const fakeTrigger = makeFakeElement(triggerRect);
  const fakeContent = makeFakeElement(contentRect);

  mockTriggerRef.current = fakeTrigger as HTMLButtonElement;

  const { result, rerender, unmount } = renderHook(() =>
    useDropdownContent(params),
  );

  result.current.contentRef.current = fakeContent as HTMLDivElement;

  setupMockContext({ isOpen: true });
  rerender();

  return { result, rerender, unmount, fakeTrigger, fakeContent };
}

beforeEach(() => {
  jest.clearAllMocks();
  mockTriggerRef.current = null;

  Object.defineProperty(window, 'innerWidth', {
    value: 1000,
    configurable: true,
  });
  Object.defineProperty(window, 'innerHeight', {
    value: 800,
    configurable: true,
  });

  setupMockContext();
});

describe('useDropdownContent', () => {
  describe('initial state', () => {
    it('should return position { top: 0, left: 0 } when closed', () => {
      const { result } = renderHook(() => useDropdownContent({}));

      expect(result.current.position).toEqual({ top: 0, left: 0 });
    });

    it('should return isOpen from context', () => {
      const { result } = renderHook(() => useDropdownContent({}));

      expect(result.current.isOpen).toBe(false);
    });

    it('should return a contentRef object', () => {
      const { result } = renderHook(() => useDropdownContent({}));

      expect(result.current.contentRef).toEqual({ current: null });
    });
  });

  describe('positioning — side', () => {
    it('should position below trigger for side=bottom, align=start', () => {
      // trigger: top=100, height=20 → panel top = 120; left = 100
      const { result } = renderAndOpen({ side: 'bottom', align: 'start' });

      expect(result.current.position).toEqual({ top: 120, left: 100 });
    });

    it('should position above trigger for side=top, align=start', () => {
      // trigger: top=100; content height=30 → panel top = 70; left = 100
      const { result } = renderAndOpen({ side: 'top', align: 'start' });

      expect(result.current.position).toEqual({ top: 70, left: 100 });
    });

    it('should position to the right of trigger for side=right, align=start', () => {
      // trigger: left=100, width=50 → panel left = 150; top = 100
      const { result } = renderAndOpen({ side: 'right', align: 'start' });

      expect(result.current.position).toEqual({ top: 100, left: 150 });
    });

    it('should position to the left of trigger for side=left, align=start', () => {
      // trigger: left=100; content width=80 → panel left = 20; top = 100
      const { result } = renderAndOpen({ side: 'left', align: 'start' });

      expect(result.current.position).toEqual({ top: 100, left: 20 });
    });

    it('should apply end alignment offset for side=bottom', () => {
      // trigger width=50, content width=80 → left = 100 + (50 - 80) = 70
      const { result } = renderAndOpen({ side: 'bottom', align: 'end' });

      expect(result.current.position).toEqual({ top: 120, left: 70 });
    });
  });

  describe('collision detection — side', () => {
    it('should flip to first non-colliding side when preferred side collides', () => {
      // Trigger near bottom: top=779, height=20 → bottom space = 800-779-20=1 <
      // 30 Top space = 779 > 30 → 'top' is the first non-colliding side
      // effectiveSide='top': panel top = 779 - 30 = 749; left = 100
      const { result } = renderAndOpen(
        { side: 'bottom', align: 'start', collisionDetection: true },
        { top: 779, left: 100, width: 50, height: 20 },
      );

      expect(result.current.position).toEqual({ top: 749, left: 100 });
    });

    it('should not flip side when collisionDetection is false', () => {
      // Same near-bottom trigger, but no collision detection → side stays
      // 'bottom' panel top = 779 + 20 = 799; left = 100
      const { result } = renderAndOpen(
        { side: 'bottom', align: 'start', collisionDetection: false },
        { top: 779, left: 100, width: 50, height: 20 },
      );

      expect(result.current.position).toEqual({ top: 799, left: 100 });
    });
  });

  describe('collision detection — align', () => {
    it('should flip align from start to end when right edge collides', () => {
      // Trigger at left=950, width=50 → right=1000; right space = 0 < 80 →
      // start collides Left space = 950 > 80 → end doesn't collide →
      // effectiveAlign='end' left = 950 + (50 - 80) = 920
      const { result } = renderAndOpen(
        { side: 'bottom', align: 'start', collisionDetection: true },
        { top: 100, left: 950, width: 50, height: 20 },
      );

      expect(result.current.position).toEqual({ top: 120, left: 920 });
    });

    it('should not flip align when collisionDetection is false', () => {
      const { result } = renderAndOpen(
        { side: 'bottom', align: 'start', collisionDetection: false },
        { top: 100, left: 950, width: 50, height: 20 },
      );

      expect(result.current.position).toEqual({ top: 120, left: 950 });
    });
  });

  describe('collisionDetectionRoot', () => {
    function makeRootElement(rect: {
      top: number;
      left: number;
      width: number;
      height: number;
    }): HTMLElement {
      const el = makeFakeElement(rect);
      Object.defineProperty(el, 'clientWidth', {
        value: rect.width,
        configurable: true,
      });
      Object.defineProperty(el, 'clientHeight', {
        value: rect.height,
        configurable: true,
      });
      return el;
    }

    it('should use root boundary for collision detection instead of viewport', () => {
      // Root: visible area from (50,50) to (450,350) Trigger: top=320,
      // height=20 → bottom space vs root = 350-(320+20)=10 < 30 → bottom
      // collides Top space vs root = 320-50=270 > 30 → 'top' is first
      // non-colliding effectiveSide='top': panel top = 320 - 30 = 290
      const fakeRoot = makeRootElement({
        top: 50,
        left: 50,
        width: 400,
        height: 300,
      });
      const fakeContent = makeFakeElement(CONTENT_RECT);

      mockTriggerRef.current = makeFakeElement({
        top: 320,
        left: 100,
        width: 50,
        height: 20,
      }) as HTMLButtonElement;

      setupMockContext({ collisionDetectionRoot: fakeRoot });
      const { result, rerender } = renderHook(() =>
        useDropdownContent({ side: 'bottom', collisionDetection: true }),
      );
      result.current.contentRef.current = fakeContent as HTMLDivElement;

      setupMockContext({ isOpen: true, collisionDetectionRoot: fakeRoot });
      rerender();

      expect(result.current.position).toEqual({ top: 290, left: 100 });
    });

    it('should add scroll listener on collisionDetectionRoot when open', () => {
      const fakeRoot = makeRootElement({
        top: 0,
        left: 0,
        width: 500,
        height: 500,
      });
      const addListenerSpy = jest.spyOn(fakeRoot, 'addEventListener');

      mockTriggerRef.current = makeFakeElement(
        TRIGGER_RECT,
      ) as HTMLButtonElement;
      setupMockContext({ collisionDetectionRoot: fakeRoot });

      const { result, rerender } = renderHook(() => useDropdownContent({}));
      result.current.contentRef.current = makeFakeElement(
        CONTENT_RECT,
      ) as HTMLDivElement;

      setupMockContext({ isOpen: true, collisionDetectionRoot: fakeRoot });
      rerender();

      expect(addListenerSpy).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function),
      );
    });

    it('should remove scroll listener on collisionDetectionRoot when closed', () => {
      const fakeRoot = makeRootElement({
        top: 0,
        left: 0,
        width: 500,
        height: 500,
      });
      const removeListenerSpy = jest.spyOn(fakeRoot, 'removeEventListener');

      mockTriggerRef.current = makeFakeElement(
        TRIGGER_RECT,
      ) as HTMLButtonElement;
      setupMockContext({ isOpen: true, collisionDetectionRoot: fakeRoot });

      const { result, rerender } = renderHook(() => useDropdownContent({}));
      result.current.contentRef.current = makeFakeElement(
        CONTENT_RECT,
      ) as HTMLDivElement;

      setupMockContext({ isOpen: false, collisionDetectionRoot: fakeRoot });
      rerender();

      expect(removeListenerSpy).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function),
      );
    });
  });

  describe('event listeners', () => {
    it('should add scroll and resize listeners to window when open', () => {
      const addListenerSpy = jest.spyOn(window, 'addEventListener');

      renderAndOpen({});

      expect(addListenerSpy).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function),
        { capture: true },
      );
      expect(addListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
      );
    });

    it('should remove scroll and resize listeners from window when closed', () => {
      const removeListenerSpy = jest.spyOn(window, 'removeEventListener');
      const { rerender } = renderAndOpen({});

      setupMockContext({ isOpen: false });
      rerender();

      expect(removeListenerSpy).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function),
        { capture: true },
      );
      expect(removeListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
      );
    });

    it('should update position on window scroll', () => {
      const { result, fakeTrigger } = renderAndOpen({ side: 'bottom' });

      expect(result.current.position).toEqual({ top: 120, left: 100 });

      jest.spyOn(fakeTrigger, 'getBoundingClientRect').mockReturnValue({
        top: 200,
        left: 100,
        width: 50,
        height: 20,
        right: 150,
        bottom: 220,
        x: 100,
        y: 200,
        toJSON: () => ({}),
      } as DOMRect);

      fireEvent.scroll(window);

      expect(result.current.position).toEqual({ top: 220, left: 100 });
    });

    it('should update position on window resize', () => {
      const { result, fakeTrigger } = renderAndOpen({ side: 'bottom' });

      jest.spyOn(fakeTrigger, 'getBoundingClientRect').mockReturnValue({
        top: 150,
        left: 50,
        width: 50,
        height: 20,
        right: 100,
        bottom: 170,
        x: 50,
        y: 150,
        toJSON: () => ({}),
      } as DOMRect);

      fireEvent(window, new Event('resize'));

      expect(result.current.position).toEqual({ top: 170, left: 50 });
    });
  });

  describe('click outside', () => {
    it('should call close when clicking outside both trigger and content', () => {
      renderAndOpen({});

      const outsideEl = document.createElement('button');
      document.body.appendChild(outsideEl);

      fireEvent.click(outsideEl);

      expect(mockClose).toHaveBeenCalledTimes(1);

      document.body.removeChild(outsideEl);
    });

    it('should not call close when clicking inside content', () => {
      const { fakeContent } = renderAndOpen({});

      document.body.appendChild(fakeContent);

      fireEvent.click(fakeContent);

      expect(mockClose).not.toHaveBeenCalled();

      document.body.removeChild(fakeContent);
    });

    it('should not call close when clicking on trigger', () => {
      const { fakeTrigger } = renderAndOpen({});

      document.body.appendChild(fakeTrigger);

      fireEvent.click(fakeTrigger);

      expect(mockClose).not.toHaveBeenCalled();

      document.body.removeChild(fakeTrigger);
    });

    it('should remove click listener from document when dropdown closes', () => {
      const removeListenerSpy = jest.spyOn(document, 'removeEventListener');
      const { rerender } = renderAndOpen({});

      setupMockContext({ isOpen: false });
      rerender();

      expect(removeListenerSpy).toHaveBeenCalledWith(
        'click',
        expect.any(Function),
      );
    });
  });
});
