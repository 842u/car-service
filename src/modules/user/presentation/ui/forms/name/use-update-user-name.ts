import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useToasts } from '@/common/presentation/hooks/use-toasts';
import { updateUserNameMutationOptions } from '@/user/infrastructure/tanstack/mutation/options';
import { queryKeys } from '@/user/infrastructure/tanstack/query/keys';
import type { NameChangeContract } from '@/user/interface/contracts/name-change.schema';

export function useUpdateUserName() {
  const { addToast } = useToasts();

  const queryClient = useQueryClient();

  const { mutate } = useMutation(updateUserNameMutationOptions(queryClient));

  const mutateWithOptions = (variables: NameChangeContract) => {
    mutate(variables, {
      onSuccess: () => {
        addToast('Name updated successfully.', 'success');
      },
      onError: (error, _, context) => {
        addToast(error.message, 'error');
        queryClient.setQueryData(
          queryKeys.userSession,
          context?.previousQueryData,
        );
      },
      onSettled: () =>
        queryClient.invalidateQueries({
          queryKey: queryKeys.userSession,
        }),
    });
  };

  return { mutate: mutateWithOptions };
}
