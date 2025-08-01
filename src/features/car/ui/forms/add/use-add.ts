import type { QueryClient } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { RefObject } from 'react';
import { useRef } from 'react';

import { useToasts } from '@/common/hooks/use-toasts';
import type { CarFormValues } from '@/schemas/zod/carFormSchema';
import { handleCarFormSubmit } from '@/utils/supabase/tables/cars';
import {
  carsInfiniteAddOnError,
  carsInfiniteAddOnMutate,
} from '@/utils/tanstack/cars';
import { queryKeys } from '@/utils/tanstack/keys';

import type { CarFormRef } from '../../form/form';

type MutationVariables = {
  formData: CarFormValues;
  queryClient: QueryClient;
  carFormRef: RefObject<CarFormRef | null>;
};

export function useAddForm({
  onSubmit,
}: {
  onSubmit: (() => void) | undefined;
}) {
  const carFormRef = useRef<CarFormRef>(null);

  const { addToast } = useToasts();

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    throwOnError: false,
    mutationFn: ({ formData }: MutationVariables) =>
      handleCarFormSubmit(formData, null, 'POST'),
    onMutate: ({ formData, queryClient, carFormRef }) =>
      carsInfiniteAddOnMutate(
        formData,
        queryClient,
        carFormRef.current?.imageInputUrl || null,
      ),
    onSuccess: (_, { formData: { custom_name } }) =>
      addToast(`Car ${custom_name} added.`, 'success'),
    onError: (error, { queryClient }, context) =>
      carsInfiniteAddOnError(error, context, queryClient, addToast),
  });

  const handleFormSubmit = (formData: CarFormValues) => {
    onSubmit && onSubmit();
    mutate(
      { formData, queryClient, carFormRef },
      {
        onSettled: (_, __, { queryClient }) =>
          queryClient.invalidateQueries({ queryKey: queryKeys.infiniteCars }),
      },
    );
  };

  return { handleFormSubmit, carFormRef };
}
