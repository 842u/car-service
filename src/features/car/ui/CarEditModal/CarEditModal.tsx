import { RefObject } from 'react';

import { TextSeparator } from '@/features/common/ui/decorative/text-separator/text-separator';
import { Car } from '@/types';

import {
  DialogModal,
  DialogModalRef,
} from '../../../common/ui/dialog-modal/dialog-modal';
import { CarEditForm } from '../CarEditForm/CarEditForm';

type CarEditModalProps = {
  ref?: RefObject<DialogModalRef | null>;
  carData?: Car;
  onSubmit?: () => void;
};

export function CarEditModal({ ref, carData, onSubmit }: CarEditModalProps) {
  return (
    <DialogModal ref={ref}>
      <DialogModal.Root>
        <DialogModal.Heading>Edit car</DialogModal.Heading>
        <TextSeparator className="my-4" />
        <CarEditForm carData={carData} onSubmit={onSubmit} />
      </DialogModal.Root>
    </DialogModal>
  );
}
