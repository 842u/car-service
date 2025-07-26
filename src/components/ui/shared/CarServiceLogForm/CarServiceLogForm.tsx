import {
  CarServiceLogFormValues,
  MAX_SERVICE_NOTE_lENGTH,
} from '@/schemas/zod/carServiceLogFormSchema';
import { serviceCategoryMapping, ServiceLog } from '@/types';

import { Button } from '../../../../features/common/ui/Button/Button';
import { Form, FormProps } from '../../../../features/common/ui/Form/Form';
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
      <div className="md:flex md:gap-4">
        <Form.InputWrapper>
          <Form.Input
            required
            errorMessage={errors.service_date?.message}
            label="Date"
            name="service_date"
            register={register}
            registerOptions={{ valueAsDate: false }}
            type="date"
          />
        </Form.InputWrapper>
        <Form.InputWrapper>
          <Form.Input
            errorMessage={errors.mileage?.message}
            label="Mileage"
            min={0}
            name="mileage"
            placeholder="Enter mileage"
            register={register}
            registerOptions={{ valueAsNumber: true }}
            type="number"
          />
        </Form.InputWrapper>
      </div>
      <Form.InputWrapper>
        <Form.CheckboxGroup
          required
          checkboxLabelValueMapping={serviceCategoryMapping}
          errorMessage={errors.category?.message}
          label="Category"
          name="category"
          register={register}
        />
      </Form.InputWrapper>
      <Form.Textarea
        errorMessage={errors.notes?.message}
        label="Notes"
        maxLength={MAX_SERVICE_NOTE_lENGTH}
        name="notes"
        placeholder="Enter notes"
        register={register}
      />
      <Form.InputWrapper>
        <Form.Input
          errorMessage={errors.service_cost?.message}
          label="Cost"
          min={0}
          name="service_cost"
          placeholder="Enter cost"
          register={register}
          registerOptions={{ valueAsNumber: true }}
          step={0.01}
          type="number"
        />
      </Form.InputWrapper>
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
