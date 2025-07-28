import { CarForm } from '../CarForm/CarForm';
import { useCarAddForm } from './useCarAddForm';

type CarAddFormProps = {
  onSubmit?: () => void;
};

export function CarAddForm({ onSubmit }: CarAddFormProps) {
  const { handleFormSubmit, carFormRef } = useCarAddForm({ onSubmit });

  return <CarForm ref={carFormRef} onSubmit={handleFormSubmit} />;
}
