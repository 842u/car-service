import { Ref } from 'react';

import { CarFormValues } from '@/schemas/zod/carFormSchema';
import { Car } from '@/types';

import { Button } from '../shared/base/Button/Button';
import { Form } from '../shared/base/Form/Form';
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

export function CarForm({ ref, onSubmit, carData }: CarFormProps) {
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
    <Form
      className="md:w-fit md:flex-row md:flex-wrap md:justify-evenly"
      variant="raw"
      onSubmit={handleFormSubmit}
    >
      <CarFormFields
        control={control}
        errors={errors}
        inputImageUrl={inputImageUrl || carData?.image_url || null}
        register={register}
        onInputImageChange={handleInputImageChange}
      />
      <Form.Controls>
        <Button disabled={!isDirty} onClick={handleFormReset}>
          Reset
        </Button>
        <Form.ButtonSubmit disabled={!isValid || !isDirty}>
          Save
        </Form.ButtonSubmit>
      </Form.Controls>
    </Form>
  );
}
