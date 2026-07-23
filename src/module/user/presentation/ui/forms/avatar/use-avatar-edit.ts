import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { userAvatarEditMutationOptions } from '@/user/presentation/tanstack/mutation-options/avatar-edit';
import { queryKeys } from '@/user/presentation/tanstack/query/keys';

export function useUserAvatarEdit() {
  const { addToast } = useToasts();

  const queryClient = useQueryClient();

  const avatarEditMutationOptions = userAvatarEditMutationOptions(queryClient);

  const { mutateAsync } = useMutation({
    ...avatarEditMutationOptions,
    onSuccess: () => {
      addToast('Avatar changed.', 'success');
    },
    onError: (...args) => {
      avatarEditMutationOptions.onError?.(...args);
      addToast(args[0].message, 'error');
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.session(),
      });
    },
  });

  return { mutateAsync };
}
