import { RefObject } from 'react';

import { AddForm } from '@/car/ui/forms/add/add';
import { TextSeparator } from '@/ui/decorative/text-separator/text-separator';
import { DialogModal, DialogModalRef } from '@/ui/dialog-modal/dialog-modal';

type AddModalProps = {
  ref?: RefObject<DialogModalRef | null>;
  onSubmit?: () => void;
};

export function AddModal({ ref, onSubmit }: AddModalProps) {
  return (
    <DialogModal ref={ref}>
      <DialogModal.Root>
        <DialogModal.Heading>Add car</DialogModal.Heading>
        <TextSeparator className="my-4" />
        <AddForm onSubmit={onSubmit} />
      </DialogModal.Root>
    </DialogModal>
  );
}
