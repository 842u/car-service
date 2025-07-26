import { RefObject } from 'react';

import { TextSeparator } from '@/features/common/ui/decorative/TextSeparator/TextSeparator';
import { ServiceLog } from '@/types';

import {
  DialogModal,
  DialogModalRef,
} from '../../../../features/common/ui/DialogModal/DialogModal';
import { CarServiceLogEditForm } from '../../forms/CarServiceLogEditForm/CarServiceLogEditForm';

type ServiceLogEditModalProps = {
  serviceLog: ServiceLog;
  ref?: RefObject<DialogModalRef | null>;
  onSubmit?: () => void;
};

export function ServiceLogEditModal({
  serviceLog,
  ref,
  onSubmit,
}: ServiceLogEditModalProps) {
  return (
    <DialogModal ref={ref}>
      <DialogModal.Root>
        <DialogModal.Heading>Edit service log</DialogModal.Heading>
        <TextSeparator className="my-4" />
        <CarServiceLogEditForm serviceLog={serviceLog} onSubmit={onSubmit} />
      </DialogModal.Root>
    </DialogModal>
  );
}
