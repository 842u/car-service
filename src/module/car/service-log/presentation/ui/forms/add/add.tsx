import { MAX_SERVICE_NOTE_LENGTH } from '@/car/service-log/domain/service-log/value-object/service-note/service-note.schema';
import { serviceCategoryLabelValueMapping } from '@/car/service-log/interface/ui/add-form.schema';
import { Button } from '@/ui/button/button';
import { Form } from '@/ui/form/form';

import { useAddForm } from './use-add';

export const ADD_FORM_TEST_ID = 'add-form';

export type AddFormProps = {
  carId: string;
  onSubmit?: () => void;
};

export function AddForm({ carId, onSubmit }: AddFormProps) {
  const {
    handleFormSubmit,
    handleFormReset,
    errors,
    register,
    isDirty,
    isValid,
    isSubmitting,
  } = useAddForm({ carId, onSubmit });

  return (
    <Form
      className="gap-4"
      data-testid={ADD_FORM_TEST_ID}
      variant="raw"
      onSubmit={handleFormSubmit}
    >
      <div className="md:flex md:gap-4">
        <Form.InputWrapper>
          <Form.Input
            required
            errorMessage={errors.serviceDate?.message}
            label="Date"
            name="serviceDate"
            register={register}
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
          checkboxLabelValueMapping={serviceCategoryLabelValueMapping}
          errorMessage={errors.categories?.message}
          label="Category"
          name="categories"
          register={register}
        />
      </Form.InputWrapper>
      <Form.Textarea
        errorMessage={errors.notes?.message}
        label="Notes"
        maxLength={MAX_SERVICE_NOTE_LENGTH}
        name="notes"
        placeholder="Enter notes"
        register={register}
      />
      <Form.InputWrapper>
        <Form.Input
          errorMessage={errors.serviceCost?.message}
          label="Cost"
          min={0}
          name="serviceCost"
          placeholder="Enter cost"
          register={register}
          registerOptions={{ valueAsNumber: true }}
          step={0.01}
          type="number"
        />
      </Form.InputWrapper>
      <Form.Controls>
        <Button disabled={!isDirty} onClick={handleFormReset}>
          Reset
        </Button>
        <Form.ButtonSubmit disabled={!isValid || isSubmitting}>
          Save
        </Form.ButtonSubmit>
      </Form.Controls>
    </Form>
  );
}
