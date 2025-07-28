import { Car } from '@/types';

import { CarForm } from '../CarForm/CarForm';
import { useCarEditForm, UseCarEditFormOptions } from './useCarEditForm';

export type CarEditFormProps = {
  carData?: Car;
} & Omit<UseCarEditFormOptions, 'carId'>;

export function CarEditForm({ carData, onSubmit }: CarEditFormProps) {
  const { handleFormSubmit, carFormRef } = useCarEditForm({
    carId: carData?.id || '',
    onSubmit,
  });

  return (
    <CarForm ref={carFormRef} carData={carData} onSubmit={handleFormSubmit} />
  );
}
