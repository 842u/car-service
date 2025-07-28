import { RefObject } from 'react';

import { Button } from '@/features/common/ui/button/button';
import { TextSeparator } from '@/features/common/ui/decorative/TextSeparator/TextSeparator';
import {
  DialogModal,
  DialogModalRef,
} from '@/features/common/ui/DialogModal/DialogModal';

import {
  useCarDeleteModal,
  UseCarDeleteModalOptions,
} from './useCarDeleteModal';

export const CAR_DELETE_MODAL_TEST_ID = 'CarDeleteModal_test_id';

type CarDeleteModalProps = UseCarDeleteModalOptions & {
  ref?: RefObject<DialogModalRef | null>;
};

export function CarDeleteModal({
  carId,
  ref,
  onCancel,
  onConfirm,
}: CarDeleteModalProps) {
  const {
    handlers: { handleCancelButtonClick, handleDeleteButtonClick },
  } = useCarDeleteModal({ carId, onCancel, onConfirm });

  return (
    <DialogModal ref={ref}>
      <DialogModal.Root data-testid={CAR_DELETE_MODAL_TEST_ID}>
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
