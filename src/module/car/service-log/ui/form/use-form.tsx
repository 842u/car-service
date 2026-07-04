import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import type { CarServiceLogFormValues } from '@/car/schemas/zod/carServiceLogFormSchema';
import { carServiceLogFormSchema } from '@/car/schemas/zod/carServiceLogFormSchema';
import { parseDateToYyyyMmDd } from '@/lib/utils';

import type { ServiceLogFormProps } from './form';

const DEFAULT_FORM_VALUES: CarServiceLogFormValues = {
  // Intentionally do not set required category to enforce user do it.
  service_date: parseDateToYyyyMmDd(new Date()),
  mileage: null,
  notes: null,
  service_cost: null,
  category: [],
};

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
    defaultValues: DEFAULT_FORM_VALUES,
  });

  useEffect(() => {
    if (serviceLog) {
      reset(serviceLog);
    }
  }, [serviceLog, reset]);

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

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
