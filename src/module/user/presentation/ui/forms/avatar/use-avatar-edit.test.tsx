import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';

import { queryKeys } from '@/user/presentation/tanstack/query/keys';

import { useUserAvatarEdit } from './use-avatar-edit';

const mockAddToast = jest.fn();

jest.mock('@/common/presentation/hook/use-toasts', () => ({
  useToasts: () => ({ addToast: mockAddToast }),
}));

const mockMutationFn = jest.fn();
const mockOnError = jest.fn();
const mockOnSettled = jest.fn();
jest.mock('@/user/presentation/tanstack/mutation-options/avatar-edit', () => ({
  userAvatarEditMutationOptions: () => ({
    mutationFn: mockMutationFn,
    onError: mockOnError,
    onSettled: mockOnSettled,
  }),
}));

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

describe('useUserAvatarEdit', () => {
  it('should show success toast on successful mutation', async () => {
    mockMutationFn.mockResolvedValue({ avatarUrl: 'new-url' });

    const { result } = renderHook(() => useUserAvatarEdit(), { wrapper });

    await result.current.mutateAsync({ image: null });

    expect(mockAddToast).toHaveBeenCalledWith('Avatar changed.', 'success');
  });

  it('should show error toast on failed mutation', async () => {
    mockMutationFn.mockRejectedValue(new Error('Upload failed'));

    const { result } = renderHook(() => useUserAvatarEdit(), { wrapper });

    await expect(result.current.mutateAsync({ image: null })).rejects.toThrow(
      'Upload failed',
    );

    expect(mockAddToast).toHaveBeenCalledWith('Upload failed', 'error');
  });

  it('should forward errors to the mutation options base onError', async () => {
    const error = new Error('Upload failed');
    mockMutationFn.mockRejectedValue(error);

    const { result } = renderHook(() => useUserAvatarEdit(), { wrapper });

    await expect(result.current.mutateAsync({ image: null })).rejects.toThrow(
      'Upload failed',
    );

    expect(mockOnError).toHaveBeenCalledWith(
      error,
      { image: null },
      undefined,
      expect.anything(),
    );
  });

  it('should invalidate session query on settled', async () => {
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    mockMutationFn.mockResolvedValue({ avatarUrl: 'new-url' });

    const { result } = renderHook(() => useUserAvatarEdit(), { wrapper });

    await result.current.mutateAsync({ image: null });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: queryKeys.session(),
    });
  });

  it('should forward settled calls to the mutation options base onSettled', async () => {
    mockMutationFn.mockResolvedValue({ avatarUrl: 'new-url' });

    const { result } = renderHook(() => useUserAvatarEdit(), { wrapper });

    await result.current.mutateAsync({ image: null });

    expect(mockOnSettled).toHaveBeenCalledWith(
      { avatarUrl: 'new-url' },
      null,
      { image: null },
      undefined,
      expect.anything(),
    );
  });
});
