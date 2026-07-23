import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { carDataSource } from '@/car/dependency/data-source';
import { ownershipDataSource } from '@/car/ownership/dependency/data-source';
import { queryKeys as ownershipQueryKeys } from '@/car/ownership/presentation/tanstack/query/keys';
import { DetailsSection } from '@/car/presentation/ui/sections/details/details';
import { Result } from '@/common/application/result';
import { queryKeySerialize } from '@/common/presentation/tanstack/query-key';

const mockCarDataSource = carDataSource as jest.Mocked<typeof carDataSource>;
jest.mock('@/car/dependency/data-source');

const mockOwnershipDataSource = ownershipDataSource as jest.Mocked<
  typeof ownershipDataSource
>;
jest.mock('@/car/ownership/dependency/data-source');

jest.mock('@/user/presentation/hooks/use-session-user', () => ({
  useSessionUser: () => ({ data: undefined, isPending: false }),
}));

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
  // Keeps the car query pending so the component stays on its spinner
  // branch, isolating the ownerships-error toast from DetailsCard/EditModal
  // rendering, which is unrelated to the behavior under test.
  mockCarDataSource.getById.mockReturnValue(new Promise(() => {}));
});

describe('DetailsSection', () => {
  it('shows an ownerships error toast deduped against other consumers of the same query', async () => {
    mockOwnershipDataSource.getByCarId.mockResolvedValue(
      Result.fail({ message: 'Ownerships error' }),
    );

    render(<DetailsSection carId="car-1" />, { wrapper: createWrapper() });

    await waitFor(() =>
      expect(mockAddToast).toHaveBeenCalledWith(
        'Ownerships error',
        'error',
        queryKeySerialize(ownershipQueryKeys.byCarId('car-1')),
      ),
    );
  });
});
