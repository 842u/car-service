import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { Result } from '@/common/application/result';
import { queryKeySerialize } from '@/common/presentation/tanstack/query-key-serialize';
import { buildUserDto } from '@/user/application/dto/user.builder';
import { userDataSource } from '@/user/dependency/data-source';
import { useSessionUser } from '@/user/presentation/hook/use-session-user';
import { queryKeys } from '@/user/presentation/tanstack/query/keys';

const mockUserDataSource = userDataSource as jest.Mocked<typeof userDataSource>;
jest.mock('@/user/dependency/data-source');

const mockAddToast = jest.fn();
jest.mock('@/common/presentation/hook/use-toasts', () => ({
  useToasts: () => ({ addToast: mockAddToast }),
}));

const MOCK_USER = buildUserDto();

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
});

describe('useSessionUser', () => {
  it('returns the session user after a successful fetch', async () => {
    mockUserDataSource.getSessionUser.mockResolvedValue(Result.ok(MOCK_USER));

    const { result } = renderHook(() => useSessionUser(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(result.current.data).toEqual(MOCK_USER);
  });

  it('shows an error toast deduped against other consumers of the same query', async () => {
    mockUserDataSource.getSessionUser.mockResolvedValue(
      Result.fail({ message: 'Session error' }),
    );

    renderHook(() => useSessionUser(), { wrapper: createWrapper() });

    await waitFor(() =>
      expect(mockAddToast).toHaveBeenCalledWith(
        'Session error',
        'error',
        queryKeySerialize(queryKeys.session()),
      ),
    );
  });
});
