import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CarFormData } from '@/car/interface/ui/car-form.schema';
import { carAddMutationOptions } from '@/car/presentation/tanstack/mutation-options/add';
import { carEditMutationOptions } from '@/car/presentation/tanstack/mutation-options/edit';
import { queryKeys } from '@/car/presentation/tanstack/query/keys';
import { useToasts } from '@/common/presentation/hook/use-toasts';

export function useAddForm({
  onSubmit,
}: {
  onSubmit: (() => void) | undefined;
}) {
  const { addToast } = useToasts();

  const queryClient = useQueryClient();

  const addMutationOptions = carAddMutationOptions(queryClient);

  const addCar = useMutation({
    ...addMutationOptions,
    onSuccess: (...args) => {
      addMutationOptions.onSuccess?.(...args);
      addToast(`Car ${args[0].customName} added.`, 'success');
    },
    onError: (...args) => {
      addMutationOptions.onError?.(...args);
      addToast(args[0].message, 'error');
    },
  });

  // A Car is always born imageless (add has no imageUrl field): attaching a
  // picked image is a follow-up edit of the just-created car, not part of
  // creating it, so a failed upload/attach here doesn't undo the car.
  const attachImage = useMutation(carEditMutationOptions(queryClient));

  const handleFormSubmit = async (formData: CarFormData) => {
    onSubmit && onSubmit();

    const { image, ...contract } = formData;

    try {
      const car = await addCar.mutateAsync({ image, ...contract });

      if (image) {
        try {
          await attachImage.mutateAsync({ carId: car.id, image });
        } catch (error) {
          if (error instanceof Error) addToast(error.message, 'warning');
        }
      }
    } catch {
      return;
    } finally {
      queryClient.invalidateQueries({ queryKey: queryKeys.infinite() });
    }
  };

  return { handleFormSubmit };
}
