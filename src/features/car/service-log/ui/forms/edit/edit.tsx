'use client';

import { ServiceLogForm } from '../../form/form';
import {
  useCarServiceLogEditForm,
  UseCarServiceLogEditFormOptions,
} from './use-service-log-edit-form';

export type EditFormProps = UseCarServiceLogEditFormOptions;

export function EditForm({ serviceLog, onSubmit }: EditFormProps) {
  const { handleFormSubmit } = useCarServiceLogEditForm({
    serviceLog,
    onSubmit,
  });

  return <ServiceLogForm serviceLog={serviceLog} onSubmit={handleFormSubmit} />;
}
