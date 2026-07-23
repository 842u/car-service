import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { ownershipDataSource } from '@/car/ownership/dependency/data-source';
import { queryKeys as ownershipQueryKeys } from '@/car/ownership/presentation/tanstack/query/keys';
import { useDeleteSection } from '@/car/presentation/ui/sections/delete/use-delete';
import { Result } from '@/common/application/result';
import { queryKeySerialize } from '@/common/presentation/tanstack/query-key';
import { userDataSource } from '@/user/dependency/data-source';

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

describe('useDeleteSection', () => {
  it('shows an ownerships error toast deduped against other consumers of the same query', async () => {
    mockOwnershipDataSource.getByCarId.mockResolvedValue(
      Result.fail({ message: 'Ownerships error' }),
    );

    renderHook(() => useDeleteSection({ carId: 'car-1' }), {
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
});
