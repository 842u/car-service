import type { QueryClient } from '@tanstack/react-query';
import { mutationOptions } from '@tanstack/react-query';

import { dependencyContainer, dependencyTokens } from '@/di';
import type { UserNameChangeContract } from '@/user/interface/contracts/name-change.schema';
import { profilesUpdateOnMutate } from '@/utils/tanstack/profiles';

export const updateUserNameMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    throwOnError: false,
    mutationFn: async (variables: UserNameChangeContract) => {
      const userApiClient = await dependencyContainer.resolve(
        dependencyTokens.USER_API_CLIENT,
      );

      const nameChangeResult = await userApiClient.nameChange(variables);

      if (!nameChangeResult.success) {
        const { message } = nameChangeResult.error;
        throw new Error(message);
      }

      return nameChangeResult.data;
    },
    onMutate: (variables) =>
      profilesUpdateOnMutate(
        queryClient,
        'session',
        'username',
        variables.name.trim(),
      ),
  });
