'use client';

import { ServiceLogForm } from '../../form/form';
import type { UseEditFormOptions } from './use-edit';
import { useEditForm } from './use-edit';

export type EditFormProps = UseEditFormOptions;

export function EditForm({ serviceLog, onSubmit }: EditFormProps) {
  const { handleFormSubmit } = useEditForm({
    serviceLog,
    onSubmit,
  });

  return <ServiceLogForm serviceLog={serviceLog} onSubmit={handleFormSubmit} />;
}
