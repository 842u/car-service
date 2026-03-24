import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { createMockCar } from '@/lib/jest/mock/src/module/car/car';
import { getCarsByPage } from '@/lib/supabase/tables/cars';

import { useCarsGallery } from './use-cars-gallery';

const mockGetCarsByPage = getCarsByPage as jest.MockedFunction<
  typeof getCarsByPage
>;
jest.mock('@/lib/supabase/tables/cars');

const mockAddToast = jest.fn();
jest.mock('@/common/presentation/hook/use-toasts', () => ({
  useToasts: () => ({ addToast: mockAddToast }),
}));

/**
 * Mock useRef so intersectionTargetRef.current is never null, allowing the
 * IntersectionObserver useEffect to run past the early guard
 */
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useRef: () => ({ current: document.createElement('div') }),
}));

/**
 * 1. IntersectionObserver is replaced with a jest.fn() in globalThis setup, so
 *    every call to `new IntersectionObserver(callback)` is tracked by Jest.
 * 2. `.mock.results[0].value` retrieves the MockIntersectionObserver instance
 *    returned by that call the same instance the hook holds internally, with
 *    the callback attached via its constructor.
 * 3. Invoke that callback manually with a minimal IntersectionObserverEntry,
 *    simulating exactly what the browser would do when the observed element
 *    intersects the viewport.
 */
function triggerIntersection(isIntersecting: boolean) {
  const instance = (IntersectionObserver as unknown as jest.Mock).mock
    .results[0].value as MockIntersectionObserver;

  instance.callback(
    [{ isIntersecting } as IntersectionObserverEntry],
    instance,
  );
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return Wrapper;
}

const MOCK_CARS = [createMockCar(), createMockCar()];

beforeEach(() => {
  jest.clearAllMocks();
  mockGetCarsByPage.mockResolvedValue({
    data: MOCK_CARS,
    nextPageParam: null,
  });
});

describe('useCarsGallery', () => {
  it('should return isPending true initially', () => {
    mockGetCarsByPage.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useCarsGallery(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(true);
  });

  it('should return car data after successful fetch', async () => {
    const { result } = renderHook(() => useCarsGallery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(result.current.data).toEqual(MOCK_CARS);
  });

  it('should call getCarsByPage with correct params', async () => {
    const { result } = renderHook(() => useCarsGallery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(mockGetCarsByPage).toHaveBeenCalledWith({ pageParam: 0 });
  });

  it('should flatten pages into gallery data', async () => {
    const PAGE_1 = [createMockCar(), createMockCar()];
    const PAGE_2 = [createMockCar()];

    mockGetCarsByPage
      .mockResolvedValueOnce({ data: PAGE_1, nextPageParam: 1 })
      .mockResolvedValueOnce({ data: PAGE_2, nextPageParam: null });

    const { result } = renderHook(() => useCarsGallery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));
    triggerIntersection(true);

    await waitFor(() =>
      expect(result.current.data).toEqual([...PAGE_1, ...PAGE_2]),
    );
  });

  it('should return empty array when data is undefined', async () => {
    mockGetCarsByPage.mockResolvedValue({ data: [], nextPageParam: null });

    const { result } = renderHook(() => useCarsGallery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(result.current.data).toEqual([]);
  });

  it('should show error toast when fetch fails', async () => {
    mockGetCarsByPage.mockRejectedValue(new Error('DB error'));

    renderHook(() => useCarsGallery(), { wrapper: createWrapper() });

    await waitFor(() =>
      expect(mockAddToast).toHaveBeenCalledWith('DB error', 'error'),
    );
  });

  describe('IntersectionObserver', () => {
    it('should call fetchNextPage when target intersects and next page exists', async () => {
      mockGetCarsByPage
        .mockResolvedValueOnce({ data: MOCK_CARS, nextPageParam: 1 })
        .mockResolvedValueOnce({ data: [], nextPageParam: null });

      const { result } = renderHook(() => useCarsGallery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isPending).toBe(false));

      triggerIntersection(true);

      await waitFor(() => expect(mockGetCarsByPage).toHaveBeenCalledTimes(2));
    });

    it('should not call fetchNextPage when target does not intersect', async () => {
      mockGetCarsByPage.mockResolvedValue({
        data: MOCK_CARS,
        nextPageParam: 1,
      });

      const { result } = renderHook(() => useCarsGallery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isPending).toBe(false));

      triggerIntersection(false);

      expect(mockGetCarsByPage).toHaveBeenCalledTimes(1);
    });

    it('should disconnect observer on unmount', async () => {
      mockGetCarsByPage.mockResolvedValue({
        data: MOCK_CARS,
        nextPageParam: 1,
      });

      const { result, unmount } = renderHook(() => useCarsGallery(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isPending).toBe(false));

      unmount();

      const instance = (IntersectionObserver as unknown as jest.Mock).mock
        .results[0].value as MockIntersectionObserver;

      expect(instance.disconnect).toHaveBeenCalled();
    });
  });
});
