import { RefObject } from 'react';

import { TextSeparator } from '@/features/common/ui/decorative/TextSeparator/TextSeparator';

import { CarServiceLogAddForm } from '../../forms/CarServiceLogAddForm/CarServiceLogAddForm';
import {
  DialogModal,
  DialogModalRef,
} from '../../shared/base/DialogModal/DialogModal';

type ServiceLogAddModalProps = {
  carId: string;
  ref?: RefObject<DialogModalRef | null>;
  onSubmit?: () => void;
};

export function ServiceLogAddModal({
  carId,
  ref,
  onSubmit,
}: ServiceLogAddModalProps) {
  return (
    <DialogModal ref={ref}>
      <DialogModal.Root>
        <DialogModal.Heading>Add service log</DialogModal.Heading>
        <TextSeparator className="my-4" />
        <CarServiceLogAddForm carId={carId} onSubmit={onSubmit} />
      </DialogModal.Root>
    </DialogModal>
  );
}
