import { RefObject } from 'react';

import { Button } from '@/ui/button-tempname/button-tempname';
import { TextSeparator } from '@/ui/decorative/text-separator/text-separator';
import { DialogModal, DialogModalRef } from '@/ui/dialog-modal/dialog-modal';

type DeleteModalProps = {
  canTakeAction: boolean;
  ref?: RefObject<DialogModalRef | null>;
  onCancel?: () => void;
  onConfirm?: () => void;
};

export function DeleteModal({
  canTakeAction,
  ref,
  onCancel,
  onConfirm,
}: DeleteModalProps) {
  return (
    <DialogModal ref={ref}>
      <DialogModal.Root>
        <DialogModal.Heading>Delete service log</DialogModal.Heading>
        <TextSeparator className="my-4" />
        <p className="my-4">Are you sure you want to delete service log?</p>
        <DialogModal.Controls>
          <Button onClick={onCancel}>Cancel</Button>
          <Button disabled={!canTakeAction} variant="error" onClick={onConfirm}>
            Delete
          </Button>
        </DialogModal.Controls>
      </DialogModal.Root>
    </DialogModal>
  );
}
