import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { buildCarDto } from '@/car/application/dto/car.builder';
import { carApiClient } from '@/car/dependency/api-client';
import { carAddMutationOptions } from '@/car/presentation/tanstack/mutation-options/add';
import type { CarsInfiniteQueryData } from '@/car/presentation/tanstack/mutation-options/shared/infinite-query-data';
import { queryKeys } from '@/car/presentation/tanstack/query/keys';
import { Result } from '@/common/application/result';

const mockCarApiClient = carApiClient as jest.Mocked<typeof carApiClient>;
jest.mock('@/car/dependency/api-client');

let queryClient: QueryClient;

function createWrapper() {
  queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
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

describe('carAddMutationOptions', () => {
  it('optimistically adds the car to the infinite query data', async () => {
    mockCarApiClient.add.mockReturnValue(new Promise(() => {}));

    const wrapper = createWrapper();

    const { result } = renderHook(
      () => useMutation(carAddMutationOptions(queryClient)),
      { wrapper },
    );

    result.current.mutate({ customName: 'New Car' });

    await waitFor(() => {
      const data = queryClient.getQueryData<CarsInfiniteQueryData>(
        queryKeys.infinite(),
      );

      expect(data?.pages[0].data[0]).toMatchObject({ customName: 'New Car' });
    });
  });

  it('removes the optimistically added car on error', async () => {
    mockCarApiClient.add.mockResolvedValue(
      Result.fail({ message: 'Add failed' }),
    );

    const wrapper = createWrapper();

    const { result } = renderHook(
      () => useMutation(carAddMutationOptions(queryClient)),
      { wrapper },
    );

    await expect(
      result.current.mutateAsync({ customName: 'New Car' }),
    ).rejects.toThrow('Add failed');

    await waitFor(() => {
      const data = queryClient.getQueryData<CarsInfiniteQueryData>(
        queryKeys.infinite(),
      );

      expect(data).toBeUndefined();
    });
  });

  it('restores the car carried over to the next page when the insert overflows the page limit and the mutation errors', async () => {
    mockCarApiClient.add.mockResolvedValue(
      Result.fail({ message: 'Add failed' }),
    );

    const wrapper = createWrapper();

    const page0Cars = Array.from({ length: 15 }, (_, i) =>
      buildCarDto({ id: `p0-${i}` }),
    );
    const page1Cars = [
      buildCarDto({ id: 'p1-0' }),
      buildCarDto({ id: 'p1-1' }),
    ];

    queryClient.setQueryData(queryKeys.infinite(), {
      pages: [
        { data: page0Cars, nextPageParam: 1 },
        { data: page1Cars, nextPageParam: null },
      ],
      pageParams: [0, 1],
    } satisfies CarsInfiniteQueryData);

    const { result } = renderHook(
      () => useMutation(carAddMutationOptions(queryClient)),
      { wrapper },
    );

    await expect(
      result.current.mutateAsync({ customName: 'New Car' }),
    ).rejects.toThrow('Add failed');

    await waitFor(() => {
      const data = queryClient.getQueryData<CarsInfiniteQueryData>(
        queryKeys.infinite(),
      );

      expect(data?.pages[0].data).toEqual(page0Cars);
    });

    const data = queryClient.getQueryData<CarsInfiniteQueryData>(
      queryKeys.infinite(),
    );

    expect(data?.pages[1].data).toEqual(page1Cars);
  });

  it('revokes the optimistic image object URL once the mutation settles', async () => {
    mockCarApiClient.add.mockResolvedValue(
      Result.ok(buildCarDto({ customName: 'New Car' })),
    );

    const wrapper = createWrapper();
    const revokeObjectURLSpy = jest.spyOn(URL, 'revokeObjectURL');
    const image = new File(['content'], 'car.png', { type: 'image/png' });

    const { result } = renderHook(
      () => useMutation(carAddMutationOptions(queryClient)),
      { wrapper },
    );

    await result.current.mutateAsync({ customName: 'New Car', image });

    expect(revokeObjectURLSpy).toHaveBeenCalledWith(
      'blob:test/12345678-1234-4234-8234-123456789012',
    );
  });

  it('reconciles the optimistic entry with the real server car on success', async () => {
    const serverCar = buildCarDto({ id: 'real-id', customName: 'New Car' });

    mockCarApiClient.add.mockResolvedValue(Result.ok(serverCar));

    const wrapper = createWrapper();

    const { result } = renderHook(
      () => useMutation(carAddMutationOptions(queryClient)),
      { wrapper },
    );

    await result.current.mutateAsync({ customName: 'New Car' });

    const data = queryClient.getQueryData<CarsInfiniteQueryData>(
      queryKeys.infinite(),
    );

    expect(data?.pages[0].data).toEqual([serverCar]);
  });

  it('keeps showing the optimistic image preview after reconciling with the real server car', async () => {
    const serverCar = buildCarDto({
      id: 'real-id',
      customName: 'New Car',
      imageUrl: null,
    });

    mockCarApiClient.add.mockResolvedValue(Result.ok(serverCar));

    const wrapper = createWrapper();
    const image = new File(['content'], 'car.png', { type: 'image/png' });

    const { result } = renderHook(
      () => useMutation(carAddMutationOptions(queryClient)),
      { wrapper },
    );

    await result.current.mutateAsync({ customName: 'New Car', image });

    const data = queryClient.getQueryData<CarsInfiniteQueryData>(
      queryKeys.infinite(),
    );

    expect(data?.pages[0].data[0]).toMatchObject({
      id: 'real-id',
      imageUrl: 'blob:test/12345678-1234-4234-8234-123456789012',
    });
  });
});
