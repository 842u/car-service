import { RefObject } from 'react';

import { TextSeparator } from '@/components/decorative/TextSeparator/TextSeparator';

import { Button } from '../../shared/base/Button/Button';
import {
  DialogModal,
  DialogModalRef,
} from '../../shared/base/DialogModal/DialogModal';

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
