import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { buildOwnershipDto } from '@/car/ownership/application/dto/ownership.builder';
import { ownershipDataSource } from '@/car/ownership/dependency/data-source';
import { useOwnerProfilesForCar } from '@/car/ownership/presentation/hooks/use-owner-profiles-for-car';
import { getOwnerProfilesQueryOptions } from '@/car/ownership/presentation/tanstack/query/options';
import { Result } from '@/common/application/result';
import { queryKeySerialize } from '@/common/presentation/tanstack/query-key';
import { buildUserDto } from '@/user/application/dto/user.builder';
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

const MOCK_OWNERSHIPS = [
  buildOwnershipDto({ ownerId: 'owner-1' }),
  buildOwnershipDto({ ownerId: 'owner-2' }),
];
const MOCK_USERS = [buildUserDto(), buildUserDto()];

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
  mockOwnershipDataSource.getByCarId.mockResolvedValue(
    Result.ok(MOCK_OWNERSHIPS),
  );
  mockUserDataSource.getUsersByIds.mockResolvedValue(Result.ok(MOCK_USERS));
});

describe('useOwnerProfilesForCar', () => {
  it('returns ownerships and owner profiles after a successful fetch', async () => {
    const { result } = renderHook(() => useOwnerProfilesForCar('car-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.ownerships).toEqual(MOCK_OWNERSHIPS);
    expect(result.current.users).toEqual(MOCK_USERS);
  });

  it('fetches owner profiles by the ownerships owner ids', async () => {
    renderHook(() => useOwnerProfilesForCar('car-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() =>
      expect(mockUserDataSource.getUsersByIds).toHaveBeenCalledWith([
        'owner-1',
        'owner-2',
      ]),
    );
  });

  it('does not fetch owner profiles when there are no ownerships', async () => {
    mockOwnershipDataSource.getByCarId.mockResolvedValue(Result.ok([]));

    const { result } = renderHook(() => useOwnerProfilesForCar('car-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockUserDataSource.getUsersByIds).not.toHaveBeenCalled();
  });

  it('shows an error toast when the ownerships fetch fails', async () => {
    mockOwnershipDataSource.getByCarId.mockResolvedValue(
      Result.fail({ message: 'Ownerships error' }),
    );

    renderHook(() => useOwnerProfilesForCar('car-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() =>
      expect(mockAddToast).toHaveBeenCalledWith('Ownerships error', 'error'),
    );
  });

  it('shows an error toast with the query key when the owner-profiles fetch fails', async () => {
    mockUserDataSource.getUsersByIds.mockResolvedValue(
      Result.fail({ message: 'Users error' }),
    );

    renderHook(() => useOwnerProfilesForCar('car-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() =>
      expect(mockAddToast).toHaveBeenCalledWith(
        'Users error',
        'error',
        queryKeySerialize(
          getOwnerProfilesQueryOptions({
            carId: 'car-1',
            ownerIds: ['owner-1', 'owner-2'],
          }).queryKey,
        ),
      ),
    );
  });
});
