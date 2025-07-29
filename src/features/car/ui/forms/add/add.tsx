import { CarForm } from '@/car/ui/form/form';

import { useCarAddForm } from './use-car-add-form';

type AddFormProps = {
  onSubmit?: () => void;
};

export function AddForm({ onSubmit }: AddFormProps) {
  const { handleFormSubmit, carFormRef } = useCarAddForm({ onSubmit });

  return <CarForm ref={carFormRef} onSubmit={handleFormSubmit} />;
}
