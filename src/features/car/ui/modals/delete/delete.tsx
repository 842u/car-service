import { RefObject } from 'react';

import { Button } from '@/ui/button/button';
import { TextSeparator } from '@/ui/decorative/text-separator/text-separator';
import { DialogModal, DialogModalRef } from '@/ui/dialog-modal/dialog-modal';

import { useDeleteModal, UseDeleteModalOptions } from './use-delete';

export const DELETE_MODAL_TEST_ID = 'delete-modal';

type DeleteModalProps = UseDeleteModalOptions & {
  ref?: RefObject<DialogModalRef | null>;
};

export function DeleteModal({
  carId,
  ref,
  onCancel,
  onConfirm,
}: DeleteModalProps) {
  const {
    handlers: { handleCancelButtonClick, handleDeleteButtonClick },
  } = useDeleteModal({ carId, onCancel, onConfirm });

  return (
    <DialogModal ref={ref}>
      <DialogModal.Root data-testid={DELETE_MODAL_TEST_ID}>
        <DialogModal.Heading>Delete car</DialogModal.Heading>
        <TextSeparator className="my-4" />
        <p className="text-warning-500 dark:text-warning-300 my-4">
          Are you sure you want permanently delete this car?
        </p>
        <DialogModal.Controls>
          <Button onClick={handleCancelButtonClick}>Cancel</Button>
          <Button variant="error" onClick={handleDeleteButtonClick}>
            Delete
          </Button>
        </DialogModal.Controls>
      </DialogModal.Root>
    </DialogModal>
  );
}
