import type { QueryClient } from '@tanstack/react-query';
import { mutationOptions } from '@tanstack/react-query';

import { userApiClient } from '@/dependencies/api-client/user';
import type { UserDto } from '@/user/application/dto/user';
import { queryKeys } from '@/user/infrastructure/tanstack/query/keys';
import type { UserNameChangeApiRequest } from '@/user/interface/api/name-change.schema';

export const userNameChangeMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    throwOnError: false,
    mutationFn: async (variables: UserNameChangeApiRequest) => {
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
