import { RefObject } from 'react';

import { TextSeparator } from '@/ui/decorative/text-separator/text-separator';
import { DialogModal, DialogModalRef } from '@/ui/dialog-modal/dialog-modal';

import { AddForm } from '../../forms/add/add';

type AddModalProps = {
  carId: string;
  ref?: RefObject<DialogModalRef | null>;
  onSubmit?: () => void;
};

export function AddModal({ carId, ref, onSubmit }: AddModalProps) {
  return (
    <DialogModal ref={ref}>
      <DialogModal.Root>
        <DialogModal.Heading>Add service log</DialogModal.Heading>
        <TextSeparator className="my-4" />
        <AddForm carId={carId} onSubmit={onSubmit} />
      </DialogModal.Root>
    </DialogModal>
  );
}
