import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  carServiceLogAddFormSchema,
  CarServiceLogAddFormValues,
  MAX_SERVICE_NOTE_lENGTH,
} from '@/schemas/zod/carServiceLogAddFormSchema';
import { serviceCategoryMapping } from '@/types';

import { Button } from '../../shared/base/Button/Button';
import { Form } from '../../shared/base/Form/Form';

export function CarServiceLogAddForm() {
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, isValid, isDirty },
  } = useForm<CarServiceLogAddFormValues>({
    resolver: zodResolver(carServiceLogAddFormSchema),
    mode: 'onChange',
  });

  const handleResetButtonClick = () => reset();

  const handleFormSubmit = handleSubmit(
    (formData: CarServiceLogAddFormValues) => {
      // console.log(formData);
      return formData;
    },
  );

  return (
    <Form variant="raw" onSubmit={handleFormSubmit}>
      <Form.Input
        required
        errorMessage={errors.service_date?.message}
        label="Date"
        name="service_date"
        register={register}
        type="date"
      />
      <Form.Input
        required
        errorMessage={errors.mileage?.message}
        label="Mileage"
        min={0}
        name="mileage"
        register={register}
        registerOptions={{ valueAsNumber: true }}
        type="number"
      />
      <Form.Select
        required
        errorMessage={errors.category?.message}
        label="Category"
        name="category"
        options={serviceCategoryMapping}
        register={register}
      />
      <Form.Input
        errorMessage={errors.notes?.message}
        label="Notes"
        maxLength={MAX_SERVICE_NOTE_lENGTH}
        name="notes"
        register={register}
        type="text"
      />
      <Form.Input
        errorMessage={errors.service_cost?.message}
        label="Cost"
        min={0}
        name="service_cost"
        register={register}
        registerOptions={{ valueAsNumber: true }}
        step={0.01}
        type="number"
      />
      <Form.Controls>
        <Button disabled={!isDirty} onClick={handleResetButtonClick}>
          Reset
        </Button>
        <Form.ButtonSubmit disabled={!isValid}>Save</Form.ButtonSubmit>
      </Form.Controls>
    </Form>
  );
}
