import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import type { CarServiceLogFormValues } from '@/schemas/zod/carServiceLogFormSchema';
import { carServiceLogFormSchema } from '@/schemas/zod/carServiceLogFormSchema';
import { parseDateToYyyyMmDd } from '@/utils/general';

import type { ServiceLogFormProps } from './form';

export function useServiceLogForm({
  onSubmit,
  serviceLog,
}: Omit<ServiceLogFormProps, 'carId'>) {
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, isValid, isDirty, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(carServiceLogFormSchema),
    mode: 'onChange',
    defaultValues: serviceLog
      ? {
          ...serviceLog,
        }
      : {
          // Intentionally do not set required category to enforce user do it.
          service_date: parseDateToYyyyMmDd(new Date()),
          mileage: null,
          notes: null,
          service_cost: null,
          category: [],
        },
  });

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

  useEffect(() => {
    if (serviceLog) {
      reset(serviceLog);
    }
  }, [serviceLog, reset]);

  const handleResetButtonClick = () => reset();

  const handleFormSubmit = handleSubmit((formData: CarServiceLogFormValues) => {
    formData.category.sort();
    onSubmit && onSubmit(formData);
  });

  return {
    register,
    errors,
    isValid,
    isDirty,
    handleResetButtonClick,
    handleFormSubmit,
  };
}
