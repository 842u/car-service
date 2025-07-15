'use client';

import { CarServiceLogForm } from '../../shared/CarServiceLogForm/CarServiceLogForm';
import {
  useCarServiceLogEditForm,
  UseCarServiceLogEditFormOptions,
} from './useCarServiceLogEditForm';

export type CarServiceLogEditFormProps = UseCarServiceLogEditFormOptions;

export function CarServiceLogEditForm({
  serviceLog,
  onSubmit,
}: CarServiceLogEditFormProps) {
  const { handleFormSubmit } = useCarServiceLogEditForm({
    serviceLog,
    onSubmit,
  });

  return (
    <CarServiceLogForm serviceLog={serviceLog} onSubmit={handleFormSubmit} />
  );
}
