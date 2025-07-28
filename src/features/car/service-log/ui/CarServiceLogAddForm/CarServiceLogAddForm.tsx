import { FormProps } from '@/features/common/ui/form/form';

import { CarServiceLogForm } from '../CarServiceLogForm/CarServiceLogForm';
import { useCarServiceLogAddForm } from './useCarServiceLogAddForm';

export type CarServiceLogAddFormProps = Omit<FormProps, 'onSubmit'> & {
  carId: string;
  onSubmit?: () => void;
};

export function CarServiceLogAddForm({
  carId,
  onSubmit,
  ...props
}: CarServiceLogAddFormProps) {
  const { handleFormSubmit } = useCarServiceLogAddForm({ carId, onSubmit });

  return <CarServiceLogForm onSubmit={handleFormSubmit} {...props} />;
}
