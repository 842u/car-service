import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useImperativeHandle, useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';

import { carFormSchema, CarFormValues } from '@/schemas/zod/carFormSchema';
import { enqueueRevokeObjectUrl } from '@/utils/general';

import { CarFormProps } from './form';

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

export function useCarForm({ onSubmit, ref, carData }: CarFormProps) {
  const [imageInputUrl, setImageInputUrl] = useState<string | null>(null);

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

  useImperativeHandle(ref, () => ({ imageInputUrl }), [imageInputUrl]);

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

  const handleImageInputChange = (file: File | undefined | null) => {
    imageInputUrl && enqueueRevokeObjectUrl(imageInputUrl);
    setImageInputUrl((file && URL.createObjectURL(file)) || null);
  };

  const handleFormSubmit = handleSubmit(
    (formValues: CarFormValues) => onSubmit && onSubmit(formValues),
  );

  const handleFormReset = () => reset();

  return {
    inputImageUrl: imageInputUrl,
    handleFormSubmit,
    handleImageInputChange,
    handleFormReset,
    register,
    control,
    errors,
    isDirty,
    isValid,
  };
}
