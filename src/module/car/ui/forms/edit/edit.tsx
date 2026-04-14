import { useEditForm } from '@/car/ui/forms/edit/use-edit';
import type { Car } from '@/types';

import { CarForm } from '../../form/form';

interface EditFormProps {
  car?: Car;
  onSubmit?: () => void;
}

export function EditForm({ car, onSubmit }: EditFormProps) {
  const { handleFormSubmit } = useEditForm({
    carId: car?.id || '',
    onSubmit,
  });

  return <CarForm car={car} onSubmit={handleFormSubmit} />;
}
