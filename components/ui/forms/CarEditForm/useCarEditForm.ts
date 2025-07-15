import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';

import { useToasts } from '@/hooks/useToasts';
import { CarFormValues } from '@/schemas/zod/carFormSchema';
import { handleCarFormSubmit } from '@/utils/supabase/tables/cars';
import { carsUpdateOnMutate } from '@/utils/tanstack/cars';
import { queryKeys } from '@/utils/tanstack/keys';

import { CarFormRef } from '../../shared/CarForm/CarForm';

export type UseCarEditFormOptions = {
  carId: string;
  onSubmit?: () => void;
};

export function useCarEditForm({ carId, onSubmit }: UseCarEditFormOptions) {
  const carFormRef = useRef<CarFormRef>(null);

  const { addToast } = useToasts();

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    throwOnError: false,
    mutationFn: (carFormData: CarFormValues) =>
      handleCarFormSubmit(carFormData, carId, 'PATCH'),
    onMutate: (carFormData) =>
      carsUpdateOnMutate(
        queryClient,
        carId,
        carFormData,
        carFormRef.current?.inputImageUrl || null,
      ),
    onSuccess: (_, variables) =>
      addToast(`Car ${variables.custom_name} edited.`, 'success'),
    onError: (error, _, context) => {
      addToast(error.message, 'error');

      queryClient.setQueryData(
        ['cars', context?.carId],
        context?.previousCarsQueryData,
      );
    },
  });

  const handleFormSubmit = (carFormData: CarFormValues) => {
    onSubmit && onSubmit();

    mutate(carFormData, {
      onSettled: () =>
        queryClient.invalidateQueries({
          queryKey: queryKeys.carsByCarId(carId),
        }),
    });
  };

  return { handleFormSubmit, carFormRef };
}
