import { useMutation } from '@tanstack/react-query';

import type { ServiceLogFormValues } from '@/car/service-log/interface/ui/service-log-form.schema';
import { serviceLogAddMutationOptions } from '@/car/service-log/presentation/tanstack/mutation-options/add';
import { useToasts } from '@/common/presentation/hook/use-toasts';
import { useSessionUser } from '@/user/presentation/hooks/use-session-user';

interface UseAddFormParams {
  carId: string;
  onSubmit?: () => void;
}

export function useAddForm({ carId, onSubmit }: UseAddFormParams) {
  const { data: sessionUser } = useSessionUser();

  const { addToast } = useToasts();

  // The modal unmounts this form as soon as onSubmit fires, before the
  // request settles. React Query drops callbacks passed to mutate() once the
  // caller unmounts, so the toasts live on the mutation options (which still
  // run). onError is composed so the options' optimistic rollback still runs.
  const { mutate } = useMutation({
    ...serviceLogAddMutationOptions,
    onSuccess: () => addToast('Service log added.', 'success'),
    onError: (...args) => {
      serviceLogAddMutationOptions.onError?.(...args);
      addToast(args[0].message, 'error');
    },
  });

  const handleFormSubmit = (formData: ServiceLogFormValues) => {
    onSubmit && onSubmit();
    mutate({ carId, authorId: sessionUser?.id ?? '', ...formData });
  };

  return { handleFormSubmit };
}
