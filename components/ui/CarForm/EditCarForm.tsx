import { Car } from '@/types';

import { CarForm } from './CarForm';
import { useEditCarForm } from './useEditCarForm';

export type EditCarFormProps = {
  carId: string;
  carData: Car | undefined;
  onSubmit?: () => void;
};

export function EditCarForm({ carId, carData, onSubmit }: EditCarFormProps) {
  const { handleFormSubmit, carFormRef } = useEditCarForm({ carId, onSubmit });

  return (
    <CarForm
      ref={carFormRef}
      carData={carData}
      title="Edit a car"
      onSubmit={handleFormSubmit}
    />
  );
}
