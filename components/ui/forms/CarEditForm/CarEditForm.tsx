import { Car } from '@/types';

import { CarForm } from '../../shared/CarForm/CarForm';
import { useCarEditForm } from './useCarEditForm';

export type CarEditFormProps = {
  carId: string;
  carData: Car | undefined;
  onSubmit?: () => void;
};

export function CarEditForm({ carId, carData, onSubmit }: CarEditFormProps) {
  const { handleFormSubmit, carFormRef } = useCarEditForm({ carId, onSubmit });

  return (
    <CarForm
      ref={carFormRef}
      carData={carData}
      title="Edit a car"
      onSubmit={handleFormSubmit}
    />
  );
}
