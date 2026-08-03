import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { buildServiceLogDto } from '@/car/service-log/application/dto/service-log.builder';
import { serviceLogApiClient } from '@/car/service-log/dependency/api-client';
import { serviceLogRemoveMutationOptions } from '@/car/service-log/presentation/tanstack/mutation-options/remove';
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

describe('serviceLogRemoveMutationOptions', () => {
  it('optimistically removes the service log from the cached list', async () => {
    const serviceLogs = [
      buildServiceLogDto({ id: 'log-1', carId: 'car-1' }),
      buildServiceLogDto({ id: 'log-2', carId: 'car-1' }),
    ];

    mockServiceLogApiClient.remove.mockReturnValue(new Promise(() => {}));

    const wrapper = createWrapper();
    queryClient.setQueryData(queryKeys.byCarId('car-1'), serviceLogs);

    const { result } = renderHook(
      () => useMutation(serviceLogRemoveMutationOptions),
      { wrapper },
    );

    result.current.mutate({ carId: 'car-1', serviceLogId: 'log-2' });

    await waitFor(() => {
      const data = queryClient.getQueryData(queryKeys.byCarId('car-1'));

      expect(data).toEqual([serviceLogs[0]]);
    });
  });

  it("leaves other cars' cached lists untouched during the optimistic write", async () => {
    const existingServiceLog = buildServiceLogDto({
      id: 'log-1',
      carId: 'car-1',
    });
    const car2ServiceLogs = [
      buildServiceLogDto({ id: 'log-car-2', carId: 'car-2' }),
    ];

    mockServiceLogApiClient.remove.mockReturnValue(new Promise(() => {}));

    const wrapper = createWrapper();
    queryClient.setQueryData(queryKeys.byCarId('car-1'), [existingServiceLog]);
    queryClient.setQueryData(queryKeys.byCarId('car-2'), car2ServiceLogs);

    const { result } = renderHook(
      () => useMutation(serviceLogRemoveMutationOptions),
      { wrapper },
    );

    result.current.mutate({ carId: 'car-1', serviceLogId: 'log-1' });

    await waitFor(() => {
      expect(queryClient.getQueryData(queryKeys.byCarId('car-1'))).toEqual([]);
    });

    expect(queryClient.getQueryData(queryKeys.byCarId('car-2'))).toBe(
      car2ServiceLogs,
    );
  });

  it('restores the removed service log to the cached list on error', async () => {
    const serviceLogs = [
      buildServiceLogDto({ id: 'log-1', carId: 'car-1' }),
      buildServiceLogDto({ id: 'log-2', carId: 'car-1' }),
    ];

    mockServiceLogApiClient.remove.mockResolvedValue(
      Result.fail({ message: 'Remove failed' }),
    );

    const wrapper = createWrapper();
    queryClient.setQueryData(queryKeys.byCarId('car-1'), serviceLogs);

    const { result } = renderHook(
      () => useMutation(serviceLogRemoveMutationOptions),
      { wrapper },
    );

    await expect(
      result.current.mutateAsync({ carId: 'car-1', serviceLogId: 'log-2' }),
    ).rejects.toThrow('Remove failed');

    await waitFor(() => {
      expect(queryClient.getQueryData(queryKeys.byCarId('car-1'))).toEqual(
        serviceLogs,
      );
    });
  });

  it('invalidates only the mutated car and the global list, not other cars', async () => {
    mockServiceLogApiClient.remove.mockResolvedValue(Result.ok(null));

    const wrapper = createWrapper();
    const invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(
      () => useMutation(serviceLogRemoveMutationOptions),
      { wrapper },
    );

    await result.current.mutateAsync({ carId: 'car-1', serviceLogId: 'log-2' });

    await waitFor(() => expect(invalidateQueriesSpy).toHaveBeenCalledTimes(2));

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: queryKeys.byCarId('car-1'),
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: queryKeys.all(),
      exact: true,
    });
  });

  it("leaves other cars' cached lists untouched once the mutation settles", async () => {
    const existingServiceLog = buildServiceLogDto({
      id: 'log-1',
      carId: 'car-1',
    });
    const car2ServiceLogs = [
      buildServiceLogDto({ id: 'log-car-2', carId: 'car-2' }),
    ];

    mockServiceLogApiClient.remove.mockResolvedValue(Result.ok(null));

    const wrapper = createWrapper();
    queryClient.setQueryData(queryKeys.byCarId('car-1'), [existingServiceLog]);
    queryClient.setQueryData(queryKeys.byCarId('car-2'), car2ServiceLogs);

    const { result } = renderHook(
      () => useMutation(serviceLogRemoveMutationOptions),
      { wrapper },
    );

    await result.current.mutateAsync({ carId: 'car-1', serviceLogId: 'log-1' });

    expect(queryClient.getQueryData(queryKeys.byCarId('car-2'))).toBe(
      car2ServiceLogs,
    );
  });
});
