import { CarForm } from '../../shared/CarForm/CarForm';
import { useAddCarForm } from './useAddCarForm';

type AddCarFormProps = {
  onSubmit?: () => void;
};

export function AddCarForm({ onSubmit }: AddCarFormProps) {
  const { handleFormSubmit, carFormRef } = useAddCarForm({ onSubmit });

  return (
    <CarForm ref={carFormRef} title="Add a car" onSubmit={handleFormSubmit} />
  );
}
