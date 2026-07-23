import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { userNameEditMutationOptions } from '@/user/presentation/tanstack/mutation-options/name-edit';
import { queryKeys } from '@/user/presentation/tanstack/query/keys';

export function useUserNameEdit() {
  const { addToast } = useToasts();

  const queryClient = useQueryClient();

  const nameEditMutationOptions = userNameEditMutationOptions(queryClient);

  const { mutateAsync } = useMutation({
    ...nameEditMutationOptions,
    onSuccess: () => {
      addToast('Name changed.', 'success');
    },
    onError: (...args) => {
      nameEditMutationOptions.onError?.(...args);
      addToast(args[0].message, 'error');
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.session(),
      }),
  });

  return { mutateAsync };
}
