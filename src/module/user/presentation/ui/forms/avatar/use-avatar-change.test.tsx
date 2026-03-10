import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';

import { queryKeys } from '@/user/infrastructure/tanstack/query/keys';

import { useUserAvatarChange } from './use-avatar-change';

const mockAddToast = jest.fn();

jest.mock('@/common/presentation/hook/use-toasts', () => ({
  useToasts: () => ({ addToast: mockAddToast }),
}));

const mockMutationFn = jest.fn();

jest.mock(
  '@/user/infrastructure/tanstack/mutation-options/avatar-change',
  () => ({
    userAvatarChangeMutationOptions: () => ({
      mutationFn: mockMutationFn,
    }),
  }),
);

let queryClient: QueryClient;

function wrapper({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
});

describe('useUserAvatarChange', () => {
  it('should show success toast on successful mutation', async () => {
    mockMutationFn.mockResolvedValue({ avatarUrl: 'new-url' });

    const { result } = renderHook(() => useUserAvatarChange(), { wrapper });

    await result.current.mutateAsync({ image: null, imageInputUrl: null });

    expect(mockAddToast).toHaveBeenCalledWith('Avatar changed.', 'success');
  });

  it('should show error toast on failed mutation', async () => {
    mockMutationFn.mockRejectedValue(new Error('Upload failed'));

    const { result } = renderHook(() => useUserAvatarChange(), { wrapper });

    await expect(
      result.current.mutateAsync({ image: null, imageInputUrl: null }),
    ).rejects.toThrow('Upload failed');

    expect(mockAddToast).toHaveBeenCalledWith('Upload failed', 'error');
  });

  it('should revert query data on error', async () => {
    const previousData = { avatarUrl: 'old-url' };
    queryClient.setQueryData(queryKeys.sessionUser, previousData);

    mockMutationFn.mockRejectedValue(new Error('Upload failed'));

    const { result } = renderHook(() => useUserAvatarChange(), { wrapper });

    await expect(
      result.current.mutateAsync({ image: null, imageInputUrl: null }),
    ).rejects.toThrow('Upload failed');

    expect(queryClient.getQueryData(queryKeys.sessionUser)).toEqual(
      previousData,
    );
  });

  it('should invalidate sessionUser query on settled', async () => {
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    mockMutationFn.mockResolvedValue({ avatarUrl: 'new-url' });

    const { result } = renderHook(() => useUserAvatarChange(), { wrapper });

    await result.current.mutateAsync({ image: null, imageInputUrl: null });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: queryKeys.sessionUser,
    });
  });
});
