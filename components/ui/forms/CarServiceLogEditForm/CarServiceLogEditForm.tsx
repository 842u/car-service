'use client';

import { ServiceLog } from '@/types';

import { FormProps } from '../../shared/base/Form/Form';
import { CarServiceLogForm } from '../../shared/CarServiceLogForm/CarServiceLogForm';
import { useCarServiceLogEditForm } from './useCarServiceLogEditForm';

export type CarServiceLogEditFormProps = Omit<FormProps, 'onSubmit'> & {
  serviceLog: ServiceLog;
  carId: string;
  onSubmit?: () => void;
};

export function CarServiceLogEditForm({
  serviceLog,
  carId,
  onSubmit,
}: CarServiceLogEditFormProps) {
  const { handleFormSubmit } = useCarServiceLogEditForm({
    carId,
    serviceLog,
    onSubmit,
  });

  return (
    <CarServiceLogForm serviceLog={serviceLog} onSubmit={handleFormSubmit} />
  );
}
