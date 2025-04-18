import { CarForm } from '../../shared/CarForm/CarForm';
import { useCarAddForm } from './useCarAddForm';

type CarAddFormProps = {
  onSubmit?: () => void;
};

export function CarAddForm({ onSubmit }: CarAddFormProps) {
  const { handleFormSubmit, carFormRef } = useCarAddForm({ onSubmit });

  return (
    <CarForm ref={carFormRef} title="Add a car" onSubmit={handleFormSubmit} />
  );
}
