import type { CarFormValues } from '@/car/schemas/zod/carFormSchema';
import type { Car } from '@/types';
import { Button } from '@/ui/button/button';
import type { FormProps } from '@/ui/form/form';
import { Form } from '@/ui/form/form';

import { FormFields } from './fields/fields';
import { useCarForm } from './use-form';

export type CarFormProps = Omit<FormProps, 'ref' | 'onSubmit'> & {
  onSubmit?: (carFormData: CarFormValues) => void;
  carData?: Car;
};

export function CarForm({ onSubmit, carData, ...props }: CarFormProps) {
  const {
    handleFormSubmit,
    handleFormReset,
    register,
    control,
    errors,
    canReset,
    canSubmit,
  } = useCarForm({
    onSubmit,
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
        imageUrl={carData?.image_url}
        register={register}
      />
      <Form.Controls>
        <Button disabled={canReset} onClick={handleFormReset}>
          Reset
        </Button>
        <Form.ButtonSubmit disabled={canSubmit}>Save</Form.ButtonSubmit>
      </Form.Controls>
    </Form>
  );
}
