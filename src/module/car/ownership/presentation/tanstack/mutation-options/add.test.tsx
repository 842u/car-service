import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { buildOwnershipDto } from '@/car/ownership/application/dto/ownership.builder';
import { ownershipApiClient } from '@/car/ownership/dependency/api-client';
import { ownershipAddMutationOptions } from '@/car/ownership/presentation/tanstack/mutation-options/add';
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
      () => useMutation(ownershipAddMutationOptions(queryClient)),
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
          createdAt: null,
        },
      ]);
    });
  });

  it('rolls back the cached list when the add fails', async () => {
    const existingOwnership = buildOwnershipDto({ carId: 'car-1' });

    mockOwnershipApiClient.add.mockResolvedValue(
      Result.fail({ message: 'Add failed' }),
    );

    const wrapper = createWrapper();
    queryClient.setQueryData(queryKeys.byCarId('car-1'), [existingOwnership]);

    const { result } = renderHook(
      () => useMutation(ownershipAddMutationOptions(queryClient)),
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
});
