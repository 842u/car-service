import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { userNameEditMutationOptions } from '@/user/presentation/tanstack/mutation-options/name-edit';
import { queryKeys } from '@/user/presentation/tanstack/query/keys';

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
      queryClient.setQueryData(queryKeys.session(), context?.previousQueryData);
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.session(),
      }),
  });

  return { mutateAsync };
}
