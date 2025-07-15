import { RefObject } from 'react';

import { TextSeparator } from '@/components/decorative/TextSeparator/TextSeparator';
import { Car } from '@/types';

import { CarEditForm } from '../../forms/CarEditForm/CarEditForm';
import {
  DialogModal,
  DialogModalRef,
} from '../../shared/base/DialogModal/DialogModal';

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
