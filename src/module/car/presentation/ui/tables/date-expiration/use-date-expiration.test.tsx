import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { buildCarDto } from '@/car/application/dto/car.builder';
import { carDataSource } from '@/car/dependency/data-source';
import { useInfiniteScrollTrigger } from '@/common/presentation/hook/use-infinite-scroll-trigger';

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

const mockUseInfiniteScrollTrigger = useInfiniteScrollTrigger as jest.Mock;
jest.mock('@/common/presentation/hook/use-infinite-scroll-trigger');

function triggerFetchNextPage() {
  const { calls } = mockUseInfiniteScrollTrigger.mock;
  calls[calls.length - 1][0].fetchNextPage();
}

const MOCK_CARS = [buildCarDto(), buildCarDto()];
const DEFAULT_PARAMS = {
  label: 'Insurance',
  dateColumn: 'insuranceExpiration' as const,
};

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
    const PAGE_1 = [buildCarDto(), buildCarDto()];
    const PAGE_2 = [buildCarDto()];

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
    triggerFetchNextPage();

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
});
