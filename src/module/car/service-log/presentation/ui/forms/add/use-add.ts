import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { Resolver } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import { serviceLogAddMutationOptions } from '@/car/service-log/infrastructure/tanstack/mutation-options/add';
import type { AddServiceLogFormValues } from '@/car/service-log/interface/ui/add-form.schema';
import { addServiceLogFormSchema } from '@/car/service-log/interface/ui/add-form.schema';
import { useToasts } from '@/common/presentation/hook/use-toasts';
import { useSessionUser } from '@/user/presentation/hooks/use-session-user';

import type { AddFormProps } from './add';

const defaultAddFormValues: AddServiceLogFormValues = {
  serviceDate: '',
  categories: [],
  mileage: null,
  notes: null,
  serviceCost: null,
};

export function useAddForm({ carId, onSubmit }: AddFormProps) {
  const { data: sessionUser } = useSessionUser();

  const { addToast } = useToasts();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(
      addServiceLogFormSchema,
    ) as Resolver<AddServiceLogFormValues>,
    mode: 'onChange',
    defaultValues: defaultAddFormValues,
  });

  const queryClient = useQueryClient();

  // onSubmit closes the add modal, unmounting this form before the request
  // settles. React Query drops callbacks passed to mutate() once the caller
  // unmounts, so the toasts live on the mutation options (which still run).
  // onError is composed so the options' optimistic rollback still runs.
  const addMutationOptions = serviceLogAddMutationOptions(queryClient);

  const { mutate } = useMutation({
    ...addMutationOptions,
    onSuccess: () => addToast('Service log added.', 'success'),
    onError: (...args) => {
      addMutationOptions.onError?.(...args);
      addToast(args[0].message, 'error');
    },
  });

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

  const handleFormSubmit = handleSubmit((formData: AddServiceLogFormValues) => {
    onSubmit && onSubmit();
    mutate({ carId, authorId: sessionUser?.id ?? '', ...formData });
  });

  const handleFormReset = () => reset();

  return {
    handleFormSubmit,
    handleFormReset,
    register,
    errors,
    isSubmitting,
    isValid,
    isDirty,
  };
}
