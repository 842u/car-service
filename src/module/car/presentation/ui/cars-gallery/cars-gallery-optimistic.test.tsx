import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { buildCarDto } from '@/car/application/dto/car.builder';
import { carApiClient } from '@/car/dependency/api-client';
import { carDataSource } from '@/car/dependency/data-source';
import { CARS_INFINITE_QUERY_PAGE_DATA_LIMIT } from '@/car/infrastructure/data-source/car';
import { carAddMutationOptions } from '@/car/presentation/tanstack/mutation/add';
import { carRemoveMutationOptions } from '@/car/presentation/tanstack/mutation/remove';
import { Result } from '@/common/application/result';
import { useInfiniteScrollTrigger } from '@/common/presentation/hook/use-infinite-scroll-trigger';

import { useCarsGallery } from './use-cars-gallery';

const mockCarDataSource = carDataSource as jest.Mocked<typeof carDataSource>;
jest.mock('@/car/dependency/data-source');

const mockCarApiClient = carApiClient as jest.Mocked<typeof carApiClient>;
jest.mock('@/car/dependency/api-client');

jest.mock('@/common/presentation/hook/use-toasts', () => ({
  useToasts: () => ({ addToast: jest.fn() }),
}));

const mockUseInfiniteScrollTrigger = useInfiniteScrollTrigger as jest.Mock;
jest.mock('@/common/presentation/hook/use-infinite-scroll-trigger');

function triggerFetchNextPage() {
  const { calls } = mockUseInfiniteScrollTrigger.mock;
  calls[calls.length - 1][0].fetchNextPage();
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
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
});

describe('cars gallery settled state', () => {
  it('reflects the refetched server truth once an overflowing add settles', async () => {
    const page0Cars = Array.from(
      { length: CARS_INFINITE_QUERY_PAGE_DATA_LIMIT },
      (_, i) => buildCarDto({ id: `p0-${i}` }),
    );
    const page1Cars = [
      buildCarDto({ id: 'p1-0' }),
      buildCarDto({ id: 'p1-1' }),
    ];
    const serverCar = buildCarDto({ id: 'real-id', customName: 'New Car' });

    mockCarDataSource.getByPage
      .mockResolvedValueOnce({
        success: true,
        data: { data: page0Cars, nextPageParam: 1 },
      })
      .mockResolvedValueOnce({
        success: true,
        data: { data: page1Cars, nextPageParam: null },
      })
      .mockResolvedValueOnce({
        success: true,
        data: {
          data: [serverCar, ...page0Cars.slice(0, 14)],
          nextPageParam: 1,
        },
      })
      .mockResolvedValueOnce({
        success: true,
        data: { data: [page0Cars[14], ...page1Cars], nextPageParam: null },
      });

    mockCarApiClient.add.mockResolvedValue(Result.ok(serverCar));

    const wrapper = createWrapper();

    const { result: galleryResult } = renderHook(() => useCarsGallery(), {
      wrapper,
    });
    const { result: mutationResult } = renderHook(
      () => useMutation(carAddMutationOptions),
      { wrapper },
    );

    await waitFor(() => expect(galleryResult.current.isPending).toBe(false));
    triggerFetchNextPage();
    await waitFor(() =>
      expect(galleryResult.current.data).toEqual([...page0Cars, ...page1Cars]),
    );

    mutationResult.current.mutate({ customName: 'New Car' });

    await waitFor(() => {
      expect(galleryResult.current.data).toEqual([
        serverCar,
        ...page0Cars,
        ...page1Cars,
      ]);
    });
  });

  it('reflects the refetched server truth once a page-emptying remove settles', async () => {
    const carA = buildCarDto({ id: 'car-a' });
    const carB = buildCarDto({ id: 'car-b' });
    const carC = buildCarDto({ id: 'car-c' });

    mockCarDataSource.getByPage
      .mockResolvedValueOnce({
        success: true,
        data: { data: [carA, carB], nextPageParam: 1 },
      })
      .mockResolvedValueOnce({
        success: true,
        data: { data: [carC], nextPageParam: null },
      })
      .mockResolvedValueOnce({
        success: true,
        data: { data: [carA, carB], nextPageParam: null },
      })
      .mockResolvedValueOnce({
        success: true,
        data: { data: [], nextPageParam: null },
      });

    mockCarApiClient.remove.mockResolvedValue(Result.ok(null));

    const wrapper = createWrapper();

    const { result: galleryResult } = renderHook(() => useCarsGallery(), {
      wrapper,
    });
    const { result: mutationResult } = renderHook(
      () => useMutation(carRemoveMutationOptions),
      { wrapper },
    );

    await waitFor(() => expect(galleryResult.current.isPending).toBe(false));
    triggerFetchNextPage();
    await waitFor(() =>
      expect(galleryResult.current.data).toEqual([carA, carB, carC]),
    );

    mutationResult.current.mutate('car-c');

    await waitFor(() => {
      expect(galleryResult.current.data).toEqual([carA, carB]);
    });
  });
});
