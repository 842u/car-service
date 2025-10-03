import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useToasts } from '@/common/presentation/hooks/use-toasts';
import { userNameChangeMutationOptions } from '@/user/infrastructure/tanstack/mutation/options';
import { queryKeys } from '@/user/infrastructure/tanstack/query/keys';
import type { UserNameChangeApiContract } from '@/user/interface/api/name-change.schema';

export function useUserNameChange() {
  const { addToast } = useToasts();

  const queryClient = useQueryClient();

  const { mutate } = useMutation(userNameChangeMutationOptions(queryClient));

  const mutateWithOptions = (variables: UserNameChangeApiContract) => {
    mutate(variables, {
      onSuccess: () => {
        addToast('Name updated successfully.', 'success');
      },
      onError: (error, _, context) => {
        addToast(error.message, 'error');
        queryClient.setQueryData(
          queryKeys.sessionUser,
          context?.previousQueryData,
        );
      },
      onSettled: () =>
        queryClient.invalidateQueries({
          queryKey: queryKeys.sessionUser,
        }),
    });
  };

  return { mutate: mutateWithOptions };
}
