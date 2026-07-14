import type { RefObject } from 'react';

import type { ServiceLogDto } from '@/car/service-log/application/dto/service-log';
import { TextSeparator } from '@/ui/decorative/text-separator/text-separator';
import type { DialogModalRef } from '@/ui/dialog-modal/dialog-modal';
import { DialogModal } from '@/ui/dialog-modal/dialog-modal';

import { EditForm } from '../../forms/edit/edit';

type EditModalProps = {
  serviceLog: ServiceLogDto;
  ref?: RefObject<DialogModalRef | null>;
  onSubmit?: () => void;
  onClose?: () => void;
};

export function EditModal({
  serviceLog,
  ref,
  onSubmit,
  onClose,
}: EditModalProps) {
  return (
    <DialogModal ref={ref}>
      <DialogModal.Root onClose={onClose}>
        <DialogModal.Heading>Edit service log</DialogModal.Heading>
        <TextSeparator className="my-4" />
        <EditForm serviceLog={serviceLog} onSubmit={onSubmit} />
      </DialogModal.Root>
    </DialogModal>
  );
}
