import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { userNameEditMutationOptions } from '@/user/infrastructure/tanstack/mutation-options/name-edit';
import { queryKeys } from '@/user/infrastructure/tanstack/query/keys';

export function useUserNameEdit() {
  const { addToast } = useToasts();

  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    ...userNameEditMutationOptions(queryClient),
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
