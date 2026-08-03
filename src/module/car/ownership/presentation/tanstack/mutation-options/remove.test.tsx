import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { buildOwnershipDto } from '@/car/ownership/application/dto/ownership.builder';
import { ownershipApiClient } from '@/car/ownership/dependency/api-client';
import { ownershipRemoveMutationOptions } from '@/car/ownership/presentation/tanstack/mutation-options/remove';
import { queryKeys } from '@/car/ownership/presentation/tanstack/query/keys';
import { Result } from '@/common/application/result';

const mockOwnershipApiClient = ownershipApiClient as jest.Mocked<
  typeof ownershipApiClient
>;
jest.mock('@/car/ownership/dependency/api-client');

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

describe('ownershipRemoveMutationOptions', () => {
  it('optimistically removes the ownership from the cached list', async () => {
    const owners = [
      buildOwnershipDto({ carId: 'car-1', ownerId: 'owner-1' }),
      buildOwnershipDto({ carId: 'car-1', ownerId: 'owner-2' }),
    ];

    mockOwnershipApiClient.remove.mockReturnValue(new Promise(() => {}));

    const wrapper = createWrapper();
    queryClient.setQueryData(queryKeys.byCarId('car-1'), owners);

    const { result } = renderHook(
      () => useMutation(ownershipRemoveMutationOptions),
      { wrapper },
    );

    result.current.mutate({ carId: 'car-1', ownerId: 'owner-2' });

    await waitFor(() => {
      const data = queryClient.getQueryData(queryKeys.byCarId('car-1'));

      expect(data).toEqual([owners[0]]);
    });
  });

  it('restores the removed ownership to the cached list on error', async () => {
    const owners = [
      buildOwnershipDto({ carId: 'car-1', ownerId: 'owner-1' }),
      buildOwnershipDto({ carId: 'car-1', ownerId: 'owner-2' }),
    ];

    mockOwnershipApiClient.remove.mockResolvedValue(
      Result.fail({ message: 'Remove failed' }),
    );

    const wrapper = createWrapper();
    queryClient.setQueryData(queryKeys.byCarId('car-1'), owners);

    const { result } = renderHook(
      () => useMutation(ownershipRemoveMutationOptions),
      { wrapper },
    );

    await expect(
      result.current.mutateAsync({ carId: 'car-1', ownerId: 'owner-2' }),
    ).rejects.toThrow('Remove failed');

    await waitFor(() => {
      expect(queryClient.getQueryData(queryKeys.byCarId('car-1'))).toEqual(
        owners,
      );
    });
  });

  it('invalidates the ownerships-by-car query once the mutation settles', async () => {
    const owners = [
      buildOwnershipDto({ carId: 'car-1', ownerId: 'owner-1' }),
      buildOwnershipDto({ carId: 'car-1', ownerId: 'owner-2' }),
    ];

    mockOwnershipApiClient.remove.mockResolvedValue(Result.ok(null));

    const wrapper = createWrapper();
    queryClient.setQueryData(queryKeys.byCarId('car-1'), owners);

    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(
      () => useMutation(ownershipRemoveMutationOptions),
      { wrapper },
    );

    await result.current.mutateAsync({ carId: 'car-1', ownerId: 'owner-2' });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: queryKeys.byCarId('car-1'),
    });
  });
});
