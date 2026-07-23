import { renderHook } from '@testing-library/react';

import { useInfiniteScrollTrigger } from './use-infinite-scroll-trigger';

/**
 * Mock useRef so intersectionTargetRef.current is never null, allowing the
 * IntersectionObserver effect to run past the early guard.
 */
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useRef: () => ({ current: document.createElement('div') }),
}));

/**
 * IntersectionObserver is replaced with a jest.fn() in globalThis setup, so
 * every call to `new IntersectionObserver(callback)` is tracked by Jest.
 * `.mock.results[0].value` retrieves the MockIntersectionObserver instance
 * that call returned, the same instance the hook holds internally, letting
 * its callback be invoked manually as the browser would on intersection.
 */
function triggerIntersection(isIntersecting: boolean) {
  const instance = (IntersectionObserver as unknown as jest.Mock).mock
    .results[0].value as MockIntersectionObserver;

  instance.callback(
    [{ isIntersecting } as IntersectionObserverEntry],
    instance,
  );
}

const DEFAULT_OPTIONS = {
  hasNextPage: true,
  isFetching: false,
  isFetchingNextPage: false,
  isSuccess: true,
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useInfiniteScrollTrigger', () => {
  it('calls fetchNextPage when the target intersects and is eligible', () => {
    const fetchNextPage = jest.fn();

    renderHook(() =>
      useInfiniteScrollTrigger({ ...DEFAULT_OPTIONS, fetchNextPage }),
    );

    triggerIntersection(true);

    expect(fetchNextPage).toHaveBeenCalledTimes(1);
  });

  it('does not call fetchNextPage when the target does not intersect', () => {
    const fetchNextPage = jest.fn();

    renderHook(() =>
      useInfiniteScrollTrigger({ ...DEFAULT_OPTIONS, fetchNextPage }),
    );

    triggerIntersection(false);

    expect(fetchNextPage).not.toHaveBeenCalled();
  });

  it('does not call fetchNextPage when already fetching', () => {
    const fetchNextPage = jest.fn();

    renderHook(() =>
      useInfiniteScrollTrigger({
        ...DEFAULT_OPTIONS,
        fetchNextPage,
        isFetching: true,
      }),
    );

    triggerIntersection(true);

    expect(fetchNextPage).not.toHaveBeenCalled();
  });

  it('does not call fetchNextPage when already fetching the next page', () => {
    const fetchNextPage = jest.fn();

    renderHook(() =>
      useInfiniteScrollTrigger({
        ...DEFAULT_OPTIONS,
        fetchNextPage,
        isFetchingNextPage: true,
      }),
    );

    triggerIntersection(true);

    expect(fetchNextPage).not.toHaveBeenCalled();
  });

  it('does not observe when there is no next page', () => {
    const fetchNextPage = jest.fn();

    renderHook(() =>
      useInfiniteScrollTrigger({
        ...DEFAULT_OPTIONS,
        fetchNextPage,
        hasNextPage: false,
      }),
    );

    expect(IntersectionObserver).not.toHaveBeenCalled();
  });

  it('disconnects the observer on unmount', () => {
    const { unmount } = renderHook(() =>
      useInfiniteScrollTrigger({
        ...DEFAULT_OPTIONS,
        fetchNextPage: jest.fn(),
      }),
    );

    unmount();

    const instance = (IntersectionObserver as unknown as jest.Mock).mock
      .results[0].value as MockIntersectionObserver;

    expect(instance.disconnect).toHaveBeenCalled();
  });

  it('passes the threshold option to the observer', () => {
    renderHook(() =>
      useInfiniteScrollTrigger({
        ...DEFAULT_OPTIONS,
        fetchNextPage: jest.fn(),
        threshold: 0.5,
      }),
    );

    expect(IntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
      threshold: 0.5,
    });
  });
});
