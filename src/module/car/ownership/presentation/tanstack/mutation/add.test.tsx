import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import type { OwnershipDto } from '@/car/ownership/application/dto/ownership';
import { buildOwnershipDto } from '@/car/ownership/application/dto/ownership.builder';
import { ownershipApiClient } from '@/car/ownership/dependency/api-client';
import { ownershipAddMutationOptions } from '@/car/ownership/presentation/tanstack/mutation/add';
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

describe('ownershipAddMutationOptions', () => {
  it('optimistically appends the new ownership to the cached list', async () => {
    const existingOwnership = buildOwnershipDto({ carId: 'car-1' });

    mockOwnershipApiClient.add.mockReturnValue(new Promise(() => {}));

    const wrapper = createWrapper();
    queryClient.setQueryData(queryKeys.byCarId('car-1'), [existingOwnership]);

    const { result } = renderHook(
      () => useMutation(ownershipAddMutationOptions),
      { wrapper },
    );

    result.current.mutate({ carId: 'car-1', ownerId: 'owner-2' });

    await waitFor(() => {
      const data = queryClient.getQueryData(queryKeys.byCarId('car-1'));

      expect(data).toEqual([
        existingOwnership,
        {
          carId: 'car-1',
          ownerId: 'owner-2',
          isPrimary: false,
          createdAt: expect.any(String),
        },
      ]);
    });
  });

  it('stamps the optimistic ownership so it already sorts as the newest row', async () => {
    const existingCreatedAt = '2024-01-01T00:00:00';
    const existingOwnership = buildOwnershipDto({
      carId: 'car-1',
      createdAt: existingCreatedAt,
    });

    mockOwnershipApiClient.add.mockReturnValue(new Promise(() => {}));

    const wrapper = createWrapper();
    queryClient.setQueryData(queryKeys.byCarId('car-1'), [existingOwnership]);

    const { result } = renderHook(
      () => useMutation(ownershipAddMutationOptions),
      { wrapper },
    );

    result.current.mutate({ carId: 'car-1', ownerId: 'owner-2' });

    let addedCreatedAt = '';

    await waitFor(() => {
      const data = queryClient.getQueryData<OwnershipDto[]>(
        queryKeys.byCarId('car-1'),
      );

      expect(data).toHaveLength(2);

      addedCreatedAt = data?.[1].createdAt ?? '';
    });

    expect(addedCreatedAt > existingCreatedAt).toBe(true);
    // Server rows carry a zone-less timestamp; the optimistic one has to sort
    // against them under the same shape.
    expect(addedCreatedAt).not.toMatch(/Z$/);
  });

  it('rolls back the cached list when the add fails', async () => {
    const existingOwnership = buildOwnershipDto({ carId: 'car-1' });

    mockOwnershipApiClient.add.mockResolvedValue(
      Result.fail({ message: 'Add failed' }),
    );

    const wrapper = createWrapper();
    queryClient.setQueryData(queryKeys.byCarId('car-1'), [existingOwnership]);

    const { result } = renderHook(
      () => useMutation(ownershipAddMutationOptions),
      { wrapper },
    );

    await expect(
      result.current.mutateAsync({ carId: 'car-1', ownerId: 'owner-2' }),
    ).rejects.toThrow('Add failed');

    await waitFor(() => {
      expect(queryClient.getQueryData(queryKeys.byCarId('car-1'))).toEqual([
        existingOwnership,
      ]);
    });
  });

  it('invalidates the ownerships-by-car query once the mutation settles', async () => {
    mockOwnershipApiClient.add.mockResolvedValue(
      Result.ok([buildOwnershipDto({ carId: 'car-1', ownerId: 'owner-2' })]),
    );

    const wrapper = createWrapper();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(
      () => useMutation(ownershipAddMutationOptions),
      { wrapper },
    );

    await result.current.mutateAsync({ carId: 'car-1', ownerId: 'owner-2' });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: queryKeys.byCarId('car-1'),
    });
  });
});
