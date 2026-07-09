import type { CarFormValues } from '@/car/schemas/zod/carFormSchema';
import type { Car } from '@/types';
import { Button } from '@/ui/button/button';
import type { FormProps } from '@/ui/form/form';
import { Form } from '@/ui/form/form';

import { FormFields } from './fields/fields';
import { useCarForm } from './use-form';

interface CarFormProps extends Omit<FormProps, 'ref' | 'onSubmit'> {
  car?: Car;
  onSubmit?: (carFormData: CarFormValues) => void;
}

export function CarForm({ onSubmit, car, ...props }: CarFormProps) {
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
    car,
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
        imageUrl={car?.image_url}
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
