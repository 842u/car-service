import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { carDataSource } from '@/car/dependency/data-source';
import { ownershipDataSource } from '@/car/ownership/dependency/data-source';
import { queryKeys as ownershipQueryKeys } from '@/car/ownership/presentation/tanstack/query/keys';
import { queryKeys } from '@/car/presentation/tanstack/query/keys';
import { useDetailsSection } from '@/car/presentation/ui/sections/details/use-details';
import { Result } from '@/common/application/result';
import { queryKeySerialize } from '@/common/presentation/tanstack/query-key';
import { userDataSource } from '@/user/dependency/data-source';

const mockCarDataSource = carDataSource as jest.Mocked<typeof carDataSource>;
jest.mock('@/car/dependency/data-source');

const mockOwnershipDataSource = ownershipDataSource as jest.Mocked<
  typeof ownershipDataSource
>;
jest.mock('@/car/ownership/dependency/data-source');

const mockUserDataSource = userDataSource as jest.Mocked<typeof userDataSource>;
jest.mock('@/user/dependency/data-source');

const mockAddToast = jest.fn();
jest.mock('@/common/presentation/hook/use-toasts', () => ({
  useToasts: () => ({ addToast: mockAddToast }),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
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
  mockUserDataSource.getSessionUser.mockReturnValue(new Promise(() => {}));
});

describe('useDetailsSection', () => {
  it('shows an ownerships error toast deduped against other consumers of the same query', async () => {
    mockCarDataSource.getById.mockReturnValue(new Promise(() => {}));
    mockOwnershipDataSource.getByCarId.mockResolvedValue(
      Result.fail({ message: 'Ownerships error' }),
    );

    renderHook(() => useDetailsSection({ carId: 'car-1' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() =>
      expect(mockAddToast).toHaveBeenCalledWith(
        'Ownerships error',
        'error',
        queryKeySerialize(ownershipQueryKeys.byCarId('car-1')),
      ),
    );
  });

  it('shows a car error toast deduped against other consumers of the same query', async () => {
    mockCarDataSource.getById.mockResolvedValue(
      Result.fail({ message: 'Car error' }),
    );
    mockOwnershipDataSource.getByCarId.mockReturnValue(new Promise(() => {}));

    renderHook(() => useDetailsSection({ carId: 'car-1' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() =>
      expect(mockAddToast).toHaveBeenCalledWith(
        'Car error',
        'error',
        queryKeySerialize(queryKeys.byId('car-1')),
      ),
    );
  });
});
