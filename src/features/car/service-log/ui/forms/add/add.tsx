import { FormProps } from '@/ui/form/form';

import { ServiceLogForm } from '../../form/form';
import { useCarServiceLogAddForm } from './use-service-log-add-form';

export type AddFormProps = Omit<FormProps, 'onSubmit'> & {
  carId: string;
  onSubmit?: () => void;
};

export function AddForm({ carId, onSubmit, ...props }: AddFormProps) {
  const { handleFormSubmit } = useCarServiceLogAddForm({ carId, onSubmit });

  return <ServiceLogForm onSubmit={handleFormSubmit} {...props} />;
}
