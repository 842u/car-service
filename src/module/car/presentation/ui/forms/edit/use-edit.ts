import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CarFormData } from '@/car/interface/ui/car-form.schema';
import { carEditMutationOptions } from '@/car/presentation/tanstack/mutation-options/edit';
import { queryKeys } from '@/car/presentation/tanstack/query/keys';
import { useToasts } from '@/common/presentation/hook/use-toasts';

interface UseEditFormParams {
  carId: string;
  onSubmit?: () => void;
}

export function useEditForm({ carId, onSubmit }: UseEditFormParams) {
  const { addToast } = useToasts();

  const queryClient = useQueryClient();

  const editMutationOptions = carEditMutationOptions(queryClient);

  const editCar = useMutation({
    ...editMutationOptions,
    onSuccess: (data) => addToast(`Car ${data.customName} edited.`, 'success'),
    onError: (...args) => {
      editMutationOptions.onError?.(...args);
      addToast(args[0].message, 'error');
    },
  });

  const handleFormSubmit = async (formData: CarFormData) => {
    onSubmit && onSubmit();

    const { image, ...contract } = formData;

    try {
      // Omitting imageUrl when no new file is picked leaves the existing
      // image untouched; the mutation sets it only after a successful upload.
      await editCar.mutateAsync({ carId, image, ...contract });
    } catch {
      return;
    } finally {
      queryClient.invalidateQueries({ queryKey: queryKeys.all() });
    }
  };

  return { handleFormSubmit };
}
