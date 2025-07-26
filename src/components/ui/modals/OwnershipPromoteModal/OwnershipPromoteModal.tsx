import { RefObject } from 'react';

import { TextSeparator } from '@/features/common/ui/decorative/TextSeparator/TextSeparator';

import { Button } from '../../shared/base/Button/Button';
import {
  DialogModal,
  DialogModalRef,
} from '../../shared/base/DialogModal/DialogModal';

type OwnershipPromoteModalProps = {
  canTakeAction: boolean;
  ownerUsername?: string | null;
  ref?: RefObject<DialogModalRef | null>;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export function OwnershipPromoteModal({
  canTakeAction,
  ownerUsername,
  ref,
  onCancel,
  onConfirm,
}: OwnershipPromoteModalProps) {
  return (
    <DialogModal ref={ref}>
      <DialogModal.Root>
        <DialogModal.Heading>Promote owner</DialogModal.Heading>
        <TextSeparator className="my-4" />
        <p className="my-10 max-w-full text-wrap">
          Are you sure you want to pass primary ownership to{' '}
          <span className="font-extrabold">{ownerUsername}</span>?
          <span className="text-warning-400 my-1 block">
            Granting primary ownership to someone else will revoke your current
            primary ownership status and the privileges that comes with it.
          </span>
        </p>
        <DialogModal.Controls>
          <Button onClick={onCancel}>Cancel</Button>
          <Button
            disabled={!canTakeAction}
            variant="accent"
            onClick={onConfirm}
          >
            Grant
          </Button>
        </DialogModal.Controls>
      </DialogModal.Root>
    </DialogModal>
  );
}
