import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';

import { useToasts } from '@/hooks/useToasts';
import { CarFormValues } from '@/schemas/zod/carFormSchema';
import { Car } from '@/types';
import { handleCarFormSubmit } from '@/utils/supabase/general';
import { onMutateCarsQueryPatch } from '@/utils/tanstack/general';

import { CarForm, CarFormRef } from './CarForm';

type EditCarFormProps = {
  carId: string;
  carData: Car | undefined;
  onSubmit?: () => void;
};

export function EditCarForm({ carId, carData, onSubmit }: EditCarFormProps) {
  const carFormRef = useRef<CarFormRef>(null);

  const { addToast } = useToasts();

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    throwOnError: false,
    mutationFn: (carFormData: CarFormValues) =>
      handleCarFormSubmit(carFormData, carId, 'PATCH'),
    onMutate: (carFormData) =>
      onMutateCarsQueryPatch(
        queryClient,
        carId,
        carFormData,
        carFormRef.current?.inputImageUrl || null,
      ),
    onSuccess: () => addToast('Car added successfully.', 'success'),
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
        queryClient.invalidateQueries({ queryKey: ['cars', carId] }),
    });
  };

  return (
    <CarForm
      ref={carFormRef}
      carData={carData}
      title="Edit a car"
      onSubmit={handleFormSubmit}
    />
  );
}
