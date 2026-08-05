import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { buildCarDto } from '@/car/application/dto/car.builder';
import { carApiClient } from '@/car/dependency/api-client';
import { carEditMutationOptions } from '@/car/presentation/tanstack/mutation/edit';
import type { CarsInfiniteQueryData } from '@/car/presentation/tanstack/mutation/shared/infinite-query-data';
import { buildCarsInfiniteQueryData } from '@/car/presentation/tanstack/mutation/shared/infinite-query-data.fixture';
import { queryKeys } from '@/car/presentation/tanstack/query/keys';
import { Result } from '@/common/application/result';
import { browserStorageClient } from '@/dependency/storage-client/browser';

const mockCarApiClient = carApiClient as jest.Mocked<typeof carApiClient>;
jest.mock('@/car/dependency/api-client');

const mockBrowserStorageClient = browserStorageClient as jest.Mocked<
  typeof browserStorageClient
>;
jest.mock('@/dependency/storage-client/browser');

jest.mock('@/lib/utils', () => ({ hashFile: () => Promise.resolve('hash') }));

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

describe('carEditMutationOptions', () => {
  it('optimistically patches the car and captures the previous data', async () => {
    const previousCar = buildCarDto({ id: 'car-1', customName: 'Old Name' });

    mockCarApiClient.edit.mockReturnValue(new Promise(() => {}));

    const wrapper = createWrapper();
    queryClient.setQueryData(queryKeys.byId('car-1'), previousCar);
    queryClient.setQueryData(
      queryKeys.infinite(),
      buildCarsInfiniteQueryData([[previousCar]]),
    );

    const { result } = renderHook(() => useMutation(carEditMutationOptions), {
      wrapper,
    });

    result.current.mutate({ carId: 'car-1', customName: 'New Name' });

    await waitFor(() => {
      expect(queryClient.getQueryData(queryKeys.byId('car-1'))).toEqual({
        ...previousCar,
        customName: 'New Name',
      });

      const data = queryClient.getQueryData<CarsInfiniteQueryData>(
        queryKeys.infinite(),
      );

      expect(data?.pages[0].data[0]).toMatchObject({
        customName: 'New Name',
      });
    });
  });

  it('rolls back the car and infinite data on a plain edit failure', async () => {
    const previousCar = buildCarDto({ id: 'car-1', customName: 'Old Name' });
    const infiniteData = buildCarsInfiniteQueryData([[previousCar]]);

    mockCarApiClient.edit.mockResolvedValue(
      Result.fail({ message: 'Edit failed' }),
    );

    const wrapper = createWrapper();
    queryClient.setQueryData(queryKeys.byId('car-1'), previousCar);
    queryClient.setQueryData(queryKeys.infinite(), infiniteData);

    const { result } = renderHook(() => useMutation(carEditMutationOptions), {
      wrapper,
    });

    await expect(
      result.current.mutateAsync({ carId: 'car-1', customName: 'New Name' }),
    ).rejects.toThrow('Edit failed');

    await waitFor(() => {
      expect(queryClient.getQueryData(queryKeys.byId('car-1'))).toEqual(
        previousCar,
      );
      expect(queryClient.getQueryData(queryKeys.infinite())).toEqual(
        infiniteData,
      );
    });
  });

  it('patches only the target car when editing the middle of a multi-car page', async () => {
    const car0 = buildCarDto({ id: 'car-0' });
    const car1 = buildCarDto({ id: 'car-1', customName: 'Old Name' });
    const car2 = buildCarDto({ id: 'car-2' });

    mockCarApiClient.edit.mockReturnValue(new Promise(() => {}));

    const wrapper = createWrapper();
    queryClient.setQueryData(
      queryKeys.infinite(),
      buildCarsInfiniteQueryData([[car0, car1, car2]]),
    );

    const { result } = renderHook(() => useMutation(carEditMutationOptions), {
      wrapper,
    });

    result.current.mutate({ carId: 'car-1', customName: 'New Name' });

    await waitFor(() => {
      const data = queryClient.getQueryData<CarsInfiniteQueryData>(
        queryKeys.infinite(),
      );

      expect(data?.pages[0].data).toEqual([
        car0,
        { ...car1, customName: 'New Name' },
        car2,
      ]);
    });
  });

  it('rolls back a multi-car page to its previous state on edit failure', async () => {
    const car0 = buildCarDto({ id: 'car-0' });
    const car1 = buildCarDto({ id: 'car-1', customName: 'Old Name' });
    const car2 = buildCarDto({ id: 'car-2' });
    const infiniteData = buildCarsInfiniteQueryData([[car0, car1, car2]]);

    mockCarApiClient.edit.mockResolvedValue(
      Result.fail({ message: 'Edit failed' }),
    );

    const wrapper = createWrapper();
    queryClient.setQueryData(queryKeys.infinite(), infiniteData);

    const { result } = renderHook(() => useMutation(carEditMutationOptions), {
      wrapper,
    });

    await expect(
      result.current.mutateAsync({ carId: 'car-1', customName: 'New Name' }),
    ).rejects.toThrow('Edit failed');

    await waitFor(() => {
      expect(queryClient.getQueryData(queryKeys.infinite())).toEqual(
        infiniteData,
      );
    });
  });

  it('patches only the target car when editing a car on a non-first page', async () => {
    const car0 = buildCarDto({ id: 'car-0' });
    const car1 = buildCarDto({ id: 'car-1' });
    const car2 = buildCarDto({ id: 'car-2', customName: 'Old Name' });
    const car3 = buildCarDto({ id: 'car-3' });

    mockCarApiClient.edit.mockReturnValue(new Promise(() => {}));

    const wrapper = createWrapper();
    queryClient.setQueryData(
      queryKeys.infinite(),
      buildCarsInfiniteQueryData([
        [car0, car1],
        [car2, car3],
      ]),
    );

    const { result } = renderHook(() => useMutation(carEditMutationOptions), {
      wrapper,
    });

    result.current.mutate({ carId: 'car-2', customName: 'New Name' });

    await waitFor(() => {
      const data = queryClient.getQueryData<CarsInfiniteQueryData>(
        queryKeys.infinite(),
      );

      expect(data?.pages[1].data).toEqual([
        { ...car2, customName: 'New Name' },
        car3,
      ]);
    });

    const data = queryClient.getQueryData<CarsInfiniteQueryData>(
      queryKeys.infinite(),
    );

    expect(data?.pages[0].data).toEqual([car0, car1]);
  });

  it('rolls back all pages to their previous state when editing a non-first page errors', async () => {
    const car0 = buildCarDto({ id: 'car-0' });
    const car1 = buildCarDto({ id: 'car-1' });
    const car2 = buildCarDto({ id: 'car-2', customName: 'Old Name' });
    const car3 = buildCarDto({ id: 'car-3' });
    const infiniteData = buildCarsInfiniteQueryData([
      [car0, car1],
      [car2, car3],
    ]);

    mockCarApiClient.edit.mockResolvedValue(
      Result.fail({ message: 'Edit failed' }),
    );

    const wrapper = createWrapper();
    queryClient.setQueryData(queryKeys.infinite(), infiniteData);

    const { result } = renderHook(() => useMutation(carEditMutationOptions), {
      wrapper,
    });

    await expect(
      result.current.mutateAsync({ carId: 'car-2', customName: 'New Name' }),
    ).rejects.toThrow('Edit failed');

    await waitFor(() => {
      expect(queryClient.getQueryData(queryKeys.infinite())).toEqual(
        infiniteData,
      );
    });
  });

  it('rolls back the car image when an attachImage-style upload fails', async () => {
    const previousCar = buildCarDto({
      id: 'car-1',
      imageUrl: 'https://example.com/old.png',
    });
    const image = new File(['content'], 'car.png', { type: 'image/png' });

    mockBrowserStorageClient.upload.mockResolvedValue(
      Result.fail({ message: 'Upload failed' }),
    );

    const wrapper = createWrapper();
    queryClient.setQueryData(queryKeys.byId('car-1'), previousCar);

    const { result } = renderHook(() => useMutation(carEditMutationOptions), {
      wrapper,
    });

    await expect(
      result.current.mutateAsync({ carId: 'car-1', image }),
    ).rejects.toThrow('The image failed to upload: Upload failed');

    await waitFor(() => {
      expect(queryClient.getQueryData(queryKeys.byId('car-1'))).toEqual(
        previousCar,
      );
    });
  });

  it('revokes the optimistic image object URL once the mutation settles', async () => {
    const previousCar = buildCarDto({ id: 'car-1' });
    const image = new File(['content'], 'car.png', { type: 'image/png' });

    mockBrowserStorageClient.upload.mockResolvedValue(
      Result.ok({
        id: '1',
        path: 'car-1/hash',
        fullPath: 'cars_images/car-1/hash',
      }),
    );
    mockCarApiClient.edit.mockResolvedValue(
      Result.ok(buildCarDto({ id: 'car-1' })),
    );

    const wrapper = createWrapper();
    const revokeObjectURLSpy = jest.spyOn(URL, 'revokeObjectURL');
    queryClient.setQueryData(queryKeys.byId('car-1'), previousCar);

    const { result } = renderHook(() => useMutation(carEditMutationOptions), {
      wrapper,
    });

    await result.current.mutateAsync({ carId: 'car-1', image });

    expect(revokeObjectURLSpy).toHaveBeenCalledWith(
      'blob:test/12345678-1234-4234-8234-123456789012',
    );
  });

  it('invalidates the car and infinite queries once the mutation settles', async () => {
    mockCarApiClient.edit.mockResolvedValue(
      Result.ok(buildCarDto({ id: 'car-1', customName: 'New Name' })),
    );

    const wrapper = createWrapper();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useMutation(carEditMutationOptions), {
      wrapper,
    });

    await result.current.mutateAsync({
      carId: 'car-1',
      customName: 'New Name',
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: queryKeys.byId('car-1'),
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: queryKeys.infinite(),
    });
  });
});
