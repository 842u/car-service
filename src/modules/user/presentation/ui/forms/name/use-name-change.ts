import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { userNameChangeMutationOptions } from '@/user/infrastructure/tanstack/mutation-options/name-change';
import { queryKeys } from '@/user/infrastructure/tanstack/query/keys';

export function useUserNameChange() {
  const { addToast } = useToasts();

  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    ...userNameChangeMutationOptions(queryClient),
    onSuccess: () => {
      addToast('Name changed.', 'success');
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

  return { mutateAsync };
}
