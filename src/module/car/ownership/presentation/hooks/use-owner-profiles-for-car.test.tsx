import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { buildOwnershipDto } from '@/car/ownership/application/dto/ownership.builder';
import { ownershipDataSource } from '@/car/ownership/dependency/data-source';
import { useOwnerProfilesForCar } from '@/car/ownership/presentation/hooks/use-owner-profiles-for-car';
import { queryKeys } from '@/car/ownership/presentation/tanstack/query/keys';
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
const MOCK_USER_1 = buildUserDto({ id: 'owner-1' });
const MOCK_USER_2 = buildUserDto({ id: 'owner-2' });

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
  mockUserDataSource.getById.mockImplementation(async (id: string) =>
    Result.ok(id === MOCK_USER_1.id ? MOCK_USER_1 : MOCK_USER_2),
  );
});

describe('useOwnerProfilesForCar', () => {
  it('returns ownerships and owner profiles after a successful fetch', async () => {
    const { result } = renderHook(() => useOwnerProfilesForCar('car-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.ownerships).toEqual(MOCK_OWNERSHIPS);
    expect(result.current.users).toEqual([MOCK_USER_1, MOCK_USER_2]);
  });

  it('fetches each owner profile by its owner id', async () => {
    renderHook(() => useOwnerProfilesForCar('car-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() =>
      expect(mockUserDataSource.getById).toHaveBeenCalledTimes(2),
    );

    expect(mockUserDataSource.getById).toHaveBeenCalledWith('owner-1');
    expect(mockUserDataSource.getById).toHaveBeenCalledWith('owner-2');
  });

  it('does not fetch owner profiles when there are no ownerships', async () => {
    mockOwnershipDataSource.getByCarId.mockResolvedValue(Result.ok([]));

    const { result } = renderHook(() => useOwnerProfilesForCar('car-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockUserDataSource.getById).not.toHaveBeenCalled();
  });

  it('shows an error toast when the ownerships fetch fails', async () => {
    mockOwnershipDataSource.getByCarId.mockResolvedValue(
      Result.fail({ message: 'Ownerships error' }),
    );

    renderHook(() => useOwnerProfilesForCar('car-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() =>
      expect(mockAddToast).toHaveBeenCalledWith(
        'Ownerships error',
        'error',
        queryKeySerialize(queryKeys.byCarId('car-1')),
      ),
    );
  });

  it('shows a single combined error toast when owner-profile fetches fail', async () => {
    mockUserDataSource.getById.mockResolvedValue(
      Result.fail({ message: 'User error' }),
    );

    renderHook(() => useOwnerProfilesForCar('car-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() =>
      expect(mockAddToast).toHaveBeenCalledWith(
        'Cannot load 2 owner profile(s).',
        'error',
        'owner-profiles-car-1',
      ),
    );

    expect(mockAddToast).toHaveBeenCalledTimes(1);
  });
});
