import { RefObject } from 'react';

import { TextSeparator } from '@/features/common/ui/decorative/text-separator/text-separator';

import { Button } from '../../../../common/ui/button/button';
import {
  DialogModal,
  DialogModalRef,
} from '../../../../common/ui/dialog-modal/dialog-modal';

type ServiceLogDeleteModalProps = {
  canTakeAction: boolean;
  ref?: RefObject<DialogModalRef | null>;
  onCancel?: () => void;
  onConfirm?: () => void;
};

export function ServiceLogDeleteModal({
  canTakeAction,
  ref,
  onCancel,
  onConfirm,
}: ServiceLogDeleteModalProps) {
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
