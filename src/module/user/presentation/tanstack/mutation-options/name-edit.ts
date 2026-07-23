import type { QueryClient } from '@tanstack/react-query';
import { mutationOptions } from '@tanstack/react-query';

import type { UserDto } from '@/user/application/dto/user';
import { userApiClient } from '@/user/dependency/api-client';
import type { EditUserApiRequest } from '@/user/interface/api/edit.schema';
import { queryKeys } from '@/user/presentation/tanstack/query/keys';

export const userNameEditMutationOptions = (queryClient: QueryClient) =>
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
        queryKey: queryKeys.session(),
      });

      const previousQueryData = queryClient.getQueryData(queryKeys.session());

      queryClient.setQueryData(
        queryKeys.session(),
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
