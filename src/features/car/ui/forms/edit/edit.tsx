import type { UseEditFormOptions } from '@/car/ui/forms/edit/use-edit';
import { useEditForm } from '@/car/ui/forms/edit/use-edit';
import type { Car } from '@/types';

import { CarForm } from '../../form/form';

export type EditFormProps = {
  carData?: Car;
} & Omit<UseEditFormOptions, 'carId'>;

export function EditForm({ carData, onSubmit }: EditFormProps) {
  const { handleFormSubmit, carFormRef } = useEditForm({
    carId: carData?.id || '',
    onSubmit,
  });

  return (
    <CarForm ref={carFormRef} carData={carData} onSubmit={handleFormSubmit} />
  );
}
