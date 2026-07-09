import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import type { Resolver } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import type { CarDto } from '@/car/application/dto/car';
import type { CarFormData } from '@/car/interface/ui/car-form.schema';
import { carFormDataSchema } from '@/car/interface/ui/car-form.schema';

const DEFAULT_FORM_VALUES: CarFormData = {
  image: null,
  customName: '',
  brand: null,
  model: null,
  licensePlates: null,
  vin: null,
  fuelType: null,
  additionalFuelType: null,
  transmissionType: null,
  driveType: null,
  productionYear: null,
  engineCapacity: null,
  mileage: null,
  insuranceExpiration: null,
  technicalInspectionExpiration: null,
};

interface UseCarFormParams {
  onSubmit?: (carFormData: CarFormData) => void;
  car?: CarDto;
}

export function useCarForm({ onSubmit, car }: UseCarFormParams) {
  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors, isValid, isDirty, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(carFormDataSchema) as Resolver<CarFormData>,
    mode: 'onChange',
    defaultValues: DEFAULT_FORM_VALUES,
  });

  useEffect(() => {
    car &&
      reset({
        ...car,
        image: null,
      });
  }, [car, reset]);

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

  const handleFormSubmit = handleSubmit(
    (formValues: CarFormData) => onSubmit && onSubmit(formValues),
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
