import { useRef } from 'react';

import { CarDeleteButton } from '../../buttons/CarDeleteButton/CarDeleteButton';
import { CarDeleteModal } from '../../modals/CarDeleteModal/CarDeleteModal';
import { DialogModalRef } from '../../shared/base/DialogModal/DialogModal';
import { DashboardSection } from '../../shared/DashboardSection/DashboardSection';

type CarDeleteSectionProps = {
  carId: string;
  isCurrentUserPrimaryOwner: boolean;
};

export function CarDeleteSection({
  carId,
  isCurrentUserPrimaryOwner,
}: CarDeleteSectionProps) {
  const dialogRef = useRef<DialogModalRef>(null);

  const handleCarDeleteModalCancel = () => dialogRef.current?.closeModal();

  const handleCarDeleteModalConfirm = () => dialogRef.current?.closeModal();

  const handleCarDeleteButtonClick = () => dialogRef.current?.showModal();

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
        <CarDeleteButton
          disabled={!isCurrentUserPrimaryOwner}
          onClick={handleCarDeleteButtonClick}
        />
        <CarDeleteModal
          ref={dialogRef}
          carId={carId}
          onCancel={handleCarDeleteModalCancel}
          onConfirm={handleCarDeleteModalConfirm}
        />
      </DashboardSection.Controls>
    </DashboardSection>
  );
}
