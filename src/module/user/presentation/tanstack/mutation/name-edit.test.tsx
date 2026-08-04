import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { Result } from '@/common/application/result';
import { buildUserDto } from '@/user/application/dto/user.builder';
import { userApiClient } from '@/user/dependency/api-client';
import { userNameEditMutationOptions } from '@/user/presentation/tanstack/mutation/name-edit';
import { queryKeys } from '@/user/presentation/tanstack/query/keys';

const mockUserApiClient = userApiClient as jest.Mocked<typeof userApiClient>;
jest.mock('@/user/dependency/api-client');

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

beforeEach(() => {
  jest.clearAllMocks();
});

describe('userNameEditMutationOptions', () => {
  it('optimistically patches the name and captures the previous session data', async () => {
    const previousUser = buildUserDto({ name: 'Old Name' });
    mockUserApiClient.edit.mockReturnValue(new Promise(() => {}));

    const wrapper = createWrapper();
    queryClient.setQueryData(queryKeys.session(), previousUser);

    const { result } = renderHook(
      () => useMutation(userNameEditMutationOptions),
      { wrapper },
    );

    result.current.mutate({ name: 'New Name' });

    await waitFor(() =>
      expect(queryClient.getQueryData(queryKeys.session())).toEqual({
        ...previousUser,
        name: 'New Name',
      }),
    );
  });

  it('rolls back the session query to its previous value on error', async () => {
    const previousUser = buildUserDto({ name: 'Old Name' });
    mockUserApiClient.edit.mockResolvedValue(
      Result.fail({ message: 'Edit failed' }),
    );

    const wrapper = createWrapper();
    queryClient.setQueryData(queryKeys.session(), previousUser);

    const { result } = renderHook(
      () => useMutation(userNameEditMutationOptions),
      { wrapper },
    );

    await expect(
      result.current.mutateAsync({ name: 'New Name' }),
    ).rejects.toThrow('Edit failed');

    await waitFor(() =>
      expect(queryClient.getQueryData(queryKeys.session())).toEqual(
        previousUser,
      ),
    );
  });

  it('does not corrupt the session cache when it is empty at mutation start', async () => {
    mockUserApiClient.edit.mockReturnValue(new Promise(() => {}));

    const wrapper = createWrapper();

    const { result } = renderHook(
      () => useMutation(userNameEditMutationOptions),
      { wrapper },
    );

    result.current.mutate({ name: 'New Name' });

    await waitFor(() =>
      expect(queryClient.getQueryData(queryKeys.session())).toBeUndefined(),
    );
  });

  it('invalidates the session query once the mutation settles', async () => {
    const previousUser = buildUserDto({ name: 'Old Name' });
    mockUserApiClient.edit.mockResolvedValue(
      Result.ok(buildUserDto({ name: 'New Name' })),
    );

    const wrapper = createWrapper();
    queryClient.setQueryData(queryKeys.session(), previousUser);

    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(
      () => useMutation(userNameEditMutationOptions),
      { wrapper },
    );

    await result.current.mutateAsync({ name: 'New Name' });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: queryKeys.session(),
    });
  });
});
