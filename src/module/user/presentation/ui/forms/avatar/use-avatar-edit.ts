import { useMutation } from '@tanstack/react-query';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { userAvatarEditMutationOptions } from '@/user/presentation/tanstack/mutation/avatar-edit';

export function useUserAvatarEdit() {
  const { addToast } = useToasts();

  const { mutateAsync } = useMutation({
    ...userAvatarEditMutationOptions,
    onSuccess: () => {
      addToast('Avatar changed.', 'success');
    },
    onError: (...args) => {
      userAvatarEditMutationOptions.onError?.(...args);
      addToast(args[0].message, 'error');
    },
  });

  return { mutateAsync };
}
