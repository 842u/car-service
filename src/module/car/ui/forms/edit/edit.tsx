import { useEditForm } from '@/car/ui/forms/edit/use-edit';
import type { Car } from '@/types';

import { CarForm } from '../../form/form';

interface EditFormProps {
  carData?: Car;
  onSubmit?: () => void;
}

export function EditForm({ carData, onSubmit }: EditFormProps) {
  const { handleFormSubmit } = useEditForm({
    carId: carData?.id || '',
    onSubmit,
  });

  return <CarForm carData={carData} onSubmit={handleFormSubmit} />;
}
