import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { carDataSource } from '@/car/dependency/data-source';
import { createMockCarDto } from '@/lib/jest/mock/src/module/car/application/dto/car';

import { useDateExpirationTable } from './use-date-expiration';

const mockCarDataSource = carDataSource as jest.Mocked<typeof carDataSource>;
jest.mock('@/car/dependency/data-source');

const mockAddToast = jest.fn();
jest.mock('@/common/presentation/hook/use-toasts', () => ({
  useToasts: () => ({ addToast: mockAddToast }),
}));

jest.mock('@/car/presentation/ui/badge/badge', () => ({
  CarBadge: () => null,
}));
jest.mock(
  '@/car/presentation/ui/tables/date-expiration/view-button/view-button',
  () => ({
    DateExpirationTableViewButton: () => null,
  }),
);
jest.mock(
  '@/ui/date-expiration-status-icon/date-expiration-status-icon',
  () => ({
    DateExpirationStatusIcon: () => null,
  }),
);

/**
 * Mock useRef so intersectionTargetRef.current is never null, allowing the
 * IntersectionObserver useEffect to run past the early guard
 */
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useRef: () => ({ current: document.createElement('tr') }),
}));

const MOCK_CARS = [createMockCarDto(), createMockCarDto()];
const DEFAULT_PARAMS = {
  label: 'Insurance',
  dateColumn: 'insuranceExpiration' as const,
};

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
    defaultOptions: {
      queries: { retry: false },
    },
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return Wrapper;
}

beforeEach(() => {
  jest.clearAllMocks();
  mockCarDataSource.getByPage.mockResolvedValue({
    success: true,
    data: { data: MOCK_CARS, nextPageParam: null },
  });
});

describe('useDateExpirationTable', () => {
  it('should return isLoading true initially', () => {
    mockCarDataSource.getByPage.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(
      () => useDateExpirationTable(DEFAULT_PARAMS),
      { wrapper: createWrapper() },
    );

    expect(result.current.isLoading).toBe(true);
  });

  it('should return table data after successful fetch', async () => {
    const { result } = renderHook(
      () => useDateExpirationTable(DEFAULT_PARAMS),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(MOCK_CARS);
  });

  it('should call getByPage with correct params', async () => {
    const { result } = renderHook(
      () => useDateExpirationTable(DEFAULT_PARAMS),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockCarDataSource.getByPage).toHaveBeenCalledWith({
      pageParam: 0,
      pageLimit: 6,
      orderBy: { column: DEFAULT_PARAMS.dateColumn, ascending: true },
    });
  });

  it('should return columns array with correct length', async () => {
    const { result } = renderHook(
      () => useDateExpirationTable(DEFAULT_PARAMS),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.columns).toHaveLength(6);
  });

  it('should flatten pages into table data', async () => {
    const PAGE_1 = [createMockCarDto(), createMockCarDto()];
    const PAGE_2 = [createMockCarDto()];

    mockCarDataSource.getByPage
      .mockResolvedValueOnce({
        success: true,
        data: { data: PAGE_1, nextPageParam: 1 },
      })
      .mockResolvedValueOnce({
        success: true,
        data: { data: PAGE_2, nextPageParam: null },
      });

    const { result } = renderHook(
      () => useDateExpirationTable(DEFAULT_PARAMS),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    triggerIntersection(true);

    await waitFor(() =>
      expect(result.current.data).toEqual([...PAGE_1, ...PAGE_2]),
    );
  });

  it('should show error toast when fetch fails', async () => {
    mockCarDataSource.getByPage.mockResolvedValue({
      success: false,
      error: { message: 'DB error' },
    });

    renderHook(() => useDateExpirationTable(DEFAULT_PARAMS), {
      wrapper: createWrapper(),
    });

    await waitFor(() =>
      expect(mockAddToast).toHaveBeenCalledWith('DB error', 'error'),
    );
  });

  it('should fall back to generic message when error has no message', async () => {
    mockCarDataSource.getByPage.mockResolvedValue({
      success: false,
      error: { message: '' },
    });

    renderHook(() => useDateExpirationTable(DEFAULT_PARAMS), {
      wrapper: createWrapper(),
    });

    await waitFor(() =>
      expect(mockAddToast).toHaveBeenCalledWith(
        `Cannot get cars ${DEFAULT_PARAMS.label.toLowerCase()} expiration data.`,
        'error',
      ),
    );
  });

  it('should return empty array when data is undefined', async () => {
    mockCarDataSource.getByPage.mockResolvedValue({
      success: true,
      data: { data: [], nextPageParam: null },
    });

    const { result } = renderHook(
      () => useDateExpirationTable(DEFAULT_PARAMS),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual([]);
  });

  describe('IntersectionObserver', () => {
    it('should call fetchNextPage when target intersects and next page exists', async () => {
      mockCarDataSource.getByPage
        .mockResolvedValueOnce({
          success: true,
          data: { data: MOCK_CARS, nextPageParam: 1 },
        })
        .mockResolvedValueOnce({
          success: true,
          data: { data: [], nextPageParam: null },
        });

      const { result } = renderHook(
        () => useDateExpirationTable(DEFAULT_PARAMS),
        { wrapper: createWrapper() },
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      triggerIntersection(true);

      await waitFor(() =>
        expect(mockCarDataSource.getByPage).toHaveBeenCalledTimes(2),
      );
    });

    it('should not call fetchNextPage when target does not intersect', async () => {
      mockCarDataSource.getByPage.mockResolvedValue({
        success: true,
        data: { data: MOCK_CARS, nextPageParam: 1 },
      });

      const { result } = renderHook(
        () => useDateExpirationTable(DEFAULT_PARAMS),
        { wrapper: createWrapper() },
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      triggerIntersection(false);

      expect(mockCarDataSource.getByPage).toHaveBeenCalledTimes(1);
    });

    it('should disconnect observer on unmount', async () => {
      mockCarDataSource.getByPage.mockResolvedValue({
        success: true,
        data: { data: MOCK_CARS, nextPageParam: 1 },
      });

      const { result, unmount } = renderHook(
        () => useDateExpirationTable(DEFAULT_PARAMS),
        { wrapper: createWrapper() },
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      unmount();

      const instance = (IntersectionObserver as unknown as jest.Mock).mock
        .results[0].value as MockIntersectionObserver;

      expect(instance.disconnect).toHaveBeenCalled();
    });
  });
});
