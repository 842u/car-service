import type { CarDto } from '@/car/application/dto/car';
import { useEditForm } from '@/car/presentation/ui/forms/edit/use-edit';

import { CarForm } from '../../form/form';

interface EditFormProps {
  car?: CarDto;
  onSubmit?: () => void;
}

export function EditForm({ car, onSubmit }: EditFormProps) {
  const { handleFormSubmit } = useEditForm({
    carId: car?.id || '',
    onSubmit,
  });

  return <CarForm car={car} onSubmit={handleFormSubmit} />;
}
