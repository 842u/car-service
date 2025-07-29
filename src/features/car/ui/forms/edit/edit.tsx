import {
  useCarEditForm,
  UseCarEditFormOptions,
} from '@/car/ui/forms/edit/use-car-edit-form';
import { Car } from '@/types';

import { CarForm } from '../../form/form';

export type EditFormProps = {
  carData?: Car;
} & Omit<UseCarEditFormOptions, 'carId'>;

export function EditForm({ carData, onSubmit }: EditFormProps) {
  const { handleFormSubmit, carFormRef } = useCarEditForm({
    carId: carData?.id || '',
    onSubmit,
  });

  return (
    <CarForm ref={carFormRef} carData={carData} onSubmit={handleFormSubmit} />
  );
}
