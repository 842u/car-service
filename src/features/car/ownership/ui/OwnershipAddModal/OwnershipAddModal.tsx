import { RefObject } from 'react';

import { TextSeparator } from '@/features/common/ui/decorative/text-separator/text-separator';
import {
  DialogModal,
  DialogModalRef,
} from '@/features/common/ui/DialogModal/DialogModal';

import { CarOwnershipAddForm } from '../CarOwnershipAddForm/CarOwnershipAddForm';

type OwnershipAddModalProps = {
  carId: string;
  ref?: RefObject<DialogModalRef | null>;
  onSubmit?: () => void;
};

export function OwnershipAddModal({
  carId,
  ref,
  onSubmit,
}: OwnershipAddModalProps) {
  return (
    <DialogModal ref={ref}>
      <DialogModal.Root>
        <DialogModal.Heading>Add owner</DialogModal.Heading>
        <TextSeparator className="my-4" />
        <CarOwnershipAddForm carId={carId} onSubmit={onSubmit} />
      </DialogModal.Root>
    </DialogModal>
  );
}
