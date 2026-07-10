import { useMutation, useQueryClient } from '@tanstack/react-query';

import { carEditMutationOptions } from '@/car/infrastructure/tanstack/mutation-options/edit';
import { carImageChangeMutationOptions } from '@/car/infrastructure/tanstack/mutation-options/image';
import { queryKeys } from '@/car/infrastructure/tanstack/query/keys';
import type { CarFormData } from '@/car/interface/ui/car-form.schema';
import { useToasts } from '@/common/presentation/hook/use-toasts';

interface UseEditFormParams {
  carId: string;
  onSubmit?: () => void;
}

export function useEditForm({ carId, onSubmit }: UseEditFormParams) {
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

  const changeImage = useMutation(carImageChangeMutationOptions());

  const handleFormSubmit = async (formData: CarFormData) => {
    onSubmit && onSubmit();

    const { image, ...contract } = formData;

    try {
      const car = await editCar.mutateAsync({ carId, image, ...contract });

      if (image) {
        try {
          await changeImage.mutateAsync({ carId: car.id, image });
        } catch (error) {
          if (error instanceof Error) addToast(error.message, 'warning');
        }
      }
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
