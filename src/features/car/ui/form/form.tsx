import { Ref } from 'react';

import { CarFormValues } from '@/schemas/zod/carFormSchema';
import { Car } from '@/types';
import { Button } from '@/ui/button-tempname/button-tempname';
import { Form, FormProps } from '@/ui/form-tempname/form-tempname';

import { Fields } from './fields';
import { useCarForm } from './use-car-form';

export type CarFormRef = {
  inputImageUrl: string | null;
};

export type CarFormProps = Omit<FormProps, 'ref' | 'onSubmit'> & {
  ref?: Ref<CarFormRef>;
  onSubmit?: (carFormData: CarFormValues) => void;
  carData?: Car;
};

export function CarForm({ ref, onSubmit, carData, ...props }: CarFormProps) {
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
      {...props}
    >
      <Fields
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
