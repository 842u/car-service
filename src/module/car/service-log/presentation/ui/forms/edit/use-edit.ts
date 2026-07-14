import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { ServiceLogDto } from '@/car/service-log/application/dto/service-log';
import { serviceLogEditMutationOptions } from '@/car/service-log/infrastructure/tanstack/mutation-options/edit';
import type { ServiceLogFormValues } from '@/car/service-log/interface/ui/service-log-form.schema';
import { useToasts } from '@/common/presentation/hook/use-toasts';

interface UseEditFormParams {
  serviceLog: ServiceLogDto;
  onSubmit?: () => void;
}

export function useEditForm({ serviceLog, onSubmit }: UseEditFormParams) {
  const { addToast } = useToasts();

  const queryClient = useQueryClient();

  // The modal unmounts this form as soon as onSubmit fires, before the
  // request settles. React Query drops callbacks passed to mutate() once the
  // caller unmounts, so the toasts live on the mutation options (which still
  // run). onError is composed so the options' optimistic rollback still runs.
  const editMutationOptions = serviceLogEditMutationOptions(queryClient);

  const { mutate } = useMutation({
    ...editMutationOptions,
    onSuccess: () => addToast('Service log edited.', 'success'),
    onError: (...args) => {
      editMutationOptions.onError?.(...args);
      addToast(args[0].message, 'error');
    },
  });

  const handleFormSubmit = (formData: ServiceLogFormValues) => {
    onSubmit && onSubmit();
    mutate({
      serviceLogId: serviceLog.id,
      carId: serviceLog.carId,
      ...formData,
    });
  };

  return { handleFormSubmit };
}
