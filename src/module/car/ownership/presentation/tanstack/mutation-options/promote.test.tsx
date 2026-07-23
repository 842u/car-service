import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { buildOwnershipDto } from '@/car/ownership/application/dto/ownership.builder';
import { ownershipApiClient } from '@/car/ownership/dependency/api-client';
import { ownershipPromoteMutationOptions } from '@/car/ownership/presentation/tanstack/mutation-options/promote';
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

describe('ownershipPromoteMutationOptions', () => {
  it('optimistically marks the promoted owner as primary in the cached list', async () => {
    const owners = [
      buildOwnershipDto({
        carId: 'car-1',
        ownerId: 'owner-1',
        isPrimary: true,
      }),
      buildOwnershipDto({
        carId: 'car-1',
        ownerId: 'owner-2',
        isPrimary: false,
      }),
    ];

    mockOwnershipApiClient.promote.mockReturnValue(new Promise(() => {}));

    const wrapper = createWrapper();
    queryClient.setQueryData(queryKeys.byCarId('car-1'), owners);

    const { result } = renderHook(
      () => useMutation(ownershipPromoteMutationOptions(queryClient)),
      { wrapper },
    );

    result.current.mutate({ carId: 'car-1', ownerId: 'owner-2' });

    await waitFor(() => {
      const data = queryClient.getQueryData(queryKeys.byCarId('car-1'));

      expect(data).toEqual([
        { ...owners[0], isPrimary: false },
        { ...owners[1], isPrimary: true },
      ]);
    });
  });

  it('rolls back the cached list when the promote fails', async () => {
    const owners = [
      buildOwnershipDto({
        carId: 'car-1',
        ownerId: 'owner-1',
        isPrimary: true,
      }),
      buildOwnershipDto({
        carId: 'car-1',
        ownerId: 'owner-2',
        isPrimary: false,
      }),
    ];

    mockOwnershipApiClient.promote.mockResolvedValue(
      Result.fail({ message: 'Promote failed' }),
    );

    const wrapper = createWrapper();
    queryClient.setQueryData(queryKeys.byCarId('car-1'), owners);

    const { result } = renderHook(
      () => useMutation(ownershipPromoteMutationOptions(queryClient)),
      { wrapper },
    );

    await expect(
      result.current.mutateAsync({ carId: 'car-1', ownerId: 'owner-2' }),
    ).rejects.toThrow('Promote failed');

    await waitFor(() => {
      expect(queryClient.getQueryData(queryKeys.byCarId('car-1'))).toEqual(
        owners,
      );
    });
  });
});
