import { ServiceLogForm } from '@/car/service-log/presentation/ui/form/form';

import { useAddForm } from './use-add';

export const ADD_FORM_TEST_ID = 'add-form';

export type AddFormProps = {
  carId: string;
  onSubmit?: () => void;
};

export function AddForm({ carId, onSubmit }: AddFormProps) {
  const { handleFormSubmit } = useAddForm({ carId, onSubmit });

  return (
    <ServiceLogForm
      data-testid={ADD_FORM_TEST_ID}
      onSubmit={handleFormSubmit}
    />
  );
}
