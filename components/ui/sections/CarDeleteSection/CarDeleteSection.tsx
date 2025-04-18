import { useRef } from 'react';

import { TrashIcon } from '@/components/decorative/icons/TrashIcon';

import { CarDeleteForm } from '../../forms/CarDeleteForm/CarDeleteForm';
import {
  DialogModal,
  DialogModalRef,
} from '../../shared/base/DialogModal/DialogModal';
import { DashboardSection } from '../../shared/DashboardSection/DashboardSection';
import { IconButton } from '../../shared/IconButton/IconButton';

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
    <DashboardSection variant="errorDefault">
      <DashboardSection.Heading headingLevel="h2">
        Delete Car
      </DashboardSection.Heading>
      <DashboardSection.Text>
        Permanently delete this car for you and other owners.
      </DashboardSection.Text>
      <DashboardSection.Text className="text-warning-500">
        This action is irreversible and can not be undone.
      </DashboardSection.Text>
      <DashboardSection.Subtext className="my-4">
        If you do not want to see that car you can pass primary ownership to
        someone else and remove yourself from the owners list.
      </DashboardSection.Subtext>
      <DashboardSection.Controls>
        <IconButton
          className="group"
          disabled={!isCurrentUserPrimaryOwner}
          title="delete car"
          variant="error"
          onClick={() => dialogModalRef.current?.showModal()}
        >
          <TrashIcon className="group-disabled:stroke-light-800 h-full w-full stroke-2" />
        </IconButton>
        <DialogModal ref={dialogModalRef} headingText="Delete a car">
          <CarDeleteForm
            carId={carId}
            onSubmit={() => dialogModalRef.current?.closeModal()}
          />
        </DialogModal>
      </DashboardSection.Controls>
    </DashboardSection>
  );
}
