import {
  CarServiceLogFormValues,
  MAX_SERVICE_NOTE_lENGTH,
} from '@/schemas/zod/carServiceLogFormSchema';
import { serviceCategoryMapping, ServiceLog } from '@/types';

import { Button } from '../base/Button/Button';
import { Form, FormProps } from '../base/Form/Form';
import { useCarServiceLogForm } from './useCarServiceLogForm';

export type CarServiceLogFormProps = Omit<FormProps, 'onSubmit'> & {
  onSubmit?: (formData: CarServiceLogFormValues) => void;
  carId?: string;
  serviceLog?: ServiceLog;
};

export function CarServiceLogForm({
  onSubmit,
  carId,
  serviceLog,
  ...props
}: CarServiceLogFormProps) {
  const {
    errors,
    handleFormSubmit,
    handleResetButtonClick,
    isDirty,
    isValid,
    register,
  } = useCarServiceLogForm({ onSubmit, serviceLog });

  return (
    <Form variant="raw" onSubmit={handleFormSubmit} {...props}>
      <Form.Input
        required
        errorMessage={errors.service_date?.message}
        label="Date"
        name="service_date"
        register={register}
        registerOptions={{ valueAsDate: false }}
        type="date"
      />
      <Form.CheckboxGroup
        required
        checkboxLabelValueMapping={serviceCategoryMapping}
        errorMessage={errors.category?.message}
        label="Category"
        name="category"
        register={register}
      />
      <Form.Input
        errorMessage={errors.mileage?.message}
        label="Mileage"
        min={0}
        name="mileage"
        register={register}
        registerOptions={{ valueAsNumber: true }}
        type="number"
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
        <Form.ButtonSubmit disabled={!isValid || !isDirty}>
          Save
        </Form.ButtonSubmit>
      </Form.Controls>
    </Form>
  );
}
