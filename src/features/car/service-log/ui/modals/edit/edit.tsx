import type { RefObject } from 'react';

import type { ServiceLog } from '@/types';
import { TextSeparator } from '@/ui/decorative/text-separator/text-separator';
import type { DialogModalRef } from '@/ui/dialog-modal/dialog-modal';
import { DialogModal } from '@/ui/dialog-modal/dialog-modal';

import { EditForm } from '../../forms/edit/edit';

type EditModalProps = {
  serviceLog: ServiceLog;
  ref?: RefObject<DialogModalRef | null>;
  onSubmit?: () => void;
};

export function EditModal({ serviceLog, ref, onSubmit }: EditModalProps) {
  return (
    <DialogModal ref={ref}>
      <DialogModal.Root>
        <DialogModal.Heading>Edit service log</DialogModal.Heading>
        <TextSeparator className="my-4" />
        <EditForm serviceLog={serviceLog} onSubmit={onSubmit} />
      </DialogModal.Root>
    </DialogModal>
  );
}
