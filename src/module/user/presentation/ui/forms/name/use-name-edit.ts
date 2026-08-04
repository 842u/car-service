import { useMutation } from '@tanstack/react-query';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { userNameEditMutationOptions } from '@/user/presentation/tanstack/mutation/name-edit';

export function useUserNameEdit() {
  const { addToast } = useToasts();

  const { mutateAsync } = useMutation({
    ...userNameEditMutationOptions,
    onSuccess: () => {
      addToast('Name changed.', 'success');
    },
    onError: (...args) => {
      userNameEditMutationOptions.onError?.(...args);
      addToast(args[0].message, 'error');
    },
  });

  return { mutateAsync };
}
