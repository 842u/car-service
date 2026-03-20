import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { useTotalOwnershipsSection } from '@/car/ownership/ui/sections/total-ownerships/use-total-ownerships';
import { createMockCarOwnership } from '@/lib/jest/mock/src/module/car/ownership';
import { createMockUserDto } from '@/lib/jest/mock/src/module/user/application/dto/user';
import { getCarsOwnershipsByOwnerId } from '@/lib/supabase/tables/cars_ownerships';
import { userDataSource } from '@/user/dependency/data-source';

const mockGetCarsOwnershipsByOwnerId =
  getCarsOwnershipsByOwnerId as jest.MockedFunction<
    typeof getCarsOwnershipsByOwnerId
  >;
jest.mock('@/lib/supabase/tables/cars_ownerships');

const mockAddToast = jest.fn();
jest.mock('@/common/presentation/hook/use-toasts', () => ({
  useToasts: () => ({ addToast: mockAddToast }),
}));

const mockUserDataSource = userDataSource as jest.Mocked<typeof userDataSource>;
jest.mock('@/user/dependency/data-source');

beforeEach(() => {
  jest.clearAllMocks();
  mockUserDataSource.getSessionUser.mockResolvedValue({
    success: true,
    data: MOCK_USER,
  });
});

const MOCK_USER = createMockUserDto();
const MOCK_OWNERSHIPS = [createMockCarOwnership(), createMockCarOwnership()];

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
  mockUserDataSource.getSessionUser.mockResolvedValue({
    success: true,
    data: MOCK_USER,
  });
});

describe('useTotalOwnershipsSection', () => {
  it('should return isPending true initially', () => {
    mockGetCarsOwnershipsByOwnerId.mockResolvedValue(MOCK_OWNERSHIPS);

    const { result } = renderHook(() => useTotalOwnershipsSection(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(true);
  });

  it('should return ownerships data after successful fetch', async () => {
    mockGetCarsOwnershipsByOwnerId.mockResolvedValue(MOCK_OWNERSHIPS);

    const { result } = renderHook(() => useTotalOwnershipsSection(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(result.current.data).toEqual(MOCK_OWNERSHIPS);
  });

  it('should call getCarsOwnershipsByOwnerId with the user id', async () => {
    mockGetCarsOwnershipsByOwnerId.mockResolvedValue(MOCK_OWNERSHIPS);

    const { result } = renderHook(() => useTotalOwnershipsSection(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(mockGetCarsOwnershipsByOwnerId).toHaveBeenCalledWith(MOCK_USER.id);
  });

  it('should not call getCarsOwnershipsByOwnerId when user is not yet resolved', () => {
    mockUserDataSource.getSessionUser.mockReturnValue(new Promise(() => {}));

    renderHook(() => useTotalOwnershipsSection(), {
      wrapper: createWrapper(),
    });

    expect(mockGetCarsOwnershipsByOwnerId).not.toHaveBeenCalled();
  });

  it('should show error toast when ownerships fetch fails', async () => {
    mockGetCarsOwnershipsByOwnerId.mockRejectedValue(new Error('DB error'));

    renderHook(() => useTotalOwnershipsSection(), {
      wrapper: createWrapper(),
    });

    await waitFor(() =>
      expect(mockAddToast).toHaveBeenCalledWith('DB error', 'error'),
    );
  });

  it('should fall back to generic message when ownerships error has no message', async () => {
    mockGetCarsOwnershipsByOwnerId.mockRejectedValue(new Error(''));

    renderHook(() => useTotalOwnershipsSection(), {
      wrapper: createWrapper(),
    });

    await waitFor(() =>
      expect(mockAddToast).toHaveBeenCalledWith(
        'Cannot get user ownerships.',
        'error',
      ),
    );
  });

  it('should show error toast when user fetch fails', async () => {
    mockUserDataSource.getSessionUser.mockResolvedValue({
      success: false,
      error: { message: 'Unauthorized' },
    });

    renderHook(() => useTotalOwnershipsSection(), {
      wrapper: createWrapper(),
    });

    await waitFor(() =>
      expect(mockAddToast).toHaveBeenCalledWith('Unauthorized', 'error'),
    );
  });
});
