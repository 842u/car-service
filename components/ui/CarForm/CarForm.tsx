import { Ref } from 'react';

import { CarFormValues } from '@/schemas/zod/carFormSchema';
import { Car } from '@/types';

import { Button } from '../Button/Button';
import { SubmitButton } from '../SubmitButton/SubmitButton';
import { CarFormFields } from './CarFormFields';
import { useCarForm } from './useCarForm';

export type CarFormRef = {
  inputImageUrl: string | null;
};

export type CarFormProps = {
  title: string;
  ref: Ref<CarFormRef>;
  onSubmit: (carFormData: CarFormValues) => void;
  carData?: Car;
};

export function CarForm({ title, ref, onSubmit, carData }: CarFormProps) {
  const {
    inputImageUrl,
    handleFormSubmit,
    handleInputImageChange,
    handleFormReset,
    register,
    control,
    errors,
    isDirty,
    isValid,
  } = useCarForm({
    onSubmit,
    ref,
    carData,
  });

  return (
    <form
      className="border-accent-200 dark:border-accent-300 bg-light-500 dark:bg-dark-500 rounded-xl border-2 p-10 md:flex md:flex-wrap md:gap-x-10 lg:gap-x-5 lg:p-5"
      onSubmit={handleFormSubmit}
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
          onClick={handleFormReset}
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
