import type { RefObject } from 'react';

import { Button } from '@/ui/button/button';
import { TextSeparator } from '@/ui/decorative/text-separator/text-separator';
import { DialogModal } from '@/ui/dialog-modal/dialog-modal';
import type { DialogModalRef } from '@/ui/dialog-modal/use-dialog-modal';

type DeleteModalProps = {
  canDelete: boolean;
  ref?: RefObject<DialogModalRef | null>;
  onCancel?: () => void;
  onConfirm?: () => void;
  onClose?: () => void;
};

export function DeleteModal({
  canDelete,
  ref,
  onCancel,
  onConfirm,
  onClose,
}: DeleteModalProps) {
  return (
    <DialogModal ref={ref}>
      <DialogModal.Root onClose={onClose}>
        <DialogModal.Heading headingLevel="h2">Delete car</DialogModal.Heading>
        <TextSeparator className="my-4" />
        <p className="text-warning-500 dark:text-warning-300 my-4">
          Are you sure you want permanently delete this car?
        </p>
        <DialogModal.Controls>
          <Button onClick={onCancel}>Cancel</Button>
          <Button disabled={!canDelete} variant="error" onClick={onConfirm}>
            Delete
          </Button>
        </DialogModal.Controls>
      </DialogModal.Root>
    </DialogModal>
  );
}
