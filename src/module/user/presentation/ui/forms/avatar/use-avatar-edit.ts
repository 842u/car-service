import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { userAvatarEditMutationOptions } from '@/user/infrastructure/tanstack/mutation-options/avatar-edit';
import { queryKeys } from '@/user/infrastructure/tanstack/query/keys';

export function useUserAvatarEdit() {
  const { addToast } = useToasts();

  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    ...userAvatarEditMutationOptions(queryClient),
    onSuccess: () => {
      addToast('Avatar changed.', 'success');
    },
    onError: (error, _, context) => {
      addToast(error.message, 'error');
      queryClient.setQueryData(
        queryKeys.sessionUser,
        context?.previousQueryData,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.sessionUser,
      });
    },
  });

  return { mutateAsync };
}
