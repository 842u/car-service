import { useMutation, useQueryClient } from '@tanstack/react-query';

import { carAddMutationOptions } from '@/car/infrastructure/tanstack/mutation-options/add';
import { carImageChangeMutationOptions } from '@/car/infrastructure/tanstack/mutation-options/image';
import {
  type CarsInfiniteQueryData,
  deepCopyCarsInfiniteQueryData,
} from '@/car/infrastructure/tanstack/mutation-options/shared/infinite-query-data';
import { queryKeys } from '@/car/infrastructure/tanstack/query/keys';
import type { CarFormData } from '@/car/interface/ui/car-form.schema';
import { useToasts } from '@/common/presentation/hook/use-toasts';

export function useAddForm({
  onSubmit,
}: {
  onSubmit: (() => void) | undefined;
}) {
  const { addToast } = useToasts();

  const queryClient = useQueryClient();

  const addCar = useMutation({
    ...carAddMutationOptions(queryClient),
    mutationKey: queryKeys.carsInfinite,
    onSuccess: (data) => addToast(`Car ${data.customName} added.`, 'success'),
    onError: (error, _, context) => {
      addToast(error.message, 'error');

      if (!context) return;

      const previousData = queryClient.getQueryData<CarsInfiniteQueryData>(
        queryKeys.carsInfinite,
      );

      if (!previousData) return;

      const updatedQueryData = deepCopyCarsInfiniteQueryData(previousData);

      updatedQueryData.pages.forEach((page) => {
        page.data = page.data.filter(
          (car) => car && car.id !== context.newCarId,
        );
      });

      queryClient.setQueryData(queryKeys.carsInfinite, updatedQueryData);
    },
  });

  const changeImage = useMutation(carImageChangeMutationOptions());

  const handleFormSubmit = async (formData: CarFormData) => {
    onSubmit && onSubmit();

    const { image, ...contract } = formData;

    try {
      const car = await addCar.mutateAsync({ image, ...contract });

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
      queryClient.invalidateQueries({ queryKey: queryKeys.carsInfinite });
    }
  };

  return { handleFormSubmit };
}
