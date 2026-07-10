import type { RefObject } from 'react';

import type { CarDto } from '@/car/application/dto/car';
import { EditForm } from '@/car/presentation/ui/forms/edit/edit';
import { TextSeparator } from '@/ui/decorative/text-separator/text-separator';
import type { DialogModalRef } from '@/ui/dialog-modal/dialog-modal';
import { DialogModal } from '@/ui/dialog-modal/dialog-modal';

interface EditModalProps {
  car?: CarDto;
  ref?: RefObject<DialogModalRef | null>;
  onSubmit?: () => void;
}

export function EditModal({ ref, car, onSubmit }: EditModalProps) {
  return (
    <DialogModal ref={ref}>
      <DialogModal.Root>
        <DialogModal.Heading>Edit car</DialogModal.Heading>
        <TextSeparator className="my-4" />
        <EditForm car={car} onSubmit={onSubmit} />
      </DialogModal.Root>
    </DialogModal>
  );
}
