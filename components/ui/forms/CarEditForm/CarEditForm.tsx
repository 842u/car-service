import { Car } from '@/types';

import { CarForm } from '../../shared/CarForm/CarForm';
import { useCarEditForm } from './useCarEditForm';

export type CarEditFormProps = {
  carId: string;
  carData?: Car;
  onSubmit?: () => void;
};

export function CarEditForm({ carId, carData, onSubmit }: CarEditFormProps) {
  const { handleFormSubmit, carFormRef } = useCarEditForm({ carId, onSubmit });

  return (
    <CarForm ref={carFormRef} carData={carData} onSubmit={handleFormSubmit} />
  );
}
