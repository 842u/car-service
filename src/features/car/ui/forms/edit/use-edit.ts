import {
  QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { RefObject, useRef } from 'react';

import { useToasts } from '@/common/hooks/use-toasts';
import { CarFormValues } from '@/schemas/zod/carFormSchema';
import { handleCarFormSubmit } from '@/utils/supabase/tables/cars';
import { carsUpdateOnMutate } from '@/utils/tanstack/cars';
import { queryKeys } from '@/utils/tanstack/keys';

import { CarFormRef } from '../../form/form';

export type UseEditFormOptions = {
  carId: string;
  onSubmit?: () => void;
};

type MutationVariables = {
  formData: CarFormValues;
  carId: string;
  queryClient: QueryClient;
  carFormRef: RefObject<CarFormRef | null>;
};

export function useEditForm({ carId, onSubmit }: UseEditFormOptions) {
  const carFormRef = useRef<CarFormRef>(null);

  const { addToast } = useToasts();

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    throwOnError: false,
    mutationFn: ({ formData, carId }: MutationVariables) =>
      handleCarFormSubmit(formData, carId, 'PATCH'),
    onMutate: ({ formData, carId, queryClient, carFormRef }) =>
      carsUpdateOnMutate(
        queryClient,
        carId,
        formData,
        carFormRef.current?.imageInputUrl || null,
      ),
    onSuccess: (_, { formData: { custom_name } }) =>
      addToast(`Car ${custom_name} edited.`, 'success'),
    onError: (error, { carId, queryClient }, context) => {
      addToast(error.message, 'error');

      queryClient.setQueryData(['cars', carId], context?.previousCarsQueryData);
    },
  });

  const handleFormSubmit = (formData: CarFormValues) => {
    onSubmit && onSubmit();

    mutate(
      { formData, queryClient, carId, carFormRef },
      {
        onSettled: (_, __, { carId, queryClient }) =>
          queryClient.invalidateQueries({
            queryKey: queryKeys.carsByCarId(carId),
          }),
      },
    );
  };

  return { handleFormSubmit, carFormRef };
}
