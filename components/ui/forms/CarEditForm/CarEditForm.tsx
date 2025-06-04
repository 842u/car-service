import { CarForm } from '../../shared/CarForm/CarForm';
import { useCarEditForm } from './useCarEditForm';

export type CarEditFormProps = {
  onSubmit?: () => void;
};

export function CarEditForm({ onSubmit }: CarEditFormProps) {
  const { handleFormSubmit, carFormRef, car } = useCarEditForm({ onSubmit });

  return <CarForm ref={carFormRef} carData={car} onSubmit={handleFormSubmit} />;
}
