import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';

import { useToasts } from '@/hooks/useToasts';
import { CarFormValues } from '@/schemas/zod/carFormSchema';
import { postNewCar } from '@/utils/supabase/general';
import {
  onErrorCarsInfiniteQueryMutation,
  onMutateCarsInfiniteQueryMutation,
} from '@/utils/tanstack/general';

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
    mutationFn: (carFormData: CarFormValues) => postNewCar(carFormData),
    onMutate: (carFormData) =>
      onMutateCarsInfiniteQueryMutation(
        carFormData,
        queryClient,
        carFormRef.current?.inputImageUrl || null,
      ),
    onSuccess: () => addToast('Car added successfully.', 'success'),
    onError: (error, _, context) =>
      onErrorCarsInfiniteQueryMutation(error, context, queryClient, addToast),
  });

  const handleFormSubmit = (carFormData: CarFormValues) => {
    onSubmit && onSubmit();
    mutate(carFormData, {
      onSettled: () =>
        queryClient.invalidateQueries({ queryKey: ['cars', 'infinite'] }),
    });
  };

  return (
    <CarForm ref={carFormRef} title="Add a car" onSubmit={handleFormSubmit} />
  );
}
