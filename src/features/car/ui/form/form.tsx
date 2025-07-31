import type { Ref } from 'react';

import type { CarFormValues } from '@/schemas/zod/carFormSchema';
import type { Car } from '@/types';
import { Button } from '@/ui/button/button';
import type { FormProps } from '@/ui/form/form';
import { Form } from '@/ui/form/form';

import { FormFields } from './fields/fields';
import { useCarForm } from './use-form';

export type CarFormRef = {
  imageInputUrl: string | null;
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
    handleImageInputChange,
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
      <FormFields
        control={control}
        errors={errors}
        inputImageUrl={inputImageUrl || carData?.image_url || null}
        register={register}
        onImageInputChange={handleImageInputChange}
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
