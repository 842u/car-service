import type { QueryClient } from '@tanstack/react-query';
import { mutationOptions } from '@tanstack/react-query';

import type { UserDto } from '@/user/application/dto/user';
import { userApiClient } from '@/user/dependency/api-client';
import { queryKeys } from '@/user/infrastructure/tanstack/query/keys';
import type { EditUserApiRequest } from '@/user/interface/api/edit.schema';

export const userNameChangeMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    throwOnError: false,
    mutationFn: async (variables: Pick<EditUserApiRequest, 'name'>) => {
      const editResult = await userApiClient.edit(variables);

      if (!editResult.success) {
        const { message } = editResult.error;
        throw new Error(message);
      }

      return editResult.data;
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
