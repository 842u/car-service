import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { buildServiceLogDto } from '@/car/service-log/application/dto/service-log.builder';
import { serviceLogApiClient } from '@/car/service-log/dependency/api-client';
import { serviceLogAddMutationOptions } from '@/car/service-log/presentation/tanstack/mutation-options/add';
import { queryKeys } from '@/car/service-log/presentation/tanstack/query/keys';
import { Result } from '@/common/application/result';

const mockServiceLogApiClient = serviceLogApiClient as jest.Mocked<
  typeof serviceLogApiClient
>;
jest.mock('@/car/service-log/dependency/api-client');

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

describe('serviceLogAddMutationOptions', () => {
  it('optimistically appends the new service log to the cached list', async () => {
    const existingServiceLog = buildServiceLogDto({ carId: 'car-1' });

    mockServiceLogApiClient.add.mockReturnValue(new Promise(() => {}));

    const wrapper = createWrapper();
    queryClient.setQueryData(queryKeys.byCarId('car-1'), [existingServiceLog]);

    const { result } = renderHook(
      () => useMutation(serviceLogAddMutationOptions(queryClient)),
      { wrapper },
    );

    result.current.mutate({
      carId: 'car-1',
      authorId: 'author-1',
      serviceDate: '2024-01-01T00:00:00Z',
      categories: ['engine'],
      mileage: 1000,
      notes: null,
      serviceCost: 50,
    });

    await waitFor(() => {
      const data = queryClient.getQueryData<
        ReturnType<typeof buildServiceLogDto>[]
      >(queryKeys.byCarId('car-1'));

      expect(data).toHaveLength(2);
      expect(data?.[1]).toMatchObject({
        carId: 'car-1',
        authorId: 'author-1',
        serviceDate: '2024-01-01T00:00:00Z',
        categories: ['engine'],
        mileage: 1000,
        notes: null,
        serviceCost: 50,
      });
    });
  });

  it('rolls back the cached list when the add fails', async () => {
    const existingServiceLog = buildServiceLogDto({ carId: 'car-1' });

    mockServiceLogApiClient.add.mockResolvedValue(
      Result.fail({ message: 'Add failed' }),
    );

    const wrapper = createWrapper();
    queryClient.setQueryData(queryKeys.byCarId('car-1'), [existingServiceLog]);

    const { result } = renderHook(
      () => useMutation(serviceLogAddMutationOptions(queryClient)),
      { wrapper },
    );

    await expect(
      result.current.mutateAsync({
        carId: 'car-1',
        authorId: 'author-1',
        serviceDate: '2024-01-01T00:00:00Z',
        categories: ['engine'],
        mileage: 1000,
        notes: null,
        serviceCost: 50,
      }),
    ).rejects.toThrow('Add failed');

    await waitFor(() => {
      expect(queryClient.getQueryData(queryKeys.byCarId('car-1'))).toEqual([
        existingServiceLog,
      ]);
    });
  });

  it('invalidates only the mutated car and the global list, not other cars', async () => {
    mockServiceLogApiClient.add.mockResolvedValue(
      Result.ok(buildServiceLogDto({ carId: 'car-1' })),
    );

    const wrapper = createWrapper();
    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(
      () => useMutation(serviceLogAddMutationOptions(queryClient)),
      { wrapper },
    );

    await result.current.mutateAsync({
      carId: 'car-1',
      authorId: 'author-1',
      serviceDate: '2024-01-01T00:00:00Z',
      categories: ['engine'],
      mileage: 1000,
      notes: null,
      serviceCost: 50,
    });

    await waitFor(() => expect(invalidateQueriesSpy).toHaveBeenCalledTimes(2));

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: queryKeys.byCarId('car-1'),
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: queryKeys.all(),
      exact: true,
    });
  });
});
