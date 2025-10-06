import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { userAvatarChangeMutationOptions } from '@/user/infrastructure/tanstack/mutation-options/avatar-change';
import { queryKeys } from '@/user/infrastructure/tanstack/query/keys';

export function useUserAvatarChange() {
  const { addToast } = useToasts();

  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    ...userAvatarChangeMutationOptions(queryClient),
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
