import type { QueryClient } from '@tanstack/react-query';
import { mutationOptions } from '@tanstack/react-query';

import { dependencyContainer, dependencyTokens } from '@/di';
import type { UserDto } from '@/user/application/dtos/user-dto';
import { queryKeys } from '@/user/infrastructure/tanstack/query/keys';
import type { UserNameChangeContract } from '@/user/interface/contracts/name-change.schema';

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
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.sessionUser,
      });

      const previousQueryData = queryClient.getQueryData(queryKeys.sessionUser);

      queryClient.setQueryData(
        queryKeys.sessionUser,
        (currentQueryData: UserDto) => {
          const updatedQueryData = {
            ...currentQueryData,
            name: variables.name,
          };

          return updatedQueryData;
        },
      );

      return { previousQueryData };
    },
  });
