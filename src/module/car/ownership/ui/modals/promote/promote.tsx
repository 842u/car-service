import type { RefObject } from 'react';

import { Button } from '@/ui/button/button';
import { TextSeparator } from '@/ui/decorative/text-separator/text-separator';
import type { DialogModalRef } from '@/ui/dialog-modal/dialog-modal';
import { DialogModal } from '@/ui/dialog-modal/dialog-modal';

interface PromoteModalProps {
  canPromote: boolean;
  username?: string | null;
  ref?: RefObject<DialogModalRef | null>;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function PromoteModal({
  canPromote,
  username,
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
          <span className="font-extrabold">{username}</span>?
          <span className="text-warning-400 my-1 block">
            Granting primary ownership to someone else will revoke your current
            primary ownership status and the privileges that comes with it.
          </span>
        </p>
        <DialogModal.Controls>
          <Button onClick={onCancel}>Cancel</Button>
          <Button disabled={!canPromote} variant="accent" onClick={onConfirm}>
            Grant
          </Button>
        </DialogModal.Controls>
      </DialogModal.Root>
    </DialogModal>
  );
}
