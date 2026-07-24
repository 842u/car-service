import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { Result } from '@/common/application/result';
import { browserStorageClient } from '@/dependency/storage-client/browser';
import { buildUserDto } from '@/user/application/dto/user.builder';
import { userApiClient } from '@/user/dependency/api-client';
import { userAvatarEditMutationOptions } from '@/user/presentation/tanstack/mutation-options/avatar-edit';
import { queryKeys } from '@/user/presentation/tanstack/query/keys';

const mockHashFile = jest.fn();
jest.mock('@/lib/utils', () => ({
  hashFile: (...args: unknown[]) => mockHashFile(...args),
}));

const mockBrowserStorageClient = browserStorageClient as jest.Mocked<
  typeof browserStorageClient
>;
jest.mock('@/dependency/storage-client/browser');

const mockUserApiClient = userApiClient as jest.Mocked<typeof userApiClient>;
jest.mock('@/user/dependency/api-client');

beforeEach(() => {
  jest.clearAllMocks();
  // Keeps mutationFn pending past onMutate so the optimistic patch is
  // observable before the mutation ever settles, unless a test overrides it.
  mockHashFile.mockReturnValue(new Promise(() => {}));
});

let queryClient: QueryClient;

function createWrapper() {
  queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return Wrapper;
}

describe('userAvatarEditMutationOptions', () => {
  it('optimistically patches the avatar and captures the previous session data', async () => {
    const previousUser = buildUserDto({ avatarUrl: 'old-url' });
    const image = new File(['content'], 'avatar.png', { type: 'image/png' });

    const wrapper = createWrapper();
    queryClient.setQueryData(queryKeys.session(), previousUser);

    const { result } = renderHook(
      () => useMutation(userAvatarEditMutationOptions),
      { wrapper },
    );

    result.current.mutate({ image });

    await waitFor(() =>
      expect(queryClient.getQueryData(queryKeys.session())).toEqual({
        ...previousUser,
        avatarUrl: 'blob:test/12345678-1234-4234-8234-123456789012',
      }),
    );
  });

  it('does not corrupt the session cache when it is empty at mutation start', async () => {
    const image = new File(['content'], 'avatar.png', { type: 'image/png' });

    const wrapper = createWrapper();

    const { result } = renderHook(
      () => useMutation(userAvatarEditMutationOptions),
      { wrapper },
    );

    await expect(result.current.mutateAsync({ image })).rejects.toThrow(
      'You must be signed in to change your avatar.',
    );

    expect(mockHashFile).not.toHaveBeenCalled();
    expect(queryClient.getQueryData(queryKeys.session())).toBeUndefined();
  });

  it('rolls back the session query to its previous value on error', async () => {
    const previousUser = buildUserDto({ avatarUrl: 'old-url' });

    const wrapper = createWrapper();
    queryClient.setQueryData(queryKeys.session(), previousUser);

    const { result } = renderHook(
      () => useMutation(userAvatarEditMutationOptions),
      { wrapper },
    );

    await expect(result.current.mutateAsync({ image: null })).rejects.toThrow(
      'No file was provided. Try again.',
    );

    await waitFor(() =>
      expect(queryClient.getQueryData(queryKeys.session())).toEqual(
        previousUser,
      ),
    );
  });

  it('revokes the optimistic image object URL once the mutation settles', async () => {
    const previousUser = buildUserDto({ avatarUrl: 'old-url' });
    const image = new File(['content'], 'avatar.png', { type: 'image/png' });

    mockHashFile.mockResolvedValue('hash');
    mockBrowserStorageClient.upload.mockResolvedValue(
      Result.ok({
        id: '1',
        path: 'user-1/hash',
        fullPath: 'avatars/user-1/hash',
      }),
    );
    mockUserApiClient.edit.mockResolvedValue(
      Result.ok(buildUserDto({ avatarUrl: 'https://example.com/avatar.png' })),
    );

    const wrapper = createWrapper();
    const revokeObjectURLSpy = jest.spyOn(URL, 'revokeObjectURL');
    queryClient.setQueryData(queryKeys.session(), previousUser);

    const { result } = renderHook(
      () => useMutation(userAvatarEditMutationOptions),
      { wrapper },
    );

    await result.current.mutateAsync({ image });

    expect(revokeObjectURLSpy).toHaveBeenCalledWith(
      'blob:test/12345678-1234-4234-8234-123456789012',
    );
  });

  it('invalidates the session query once the mutation settles', async () => {
    const previousUser = buildUserDto({ avatarUrl: 'old-url' });
    const image = new File(['content'], 'avatar.png', { type: 'image/png' });

    mockHashFile.mockResolvedValue('hash');
    mockBrowserStorageClient.upload.mockResolvedValue(
      Result.ok({
        id: '1',
        path: 'user-1/hash',
        fullPath: 'avatars/user-1/hash',
      }),
    );
    mockUserApiClient.edit.mockResolvedValue(
      Result.ok(buildUserDto({ avatarUrl: 'https://example.com/avatar.png' })),
    );

    const wrapper = createWrapper();
    queryClient.setQueryData(queryKeys.session(), previousUser);

    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(
      () => useMutation(userAvatarEditMutationOptions),
      { wrapper },
    );

    await result.current.mutateAsync({ image });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: queryKeys.session(),
    });
  });
});
