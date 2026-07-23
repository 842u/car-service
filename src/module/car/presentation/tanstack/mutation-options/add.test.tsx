import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { carApiClient } from '@/car/dependency/api-client';
import { carAddMutationOptions } from '@/car/presentation/tanstack/mutation-options/add';
import type { CarsInfiniteQueryData } from '@/car/presentation/tanstack/mutation-options/shared/infinite-query-data';
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

describe('carAddMutationOptions', () => {
  it('optimistically adds the car to the infinite query data', async () => {
    mockCarApiClient.add.mockReturnValue(new Promise(() => {}));

    const wrapper = createWrapper();

    const { result } = renderHook(
      () => useMutation(carAddMutationOptions(queryClient)),
      { wrapper },
    );

    result.current.mutate({ customName: 'New Car' });

    await waitFor(() => {
      const data = queryClient.getQueryData<CarsInfiniteQueryData>(
        queryKeys.infinite(),
      );

      expect(data?.pages[0].data[0]).toMatchObject({ customName: 'New Car' });
    });
  });

  it('removes the optimistically added car on error', async () => {
    mockCarApiClient.add.mockResolvedValue(
      Result.fail({ message: 'Add failed' }),
    );

    const wrapper = createWrapper();

    const { result } = renderHook(
      () => useMutation(carAddMutationOptions(queryClient)),
      { wrapper },
    );

    await expect(
      result.current.mutateAsync({ customName: 'New Car' }),
    ).rejects.toThrow('Add failed');

    await waitFor(() => {
      const data = queryClient.getQueryData<CarsInfiniteQueryData>(
        queryKeys.infinite(),
      );

      expect(data?.pages[0].data).toEqual([]);
    });
  });
});
