import { RefObject } from 'react';

import { CarOwnership } from '@/types';
import { Button } from '@/ui/button/button';
import { TextSeparator } from '@/ui/decorative/text-separator/text-separator';
import { DialogModal, DialogModalRef } from '@/ui/dialog-modal/dialog-modal';

type DeleteModalProps = {
  canTakeAction: boolean;
  ownership: CarOwnership;
  ref?: RefObject<DialogModalRef | null>;
  userId?: string;
  ownerUsername?: string | null;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export function DeleteModal({
  canTakeAction,
  ownership,
  ref,
  userId,
  ownerUsername,
  onCancel,
  onConfirm,
}: DeleteModalProps) {
  return (
    <DialogModal ref={ref}>
      <DialogModal.Root>
        <DialogModal.Heading>Delete owner</DialogModal.Heading>
        <TextSeparator className="my-4" />
        {userId === ownership.owner_id ? (
          <p className="my-10 max-w-full text-wrap">
            Are you sure you want to delete your ownership?
            <span className="text-warning-400 my-1 block">
              You will lose access to this car after proceeding.
            </span>
          </p>
        ) : (
          <p className="my-10 max-w-full text-wrap">
            Are you sure you want to delete{' '}
            <span className="font-extrabold">{ownerUsername}</span> ownership?
          </p>
        )}
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
