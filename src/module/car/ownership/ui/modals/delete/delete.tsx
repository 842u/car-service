import type { RefObject } from 'react';

import { Button } from '@/ui/button/button';
import { TextSeparator } from '@/ui/decorative/text-separator/text-separator';
import type { DialogModalRef } from '@/ui/dialog-modal/dialog-modal';
import { DialogModal } from '@/ui/dialog-modal/dialog-modal';

interface DeleteModalProps {
  canDelete: boolean;
  selfDeletion: boolean;
  username?: string | null;
  ref?: RefObject<DialogModalRef | null>;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function DeleteModal({
  canDelete,
  selfDeletion,
  username,
  ref,
  onCancel,
  onConfirm,
}: DeleteModalProps) {
  return (
    <DialogModal ref={ref}>
      <DialogModal.Root>
        <DialogModal.Heading>Delete owner</DialogModal.Heading>
        <TextSeparator className="my-4" />
        {selfDeletion ? (
          <p className="my-10 max-w-full text-wrap">
            Are you sure you want to delete your ownership?
            <span className="text-warning-400 my-1 block">
              You will lose access to this car after proceeding.
            </span>
          </p>
        ) : (
          <p className="my-10 max-w-full text-wrap">
            Are you sure you want to delete{' '}
            <span className="font-extrabold">{username}</span> ownership?
          </p>
        )}
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
