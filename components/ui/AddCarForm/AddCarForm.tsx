import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useToasts } from '@/hooks/useToasts';
import { Drive, Fuel, Transmission } from '@/types';
import { enqueueRevokeObjectUrl } from '@/utils/general';
import { postNewCar } from '@/utils/supabase/general';
import {
  onErrorCarsInfiniteQueryMutation,
  onMutateCarsInfiniteQueryMutation,
} from '@/utils/tanstack/general';

import { Button } from '../Button/Button';
import { SubmitButton } from '../SubmitButton/SubmitButton';
import { AddCarFormFields } from './AddCarFormFields';

export type AddCarFormValues = {
  image: File | null;
  name: string | null;
  brand: string | null;
  model: string | null;
  licensePlates: string | null;
  vin: string | null;
  fuelType: Fuel | null;
  additionalFuelType: Fuel | null;
  transmissionType: Transmission | null;
  driveType: Drive | null;
  productionYear: number | null;
  engineCapacity: number | null;
  mileage: number | null;
  insuranceExpiration: string | null;
};

export const defaultAddCarFormValues: AddCarFormValues = {
  image: null,
  name: null,
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

type AddCarFormProps = {
  onSubmit?: () => void;
};

export function AddCarForm({ onSubmit }: AddCarFormProps) {
  const [inputImageUrl, setInputImageUrl] = useState<string | null>(null);

  const { addToast } = useToasts();

  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors, isValid, isDirty, isSubmitSuccessful },
  } = useForm<AddCarFormValues>({
    mode: 'onChange',
    defaultValues: defaultAddCarFormValues,
  });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (addCarFormData: AddCarFormValues) =>
      postNewCar(addCarFormData),
    onMutate: (addCarFormData) =>
      onMutateCarsInfiniteQueryMutation(
        addCarFormData,
        queryClient,
        inputImageUrl,
      ),
    onSuccess: () => {
      addToast('Car added successfully.', 'success');
    },
    onError: (error, _, context) =>
      onErrorCarsInfiniteQueryMutation(error, context, queryClient, addToast),
  });

  const submitHandler = async (formData: AddCarFormValues) => {
    onSubmit && onSubmit();
    mutate(formData, {
      onSettled: () => queryClient.invalidateQueries({ queryKey: ['cars'] }),
    });
  };

  const handleInputImageChange = (file: File | undefined | null) => {
    inputImageUrl && enqueueRevokeObjectUrl(inputImageUrl);
    setInputImageUrl((file && URL.createObjectURL(file)) || null);
  };

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful, reset]);

  return (
    <form
      className="border-accent-200 dark:border-accent-300 bg-light-500 dark:bg-dark-500 rounded-xl border-2 p-10 md:flex md:flex-wrap md:gap-x-10 lg:gap-x-5 lg:p-5"
      onSubmit={handleSubmit(submitHandler)}
    >
      <h2 className="text-xl">Add a new car</h2>
      <div className="bg-alpha-grey-200 my-4 h-[1px] w-full" />
      <AddCarFormFields
        control={control}
        errors={errors}
        inputImageUrl={inputImageUrl}
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
        <SubmitButton className="w-full lg:max-w-48" disabled={!isValid}>
          Save
        </SubmitButton>
      </div>
    </form>
  );
}
