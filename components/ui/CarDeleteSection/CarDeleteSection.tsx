import { useRef } from 'react';

import { TrashIcon } from '@/components/decorative/icons/TrashIcon';

import { CarDeleteForm } from '../CarDeleteForm/CarDeleteForm';
import { DialogModal, DialogModalRef } from '../DialogModal/DialogModal';
import { IconButton } from '../IconButton/IconButton';

type CarDeleteSectionProps = {
  carId: string;
  isCurrentUserPrimaryOwner: boolean;
};

export function CarDeleteSection({
  carId,
  isCurrentUserPrimaryOwner,
}: CarDeleteSectionProps) {
  const dialogModalRef = useRef<DialogModalRef>(null);

  return (
    <section>
      <h2>Delete Car</h2>
      <div className="border-error-400 overflow-hidden rounded-lg border p-2">
        <p>The car will be permanently deleted for you and other owners.</p>
        <p>
          If you do not want to see that car you can pass primary ownership to
          someone else and remove yourself from the owners list.
        </p>
        <p className="text-warning-300">
          This action is irreversible and can not be undone.
        </p>
      </div>
      <div className="m-5 flex justify-end gap-5">
        <IconButton
          className="group"
          disabled={!isCurrentUserPrimaryOwner}
          title="delete car"
          variant="error"
          onClick={() => dialogModalRef.current?.showModal()}
        >
          <TrashIcon className="group-disabled:stroke-light-800 h-full w-full stroke-2" />
        </IconButton>
        <DialogModal ref={dialogModalRef}>
          <CarDeleteForm
            carId={carId}
            onSubmit={() => dialogModalRef.current?.closeModal()}
          />
        </DialogModal>
      </div>
    </section>
  );
}
