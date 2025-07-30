import { RefObject } from 'react';

import { Button } from '@/ui/button/button';
import { TextSeparator } from '@/ui/decorative/text-separator/text-separator';
import { DialogModal, DialogModalRef } from '@/ui/dialog-modal/dialog-modal';

type PromoteModalProps = {
  canTakeAction: boolean;
  ownerUsername?: string | null;
  ref?: RefObject<DialogModalRef | null>;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export function PromoteModal({
  canTakeAction,
  ownerUsername,
  ref,
  onCancel,
  onConfirm,
}: PromoteModalProps) {
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
