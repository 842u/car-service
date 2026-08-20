import type { RefObject } from 'react';

import type { CarDto } from '@/car/application/dto/car';
import { EditForm } from '@/car/presentation/ui/forms/edit/edit';
import { TextSeparator } from '@/ui/decorative/text-separator/text-separator';
import { DialogModal } from '@/ui/dialog-modal/dialog-modal';
import type { DialogModalRef } from '@/ui/dialog-modal/use-dialog-modal';

type EditModalProps = {
  car?: CarDto;
  ref?: RefObject<DialogModalRef | null>;
  onSubmit?: () => void;
};

export function EditModal({ ref, car, onSubmit }: EditModalProps) {
  return (
    <DialogModal ref={ref}>
      <DialogModal.Root>
        <DialogModal.Heading headingLevel="h2">Edit car</DialogModal.Heading>
        <TextSeparator className="my-4" />
        <EditForm car={car} onSubmit={onSubmit} />
      </DialogModal.Root>
    </DialogModal>
  );
}
