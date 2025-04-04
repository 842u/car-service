import { zodResolver } from '@hookform/resolvers/zod';
import { Ref, useEffect, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';

import { carFormSchema, CarFormValues } from '@/schemas/zod/carFormSchema';
import { Car } from '@/types';
import { enqueueRevokeObjectUrl } from '@/utils/general';

import { Button } from '../Button/Button';
import { SubmitButton } from '../SubmitButton/SubmitButton';
import { CarFormFields } from './CarFormFields';

export const defaultCarFormValues: CarFormValues = {
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
};

export type CarFormRef = {
  inputImageUrl: string | null;
};

type CarFormProps = {
  title: string;
  ref: Ref<CarFormRef>;
  onSubmit: (carFormData: CarFormValues) => void;
  carData?: Car;
};

export function CarForm({ title, ref, onSubmit, carData }: CarFormProps) {
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

  const handleInputImageChange = (file: File | undefined | null) => {
    inputImageUrl && enqueueRevokeObjectUrl(inputImageUrl);
    setInputImageUrl((file && URL.createObjectURL(file)) || null);
  };

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

  return (
    <form
      className="border-accent-200 dark:border-accent-300 bg-light-500 dark:bg-dark-500 rounded-xl border-2 p-10 md:flex md:flex-wrap md:gap-x-10 lg:gap-x-5 lg:p-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-xl">{title}</h2>
      <div className="bg-alpha-grey-200 my-4 h-[1px] w-full" />
      <CarFormFields
        control={control}
        errors={errors}
        inputImageUrl={inputImageUrl || carData?.image_url || null}
        register={register}
        onInputImageChange={handleInputImageChange}
      />
      <div className="mt-5 flex gap-10 md:flex-auto md:basis-full lg:justify-end lg:gap-5">
        <Button
          className="w-full lg:max-w-48"
          disabled={!isDirty}
          onClick={() => reset()}
        >
          Reset
        </Button>
        <SubmitButton
          className="w-full lg:max-w-48"
          disabled={!isValid || !isDirty}
        >
          Save
        </SubmitButton>
      </div>
    </form>
  );
}
