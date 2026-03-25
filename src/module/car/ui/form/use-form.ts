import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import type { Resolver } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import type { CarFormValues } from '@/car/schemas/zod/carFormSchema';
import { carFormSchema } from '@/car/schemas/zod/carFormSchema';

import type { CarFormProps } from './form';

const defaultCarFormValues: CarFormValues = {
  image: null,
  custom_name: '',
  brand: null,
  model: null,
  license_plates: null,
  vin: null,
  fuel_type: null,
  additional_fuel_type: null,
  transmission_type: null,
  drive_type: null,
  production_year: null,
  engine_capacity: null,
  mileage: null,
  insurance_expiration: null,
  technical_inspection_expiration: null,
};

export function useCarForm({ onSubmit, carData }: CarFormProps) {
  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors, isValid, isDirty, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(carFormSchema) as Resolver<CarFormValues>,
    mode: 'onChange',
    defaultValues: defaultCarFormValues,
  });

  useEffect(() => {
    carData &&
      reset({
        ...carData,
        image: null,
      });
  }, [carData, reset]);

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

  const handleFormSubmit = handleSubmit(
    (formValues: CarFormValues) => onSubmit && onSubmit(formValues),
  );

  const handleFormReset = () => reset();

  const canReset = !isDirty;

  const canSubmit = !isValid || !isDirty;

  return {
    handleFormSubmit,
    handleFormReset,
    register,
    control,
    errors,
    canReset,
    canSubmit,
  };
}
