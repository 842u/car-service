import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { buildUserDto } from '@/user/application/dto/user.builder';
import { userAvatarEditMutationOptions } from '@/user/presentation/tanstack/mutation-options/avatar-edit';
import { queryKeys } from '@/user/presentation/tanstack/query/keys';

// Keeps mutationFn pending past onMutate so the optimistic patch is
// observable before the mutation ever settles.
jest.mock('@/lib/utils', () => ({ hashFile: () => new Promise(() => {}) }));

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
      () => useMutation(userAvatarEditMutationOptions(queryClient)),
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

  it('rolls back the session query to its previous value on error', async () => {
    const previousUser = buildUserDto({ avatarUrl: 'old-url' });

    const wrapper = createWrapper();
    queryClient.setQueryData(queryKeys.session(), previousUser);

    const { result } = renderHook(
      () => useMutation(userAvatarEditMutationOptions(queryClient)),
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
});
