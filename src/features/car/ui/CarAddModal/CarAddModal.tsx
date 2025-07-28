import { RefObject } from 'react';

import { TextSeparator } from '@/features/common/ui/decorative/TextSeparator/TextSeparator';

import {
  DialogModal,
  DialogModalRef,
} from '../../../common/ui/DialogModal/DialogModal';
import { CarAddForm } from '../CarAddForm/CarAddForm';

type CarAddModalProps = {
  ref?: RefObject<DialogModalRef | null>;
  onSubmit?: () => void;
};

export function CarAddModal({ ref, onSubmit }: CarAddModalProps) {
  return (
    <DialogModal ref={ref}>
      <DialogModal.Root>
        <DialogModal.Heading>Add car</DialogModal.Heading>
        <TextSeparator className="my-4" />
        <CarAddForm onSubmit={onSubmit} />
      </DialogModal.Root>
    </DialogModal>
  );
}
