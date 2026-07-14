import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import type { Resolver } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import type { ServiceLogDto } from '@/car/service-log/application/dto/service-log';
import type { ServiceLogFormValues } from '@/car/service-log/interface/ui/service-log-form.schema';
import { serviceLogFormSchema } from '@/car/service-log/interface/ui/service-log-form.schema';
import { parseDateToYyyyMmDd } from '@/lib/utils';

// Computed per mount, not module load, so a long-lived tab doesn't hand out
// a stale "today" after the date rolls over.
function defaultFormValues(): ServiceLogFormValues {
  return {
    serviceDate: parseDateToYyyyMmDd(new Date()),
    categories: [],
    mileage: null,
    notes: null,
    serviceCost: null,
  };
}

function toFormValues(serviceLog: ServiceLogDto): ServiceLogFormValues {
  return {
    serviceDate: serviceLog.serviceDate,
    categories: serviceLog.categories,
    mileage: serviceLog.mileage ?? null,
    notes: serviceLog.notes ?? null,
    serviceCost: serviceLog.serviceCost ?? null,
  };
}

interface UseServiceLogFormParams {
  onSubmit?: (formValues: ServiceLogFormValues) => void;
  serviceLog?: ServiceLogDto;
}

export function useServiceLogForm({
  onSubmit,
  serviceLog,
}: UseServiceLogFormParams) {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isValid, isDirty, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(
      serviceLogFormSchema,
    ) as Resolver<ServiceLogFormValues>,
    mode: 'onChange',
    defaultValues: serviceLog ? toFormValues(serviceLog) : defaultFormValues(),
  });

  useEffect(() => {
    serviceLog && reset(toFormValues(serviceLog));
  }, [serviceLog, reset]);

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

  const handleFormSubmit = handleSubmit(
    (formValues: ServiceLogFormValues) => onSubmit && onSubmit(formValues),
  );

  const handleFormReset = () => reset();

  const canReset = !isDirty;

  const canSubmit = !isValid || !isDirty || isSubmitting;

  return {
    handleFormSubmit,
    handleFormReset,
    register,
    errors,
    canReset,
    canSubmit,
  };
}
