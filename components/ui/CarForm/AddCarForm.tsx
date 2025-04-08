import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';

import { useToasts } from '@/hooks/useToasts';
import { CarFormValues } from '@/schemas/zod/carFormSchema';
import { handleCarFormSubmit } from '@/utils/supabase/tables/cars';
import {
  carsInfiniteAddOnError,
  carsInfiniteAddOnMutate,
} from '@/utils/tanstack/cars';
import { queryKeys } from '@/utils/tanstack/keys';

import { CarForm, CarFormRef } from './CarForm';

type AddCarFormProps = {
  onSubmit?: () => void;
};

export function AddCarForm({ onSubmit }: AddCarFormProps) {
  const carFormRef = useRef<CarFormRef>(null);

  const { addToast } = useToasts();

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    throwOnError: false,
    mutationFn: (carFormData: CarFormValues) =>
      handleCarFormSubmit(carFormData, null, 'POST'),
    onMutate: (carFormData) =>
      carsInfiniteAddOnMutate(
        carFormData,
        queryClient,
        carFormRef.current?.inputImageUrl || null,
      ),
    onSuccess: () => addToast('Car added successfully.', 'success'),
    onError: (error, _, context) =>
      carsInfiniteAddOnError(error, context, queryClient, addToast),
  });

  const handleFormSubmit = (carFormData: CarFormValues) => {
    onSubmit && onSubmit();
    mutate(carFormData, {
      onSettled: () =>
        queryClient.invalidateQueries({ queryKey: queryKeys.infiniteCars }),
    });
  };

  return (
    <CarForm ref={carFormRef} title="Add a car" onSubmit={handleFormSubmit} />
  );
}
