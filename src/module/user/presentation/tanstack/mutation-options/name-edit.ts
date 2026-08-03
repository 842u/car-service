import { mutationOptions } from '@tanstack/react-query';

import type { UserDto } from '@/user/application/dto/user';
import { userApiClient } from '@/user/dependency/api-client';
import type { EditUserApiRequest } from '@/user/interface/api/edit.schema';
import { queryKeys } from '@/user/presentation/tanstack/query/keys';

export const userNameEditMutationOptions = mutationOptions({
  mutationFn: async (variables: Pick<EditUserApiRequest, 'name'>) => {
    const editResult = await userApiClient.edit(variables);

    if (!editResult.success) {
      const { message } = editResult.error;
      throw new Error(message);
    }

    return editResult.data;
  },
  onMutate: async (variables, context) => {
    await context.client.cancelQueries({
      queryKey: queryKeys.session(),
    });

    const previousQueryData = context.client.getQueryData<UserDto>(
      queryKeys.session(),
    );

    context.client.setQueryData(
      queryKeys.session(),
      (current: UserDto | undefined) =>
        current && { ...current, name: variables.name },
    );

    return { previousQueryData };
  },
  onError: (_error, _variables, onMutateResult, context) => {
    if (!onMutateResult) return;

    context.client.setQueryData(
      queryKeys.session(),
      onMutateResult.previousQueryData,
    );
  },
  onSettled: (_data, _error, _variables, _onMutateResult, context) => {
    context.client.invalidateQueries({
      queryKey: queryKeys.session(),
    });
  },
});
