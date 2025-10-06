import type { RefObject } from 'react';

import { EditForm } from '@/car/ui/forms/edit/edit';
import type { Car } from '@/types';
import { TextSeparator } from '@/ui/decorative/text-separator/text-separator';
import type { DialogModalRef } from '@/ui/dialog-modal/dialog-modal';
import { DialogModal } from '@/ui/dialog-modal/dialog-modal';

type EditModalProps = {
  ref?: RefObject<DialogModalRef | null>;
  carData?: Car;
  onSubmit?: () => void;
};

export function EditModal({ ref, carData, onSubmit }: EditModalProps) {
  return (
    <DialogModal ref={ref}>
      <DialogModal.Root>
        <DialogModal.Heading>Edit car</DialogModal.Heading>
        <TextSeparator className="my-4" />
        <EditForm carData={carData} onSubmit={onSubmit} />
      </DialogModal.Root>
    </DialogModal>
  );
}
