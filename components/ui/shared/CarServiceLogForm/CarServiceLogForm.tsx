import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import {
  carServiceLogFormSchema,
  CarServiceLogFormValues,
  MAX_SERVICE_NOTE_lENGTH,
} from '@/schemas/zod/carServiceLogFormSchema';
import { serviceCategoryMapping, ServiceLog } from '@/types';
import { parseDateToYyyyMmDd } from '@/utils/general';

import { Button } from '../base/Button/Button';
import { Form, FormProps } from '../base/Form/Form';

type CarServiceLogFormProps = Omit<FormProps, 'onSubmit'> & {
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
    handleSubmit,
    reset,
    register,
    formState: { errors, isValid, isDirty, isSubmitSuccessful },
  } = useForm<CarServiceLogFormValues>({
    resolver: zodResolver(carServiceLogFormSchema),
    mode: 'onChange',
    defaultValues: serviceLog
      ? {
          category: serviceLog.category,
          mileage: serviceLog.mileage,
          notes: serviceLog.notes,
          service_cost: serviceLog.service_cost,
          service_date: serviceLog.service_date,
        }
      : {
          // Intentionally do not set required category to enforce user do it.
          service_date: parseDateToYyyyMmDd(new Date()),
          mileage: null,
          notes: null,
          service_cost: null,
        },
  });

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

  const handleResetButtonClick = () => reset();

  const handleFormSubmit = handleSubmit(
    (formData: CarServiceLogFormValues) => onSubmit && onSubmit(formData),
  );

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
      <Form.Select
        required
        errorMessage={errors.category?.message}
        label="Category"
        name="category"
        options={serviceCategoryMapping}
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
