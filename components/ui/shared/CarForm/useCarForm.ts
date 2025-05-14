import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';

import { carFormSchema, CarFormValues } from '@/schemas/zod/carFormSchema';
import { enqueueRevokeObjectUrl } from '@/utils/general';

import { CarFormProps } from './CarForm';

const defaultCarFormValues: CarFormValues = {
  image: null,
  name: '',
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

export function useCarForm({
  onSubmit,
  ref,
  carData,
}: Omit<CarFormProps, 'title'>) {
  const [inputImageUrl, setInputImageUrl] = useState<string | null>(null);

  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors, isValid, isDirty, isSubmitSuccessful },
  } = useForm<CarFormValues>({
    resolver: zodResolver(carFormSchema),
    mode: 'onChange',
    defaultValues: defaultCarFormValues,
  });

  useImperativeHandle(ref, () => ({ inputImageUrl }), [inputImageUrl]);

  useEffect(() => {
    carData &&
      reset({
        additionalFuelType: carData.additional_fuel_type,
        brand: carData.brand,
        driveType: carData.drive_type,
        engineCapacity: carData.engine_capacity,
        fuelType: carData.fuel_type,
        insuranceExpiration: carData.insurance_expiration as unknown as Date,
        technicalInspectionExpiration:
          carData.technical_inspection_expiration as unknown as Date,
        licensePlates: carData.license_plates,
        mileage: carData.mileage,
        model: carData.model,
        name: carData.custom_name,
        productionYear: carData.production_year,
        transmissionType: carData.transmission_type,
        vin: carData.vin,
        image: null,
      });
  }, [carData, reset]);

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

  const handleInputImageChange = (file: File | undefined | null) => {
    inputImageUrl && enqueueRevokeObjectUrl(inputImageUrl);
    setInputImageUrl((file && URL.createObjectURL(file)) || null);
  };

  const handleFormSubmit = handleSubmit(
    (formValues: CarFormValues) => onSubmit && onSubmit(formValues),
  );

  const handleFormReset = () => reset();

  return {
    inputImageUrl,
    handleFormSubmit,
    handleInputImageChange,
    handleFormReset,
    register,
    control,
    errors,
    isDirty,
    isValid,
  };
}
