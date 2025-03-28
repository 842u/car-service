import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useToasts } from '@/hooks/useToasts';
import { carFormSchema, CarFormValues } from '@/schemas/zod/carFormSchema';
import { enqueueRevokeObjectUrl } from '@/utils/general';
import { postNewCar } from '@/utils/supabase/general';
import {
  onErrorCarsInfiniteQueryMutation,
  onMutateCarsInfiniteQueryMutation,
} from '@/utils/tanstack/general';

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

type CarFormProps = {
  onSubmit?: () => void;
};

export function CarForm({ onSubmit }: CarFormProps) {
  const [inputImageUrl, setInputImageUrl] = useState<string | null>(null);

  const { addToast } = useToasts();

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

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    throwOnError: false,
    mutationFn: (carFormData: CarFormValues) => postNewCar(carFormData),
    onMutate: (carFormData) =>
      onMutateCarsInfiniteQueryMutation(
        carFormData,
        queryClient,
        inputImageUrl,
      ),
    onSuccess: () => addToast('Car added successfully.', 'success'),
    onError: (error, _, context) =>
      onErrorCarsInfiniteQueryMutation(error, context, queryClient, addToast),
  });

  const submitHandler = async (carFormData: CarFormValues) => {
    onSubmit && onSubmit();
    mutate(carFormData, {
      onSettled: () =>
        queryClient.invalidateQueries({ queryKey: ['cars', 'infinite'] }),
    });
  };

  const handleInputImageChange = (file: File | undefined | null) => {
    inputImageUrl && enqueueRevokeObjectUrl(inputImageUrl);
    setInputImageUrl((file && URL.createObjectURL(file)) || null);
  };

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

  return (
    <form
      className="border-accent-200 dark:border-accent-300 bg-light-500 dark:bg-dark-500 rounded-xl border-2 p-10 md:flex md:flex-wrap md:gap-x-10 lg:gap-x-5 lg:p-5"
      onSubmit={handleSubmit(submitHandler)}
    >
      <h2 className="text-xl">Add a new car</h2>
      <div className="bg-alpha-grey-200 my-4 h-[1px] w-full" />
      <CarFormFields
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
