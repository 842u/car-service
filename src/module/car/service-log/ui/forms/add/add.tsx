import type { FormProps } from '@/ui/form/form';

import { ServiceLogForm } from '../../form/form';
import { useAddForm } from './use-add';

export type AddFormProps = Omit<FormProps, 'onSubmit'> & {
  carId: string;
  onSubmit?: () => void;
};

export function AddForm({ carId, onSubmit, ...props }: AddFormProps) {
  const { handleFormSubmit } = useAddForm({ carId, onSubmit });

  return <ServiceLogForm onSubmit={handleFormSubmit} {...props} />;
}
