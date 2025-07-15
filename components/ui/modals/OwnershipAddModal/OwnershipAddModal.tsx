import { RefObject } from 'react';

import { TextSeparator } from '@/components/decorative/TextSeparator/TextSeparator';

import { CarOwnershipAddForm } from '../../forms/CarOwnershipAddForm/CarOwnershipAddForm';
import {
  DialogModal,
  DialogModalRef,
} from '../../shared/base/DialogModal/DialogModal';

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
