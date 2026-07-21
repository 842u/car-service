import { useMutation, useQueryClient } from '@tanstack/react-query';

import { carEditMutationOptions } from '@/car/infrastructure/tanstack/mutation-options/edit';
import { queryKeys } from '@/car/infrastructure/tanstack/query/keys';
import type { CarFormData } from '@/car/interface/ui/car-form.schema';
import { useToasts } from '@/common/presentation/hook/use-toasts';

interface UseEditFormParams {
  carId: string;
  imageUrl?: string | null;
  onSubmit?: () => void;
}

export function useEditForm({ carId, imageUrl, onSubmit }: UseEditFormParams) {
  const { addToast } = useToasts();

  const queryClient = useQueryClient();

  const editCar = useMutation({
    ...carEditMutationOptions(queryClient),
    mutationKey: queryKeys.carsInfinite,
    onSuccess: (data) => addToast(`Car ${data.customName} edited.`, 'success'),
    onError: (error, _, context) => {
      addToast(error.message, 'error');
      queryClient.setQueryData(
        queryKeys.carsByCarId(carId),
        context?.previousCar,
      );
      queryClient.setQueryData(
        queryKeys.carsInfinite,
        context?.previousCarsInfiniteData,
      );
    },
  });

  const handleFormSubmit = async (formData: CarFormData) => {
    onSubmit && onSubmit();

    const { image, ...contract } = formData;

    try {
      // A save that doesn't pick a new file must not clear the existing
      // image under full-replace, so fall back to what's already there.
      await editCar.mutateAsync({
        carId,
        image,
        ...contract,
        imageUrl: image ? undefined : imageUrl,
      });
    } catch {
      return;
    } finally {
      queryClient.invalidateQueries({
        queryKey: queryKeys.carsByCarId(carId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.carsInfinite });
    }
  };

  return { handleFormSubmit };
}
