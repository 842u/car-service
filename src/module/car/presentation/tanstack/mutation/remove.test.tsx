import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { buildCarDto } from '@/car/application/dto/car.builder';
import { carApiClient } from '@/car/dependency/api-client';
import { carRemoveMutationOptions } from '@/car/presentation/tanstack/mutation/remove';
import type { CarsInfiniteQueryData } from '@/car/presentation/tanstack/mutation/shared/infinite-query-data';
import { buildCarsInfiniteQueryData } from '@/car/presentation/tanstack/mutation/shared/infinite-query-data.fixture';
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

describe('carRemoveMutationOptions', () => {
  it('optimistically removes the car from the infinite query data', async () => {
    const car = buildCarDto({ id: 'car-1' });

    mockCarApiClient.remove.mockReturnValue(new Promise(() => {}));

    const wrapper = createWrapper();
    queryClient.setQueryData(
      queryKeys.infinite(),
      buildCarsInfiniteQueryData([[car]]),
    );

    const { result } = renderHook(() => useMutation(carRemoveMutationOptions), {
      wrapper,
    });

    result.current.mutate('car-1');

    await waitFor(() => {
      const data = queryClient.getQueryData<CarsInfiniteQueryData>(
        queryKeys.infinite(),
      );

      expect(data?.pages[0].data[0]).toBeNull();
    });
  });

  it('restores the removed car to the infinite query data on error', async () => {
    const car = buildCarDto({ id: 'car-1' });

    mockCarApiClient.remove.mockResolvedValue(
      Result.fail({ message: 'Remove failed' }),
    );

    const wrapper = createWrapper();
    queryClient.setQueryData(
      queryKeys.infinite(),
      buildCarsInfiniteQueryData([[car]]),
    );

    const { result } = renderHook(() => useMutation(carRemoveMutationOptions), {
      wrapper,
    });

    await expect(result.current.mutateAsync('car-1')).rejects.toThrow(
      'Remove failed',
    );

    await waitFor(() => {
      const data = queryClient.getQueryData<CarsInfiniteQueryData>(
        queryKeys.infinite(),
      );

      expect(data?.pages[0].data[0]).toEqual(car);
    });
  });

  it('removes the byId cache entry and invalidates the infinite query once the mutation settles', async () => {
    const car = buildCarDto({ id: 'car-1' });

    mockCarApiClient.remove.mockResolvedValue(Result.ok(null));

    const wrapper = createWrapper();
    queryClient.setQueryData(
      queryKeys.infinite(),
      buildCarsInfiniteQueryData([[car]]),
    );
    queryClient.setQueryData(queryKeys.byId('car-1'), car);

    const removeSpy = jest.spyOn(queryClient, 'removeQueries');
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useMutation(carRemoveMutationOptions), {
      wrapper,
    });

    await result.current.mutateAsync('car-1');

    expect(removeSpy).toHaveBeenCalledWith({
      queryKey: queryKeys.byId('car-1'),
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: queryKeys.infinite(),
    });
  });

  it('nulls only the removed car when removing from the middle of a multi-car page', async () => {
    const car0 = buildCarDto({ id: 'car-0' });
    const car1 = buildCarDto({ id: 'car-1' });
    const car2 = buildCarDto({ id: 'car-2' });

    mockCarApiClient.remove.mockReturnValue(new Promise(() => {}));

    const wrapper = createWrapper();
    queryClient.setQueryData(
      queryKeys.infinite(),
      buildCarsInfiniteQueryData([[car0, car1, car2]]),
    );

    const { result } = renderHook(() => useMutation(carRemoveMutationOptions), {
      wrapper,
    });

    result.current.mutate('car-1');

    await waitFor(() => {
      const data = queryClient.getQueryData<CarsInfiniteQueryData>(
        queryKeys.infinite(),
      );

      expect(data?.pages[0].data).toEqual([car0, null, car2]);
    });
  });

  it('restores the car to its exact index when removing from the middle of a multi-car page errors', async () => {
    const car0 = buildCarDto({ id: 'car-0' });
    const car1 = buildCarDto({ id: 'car-1' });
    const car2 = buildCarDto({ id: 'car-2' });

    mockCarApiClient.remove.mockResolvedValue(
      Result.fail({ message: 'Remove failed' }),
    );

    const wrapper = createWrapper();
    queryClient.setQueryData(
      queryKeys.infinite(),
      buildCarsInfiniteQueryData([[car0, car1, car2]]),
    );

    const { result } = renderHook(() => useMutation(carRemoveMutationOptions), {
      wrapper,
    });

    await expect(result.current.mutateAsync('car-1')).rejects.toThrow(
      'Remove failed',
    );

    await waitFor(() => {
      const data = queryClient.getQueryData<CarsInfiniteQueryData>(
        queryKeys.infinite(),
      );

      expect(data?.pages[0].data).toEqual([car0, car1, car2]);
    });
  });

  it('nulls the matching slot on the page the car actually lives on', async () => {
    const car0 = buildCarDto({ id: 'car-0' });
    const car1 = buildCarDto({ id: 'car-1' });
    const car2 = buildCarDto({ id: 'car-2' });
    const car3 = buildCarDto({ id: 'car-3' });

    mockCarApiClient.remove.mockReturnValue(new Promise(() => {}));

    const wrapper = createWrapper();
    queryClient.setQueryData(
      queryKeys.infinite(),
      buildCarsInfiniteQueryData([
        [car0, car1],
        [car2, car3],
      ]),
    );

    const { result } = renderHook(() => useMutation(carRemoveMutationOptions), {
      wrapper,
    });

    result.current.mutate('car-2');

    await waitFor(() => {
      const data = queryClient.getQueryData<CarsInfiniteQueryData>(
        queryKeys.infinite(),
      );

      expect(data?.pages[1].data).toEqual([null, car3]);
    });

    const data = queryClient.getQueryData<CarsInfiniteQueryData>(
      queryKeys.infinite(),
    );

    expect(data?.pages[0].data).toEqual([car0, car1]);
  });

  it('restores the car to its original page and slot, not page 0, when a later-page removal errors', async () => {
    const car0 = buildCarDto({ id: 'car-0' });
    const car1 = buildCarDto({ id: 'car-1' });
    const car2 = buildCarDto({ id: 'car-2' });
    const car3 = buildCarDto({ id: 'car-3' });

    mockCarApiClient.remove.mockResolvedValue(
      Result.fail({ message: 'Remove failed' }),
    );

    const wrapper = createWrapper();
    queryClient.setQueryData(
      queryKeys.infinite(),
      buildCarsInfiniteQueryData([
        [car0, car1],
        [car2, car3],
      ]),
    );

    const { result } = renderHook(() => useMutation(carRemoveMutationOptions), {
      wrapper,
    });

    await expect(result.current.mutateAsync('car-2')).rejects.toThrow(
      'Remove failed',
    );

    await waitFor(() => {
      const data = queryClient.getQueryData<CarsInfiniteQueryData>(
        queryKeys.infinite(),
      );

      expect(data?.pages[1].data).toEqual([car2, car3]);
    });

    const data = queryClient.getQueryData<CarsInfiniteQueryData>(
      queryKeys.infinite(),
    );

    expect(data?.pages[0].data).toEqual([car0, car1]);
  });
});
