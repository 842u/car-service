import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { buildServiceLogDto } from '@/car/service-log/application/dto/service-log.builder';
import { serviceLogApiClient } from '@/car/service-log/dependency/api-client';
import { serviceLogEditMutationOptions } from '@/car/service-log/presentation/tanstack/mutation-options/edit';
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

describe('serviceLogEditMutationOptions', () => {
  it('optimistically patches the edited service log in the cached list', async () => {
    const serviceLogs = [
      buildServiceLogDto({
        id: 'log-1',
        carId: 'car-1',
        serviceCost: 100,
      }),
      buildServiceLogDto({
        id: 'log-2',
        carId: 'car-1',
        serviceCost: 200,
      }),
    ];

    mockServiceLogApiClient.edit.mockReturnValue(new Promise(() => {}));

    const wrapper = createWrapper();
    queryClient.setQueryData(queryKeys.byCarId('car-1'), serviceLogs);

    const { result } = renderHook(
      () => useMutation(serviceLogEditMutationOptions),
      { wrapper },
    );

    result.current.mutate({
      carId: 'car-1',
      serviceLogId: 'log-2',
      serviceDate: '2024-02-01T00:00:00Z',
      categories: ['tires'],
      mileage: 2000,
      notes: 'rotated',
      serviceCost: 300,
    });

    await waitFor(() => {
      const data = queryClient.getQueryData<
        ReturnType<typeof buildServiceLogDto>[]
      >(queryKeys.byCarId('car-1'));

      expect(data).toEqual([
        serviceLogs[0],
        {
          ...serviceLogs[1],
          serviceDate: '2024-02-01T00:00:00Z',
          categories: ['tires'],
          mileage: 2000,
          notes: 'rotated',
          serviceCost: 300,
        },
      ]);
    });
  });

  it('rolls back the cached list when the edit fails', async () => {
    const serviceLogs = [
      buildServiceLogDto({ id: 'log-1', carId: 'car-1', serviceCost: 100 }),
      buildServiceLogDto({ id: 'log-2', carId: 'car-1', serviceCost: 200 }),
    ];

    mockServiceLogApiClient.edit.mockResolvedValue(
      Result.fail({ message: 'Edit failed' }),
    );

    const wrapper = createWrapper();
    queryClient.setQueryData(queryKeys.byCarId('car-1'), serviceLogs);

    const { result } = renderHook(
      () => useMutation(serviceLogEditMutationOptions),
      { wrapper },
    );

    await expect(
      result.current.mutateAsync({
        carId: 'car-1',
        serviceLogId: 'log-2',
        serviceDate: '2024-02-01T00:00:00Z',
        categories: ['tires'],
        mileage: 2000,
        notes: 'rotated',
        serviceCost: 300,
      }),
    ).rejects.toThrow('Edit failed');

    await waitFor(() => {
      expect(queryClient.getQueryData(queryKeys.byCarId('car-1'))).toEqual(
        serviceLogs,
      );
    });
  });

  it('invalidates only the mutated car and the global list, not other cars', async () => {
    mockServiceLogApiClient.edit.mockResolvedValue(
      Result.ok(buildServiceLogDto({ id: 'log-2', carId: 'car-1' })),
    );

    const wrapper = createWrapper();
    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(
      () => useMutation(serviceLogEditMutationOptions),
      { wrapper },
    );

    await result.current.mutateAsync({
      carId: 'car-1',
      serviceLogId: 'log-2',
      serviceDate: '2024-02-01T00:00:00Z',
      categories: ['tires'],
      mileage: 2000,
      notes: 'rotated',
      serviceCost: 300,
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
