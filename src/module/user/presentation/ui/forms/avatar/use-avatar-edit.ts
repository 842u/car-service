import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { userAvatarEditMutationOptions } from '@/user/presentation/tanstack/mutation-options/avatar-edit';
import { queryKeys } from '@/user/presentation/tanstack/query/keys';

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
      queryClient.setQueryData(queryKeys.session(), context?.previousQueryData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.session(),
      });
    },
  });

  return { mutateAsync };
}
