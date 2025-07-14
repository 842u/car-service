import { useRef } from 'react';

import { CarDeleteButton } from '../../buttons/CarDeleteButton/CarDeleteButton';
import { DialogModalRef } from '../../shared/base/DialogModal/DialogModal';
import { DashboardSection } from '../../shared/DashboardSection/DashboardSection';
import { CarDeleteModal } from './CarDeleteModal/CarDeleteModal';

type CarDeleteSectionProps = {
  carId: string;
  isCurrentUserPrimaryOwner: boolean;
};

export function CarDeleteSection({
  carId,
  isCurrentUserPrimaryOwner,
}: CarDeleteSectionProps) {
  const dialogModalRef = useRef<DialogModalRef>(null);

  const handleCarDeleteModalCancel = () => dialogModalRef.current?.closeModal();

  const handleCarDeleteModalConfirm = () =>
    dialogModalRef.current?.closeModal();

  const handleCarDeleteButtonClick = () => dialogModalRef.current?.showModal();

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
          ref={dialogModalRef}
          carId={carId}
          onCancel={handleCarDeleteModalCancel}
          onConfirm={handleCarDeleteModalConfirm}
        />
      </DashboardSection.Controls>
    </DashboardSection>
  );
}
