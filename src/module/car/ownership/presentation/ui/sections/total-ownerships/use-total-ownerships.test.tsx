import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { ownershipDataSource } from '@/car/ownership/dependency/data-source';
import { useTotalOwnershipsSection } from '@/car/ownership/presentation/ui/sections/total-ownerships/use-total-ownerships';
import { Result } from '@/common/application/result';
import { createMockOwnershipDto } from '@/lib/jest/mock/src/module/car/ownership/application/dto/ownership';
import { createMockUserDto } from '@/lib/jest/mock/src/module/user/application/dto/user';
import { queryKeySerialize } from '@/lib/tanstack/utils';
import { userDataSource } from '@/user/dependency/data-source';
import { getSessionUserQueryOptions } from '@/user/infrastructure/tanstack/query/options';

const mockOwnershipDataSource = ownershipDataSource as jest.Mocked<
  typeof ownershipDataSource
>;
jest.mock('@/car/ownership/dependency/data-source');

const mockAddToast = jest.fn();
jest.mock('@/common/presentation/hook/use-toasts', () => ({
  useToasts: () => ({ addToast: mockAddToast }),
}));

const mockUserDataSource = userDataSource as jest.Mocked<typeof userDataSource>;
jest.mock('@/user/dependency/data-source');

const MOCK_USER = createMockUserDto();
const MOCK_OWNERSHIPS = [createMockOwnershipDto(), createMockOwnershipDto()];

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
    mockOwnershipDataSource.getByOwnerId.mockResolvedValue(
      Result.ok(MOCK_OWNERSHIPS),
    );

    const { result } = renderHook(() => useTotalOwnershipsSection(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(true);
  });

  it('should return ownerships data after successful fetch', async () => {
    mockOwnershipDataSource.getByOwnerId.mockResolvedValue(
      Result.ok(MOCK_OWNERSHIPS),
    );

    const { result } = renderHook(() => useTotalOwnershipsSection(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(result.current.data).toEqual(MOCK_OWNERSHIPS);
  });

  it('should call getByOwnerId with the user id', async () => {
    mockOwnershipDataSource.getByOwnerId.mockResolvedValue(
      Result.ok(MOCK_OWNERSHIPS),
    );

    const { result } = renderHook(() => useTotalOwnershipsSection(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(mockOwnershipDataSource.getByOwnerId).toHaveBeenCalledWith(
      MOCK_USER.id,
    );
  });

  it('should not call getByOwnerId when user is not yet resolved', () => {
    mockUserDataSource.getSessionUser.mockReturnValue(new Promise(() => {}));

    renderHook(() => useTotalOwnershipsSection(), {
      wrapper: createWrapper(),
    });

    expect(mockOwnershipDataSource.getByOwnerId).not.toHaveBeenCalled();
  });

  it('should show error toast when ownerships fetch fails', async () => {
    mockOwnershipDataSource.getByOwnerId.mockResolvedValue(
      Result.fail({ message: 'DB error' }),
    );

    renderHook(() => useTotalOwnershipsSection(), {
      wrapper: createWrapper(),
    });

    await waitFor(() =>
      expect(mockAddToast).toHaveBeenCalledWith('DB error', 'error'),
    );
  });

  it('should fall back to generic message when ownerships error has no message', async () => {
    mockOwnershipDataSource.getByOwnerId.mockResolvedValue(
      Result.fail({ message: '' }),
    );

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
      expect(mockAddToast).toHaveBeenCalledWith(
        'Unauthorized',
        'error',
        queryKeySerialize(getSessionUserQueryOptions.queryKey),
      ),
    );
  });
});
