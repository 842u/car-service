import type { RefObject } from 'react';

import { EditForm } from '@/car/ui/forms/edit/edit';
import type { Car } from '@/types';
import { TextSeparator } from '@/ui/decorative/text-separator/text-separator';
import type { DialogModalRef } from '@/ui/dialog-modal/dialog-modal';
import { DialogModal } from '@/ui/dialog-modal/dialog-modal';

interface EditModalProps {
  car?: Car;
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
