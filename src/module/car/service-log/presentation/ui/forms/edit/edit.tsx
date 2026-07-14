import type { ServiceLogDto } from '@/car/service-log/application/dto/service-log';
import { ServiceLogForm } from '@/car/service-log/presentation/ui/form/form';

import { useEditForm } from './use-edit';

export const EDIT_FORM_TEST_ID = 'edit-form';

export type EditFormProps = {
  serviceLog: ServiceLogDto;
  onSubmit?: () => void;
};

export function EditForm({ serviceLog, onSubmit }: EditFormProps) {
  const { handleFormSubmit } = useEditForm({ serviceLog, onSubmit });

  return (
    <ServiceLogForm
      data-testid={EDIT_FORM_TEST_ID}
      serviceLog={serviceLog}
      onSubmit={handleFormSubmit}
    />
  );
}
