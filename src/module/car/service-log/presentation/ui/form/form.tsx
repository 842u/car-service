import type { ServiceLogDto } from '@/car/service-log/application/dto/service-log';
import { MAX_SERVICE_NOTE_LENGTH } from '@/car/service-log/domain/service-log/value-object/service-note/service-note.schema';
import type { ServiceLogFormValues } from '@/car/service-log/interface/ui/service-log-form.schema';
import { serviceCategoryLabelValueMapping } from '@/car/service-log/interface/ui/service-log-form.schema';
import { Button } from '@/ui/button/button';
import type { FormProps } from '@/ui/form/form';
import { Form } from '@/ui/form/form';

import { useServiceLogForm } from './use-form';

interface ServiceLogFormComponentProps extends Omit<
  FormProps,
  'ref' | 'onSubmit'
> {
  serviceLog?: ServiceLogDto;
  onSubmit?: (formValues: ServiceLogFormValues) => void;
}

export function ServiceLogForm({
  serviceLog,
  onSubmit,
  ...props
}: ServiceLogFormComponentProps) {
  const {
    handleFormSubmit,
    handleFormReset,
    errors,
    register,
    canReset,
    canSubmit,
  } = useServiceLogForm({ serviceLog, onSubmit });

  return (
    <Form
      className="gap-4"
      variant="raw"
      onSubmit={handleFormSubmit}
      {...props}
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
        <Button disabled={canReset} onClick={handleFormReset}>
          Reset
        </Button>
        <Form.ButtonSubmit disabled={canSubmit}>Save</Form.ButtonSubmit>
      </Form.Controls>
    </Form>
  );
}
