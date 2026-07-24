import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { buildCarDto } from '@/car/application/dto/car.builder';
import { carDataSource } from '@/car/dependency/data-source';
import { queryKeys } from '@/car/presentation/tanstack/query/keys';
import { useInfiniteScrollTrigger } from '@/common/presentation/hook/use-infinite-scroll-trigger';
import { queryKeySerialize } from '@/common/presentation/tanstack/query-key';

import { useCarsGallery } from './use-cars-gallery';

const mockCarDataSource = carDataSource as jest.Mocked<typeof carDataSource>;
jest.mock('@/car/dependency/data-source');

const mockAddToast = jest.fn();
jest.mock('@/common/presentation/hook/use-toasts', () => ({
  useToasts: () => ({ addToast: mockAddToast }),
}));

const mockUseInfiniteScrollTrigger = useInfiniteScrollTrigger as jest.Mock;
jest.mock('@/common/presentation/hook/use-infinite-scroll-trigger');

function triggerFetchNextPage() {
  const { calls } = mockUseInfiniteScrollTrigger.mock;
  calls[calls.length - 1][0].fetchNextPage();
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

const MOCK_CARS = [buildCarDto(), buildCarDto()];

beforeEach(() => {
  jest.clearAllMocks();
  mockCarDataSource.getByPage.mockResolvedValue({
    success: true,
    data: { data: MOCK_CARS, nextPageParam: null },
  });
});

describe('useCarsGallery', () => {
  it('should return isPending true initially', () => {
    mockCarDataSource.getByPage.mockReturnValue(new Promise(() => {}));

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

  it('should call getByPage with correct params', async () => {
    const { result } = renderHook(() => useCarsGallery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(mockCarDataSource.getByPage).toHaveBeenCalledWith({
      pageParam: 0,
      pageLimit: undefined,
      orderBy: undefined,
    });
  });

  it('should flatten pages into gallery data', async () => {
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

    const { result } = renderHook(() => useCarsGallery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));
    triggerFetchNextPage();

    await waitFor(() =>
      expect(result.current.data).toEqual([...PAGE_1, ...PAGE_2]),
    );
  });

  it('should return empty array when data is undefined', async () => {
    mockCarDataSource.getByPage.mockResolvedValue({
      success: true,
      data: { data: [], nextPageParam: null },
    });

    const { result } = renderHook(() => useCarsGallery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(result.current.data).toEqual([]);
  });

  it('should show error toast when fetch fails', async () => {
    mockCarDataSource.getByPage.mockResolvedValue({
      success: false,
      error: { message: 'DB error' },
    });

    renderHook(() => useCarsGallery(), { wrapper: createWrapper() });

    await waitFor(() =>
      expect(mockAddToast).toHaveBeenCalledWith(
        'DB error',
        'error',
        queryKeySerialize(queryKeys.infinite()),
      ),
    );
  });
});
