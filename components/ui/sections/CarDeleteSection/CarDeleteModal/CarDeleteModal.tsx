import { Button } from '@/components/ui/shared/base/Button/Button';
import {
  DialogModal,
  DialogModalProps,
} from '@/components/ui/shared/base/DialogModal/DialogModal';

import {
  useCarDeleteModal,
  UseCarDeleteModalOptions,
} from './useCarDeleteModal';

export const CAR_DELETE_MODAL_TEST_ID = 'CarDeleteModal_test_id';

type CarDeleteModalProps = Partial<DialogModalProps> & UseCarDeleteModalOptions;

export function CarDeleteModal({
  carId,
  onCancel,
  onConfirm,
  ...props
}: CarDeleteModalProps) {
  const {
    handlers: { handleCancelButtonClick, handleDeleteButtonClick },
  } = useCarDeleteModal({ carId, onCancel, onConfirm });

  return (
    <DialogModal
      {...props}
      data-testid={CAR_DELETE_MODAL_TEST_ID}
      headingText="Delete a car"
    >
      <p className="text-warning-500 dark:text-warning-300 my-4">
        Are you sure you want permanently delete this car?
      </p>
      <div className="flex w-full flex-col gap-4 md:flex-row md:justify-end md:px-4">
        <Button onClick={handleCancelButtonClick}>Cancel</Button>
        <Button variant="error" onClick={handleDeleteButtonClick}>
          Delete
        </Button>
      </div>
    </DialogModal>
  );
}
