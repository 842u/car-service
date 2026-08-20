import { ServiceLogForm } from '@/car/service-log/presentation/ui/form/form';

import { useAddForm } from './use-add';

type AddFormProps = {
  carId: string;
  onSubmit?: () => void;
};

export function AddForm({ carId, onSubmit }: AddFormProps) {
  const { handleFormSubmit } = useAddForm({ carId, onSubmit });

  return <ServiceLogForm onSubmit={handleFormSubmit} />;
}
