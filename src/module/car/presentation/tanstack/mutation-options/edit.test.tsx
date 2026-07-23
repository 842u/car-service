import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { buildCarDto } from '@/car/application/dto/car.builder';
import { carApiClient } from '@/car/dependency/api-client';
import { carEditMutationOptions } from '@/car/presentation/tanstack/mutation-options/edit';
import type { CarsInfiniteQueryData } from '@/car/presentation/tanstack/mutation-options/shared/infinite-query-data';
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
    const infiniteData: CarsInfiniteQueryData = {
      pages: [{ data: [previousCar], nextPageParam: null }],
      pageParams: [0],
    };

    mockCarApiClient.edit.mockReturnValue(new Promise(() => {}));

    const wrapper = createWrapper();
    queryClient.setQueryData(queryKeys.byId('car-1'), previousCar);
    queryClient.setQueryData(queryKeys.infinite(), infiniteData);

    const { result } = renderHook(
      () => useMutation(carEditMutationOptions(queryClient)),
      { wrapper },
    );

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
    const infiniteData: CarsInfiniteQueryData = {
      pages: [{ data: [previousCar], nextPageParam: null }],
      pageParams: [0],
    };

    mockCarApiClient.edit.mockResolvedValue(
      Result.fail({ message: 'Edit failed' }),
    );

    const wrapper = createWrapper();
    queryClient.setQueryData(queryKeys.byId('car-1'), previousCar);
    queryClient.setQueryData(queryKeys.infinite(), infiniteData);

    const { result } = renderHook(
      () => useMutation(carEditMutationOptions(queryClient)),
      { wrapper },
    );

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

    const { result } = renderHook(
      () => useMutation(carEditMutationOptions(queryClient)),
      { wrapper },
    );

    await expect(
      result.current.mutateAsync({ carId: 'car-1', image }),
    ).rejects.toThrow('The image failed to upload: Upload failed');

    await waitFor(() => {
      expect(queryClient.getQueryData(queryKeys.byId('car-1'))).toEqual(
        previousCar,
      );
    });
  });
});
