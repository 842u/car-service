import { CarForm } from '@/car/ui/form/form';

import { useAddForm } from './use-add';

type AddFormProps = {
  onSubmit?: () => void;
};

export function AddForm({ onSubmit }: AddFormProps) {
  const { handleFormSubmit, carFormRef } = useAddForm({ onSubmit });

  return <CarForm ref={carFormRef} onSubmit={handleFormSubmit} />;
}
