import { useRef } from 'react';

import { CarDeleteButton } from '@/components/ui/buttons/CarDeleteButton/CarDeleteButton';
import { CarDeleteModal } from '@/components/ui/modals/CarDeleteModal/CarDeleteModal';
import { DashboardSection } from '@/components/ui/shared/DashboardSection/DashboardSection';
import { DialogModalRef } from '@/features/common/ui/DialogModal/DialogModal';

export type CarDeleteSectionControlsProps = {
  carId: string;
  isCurrentUserPrimaryOwner: boolean;
};

export function CarDeleteSectionControls({
  carId,
  isCurrentUserPrimaryOwner,
}: CarDeleteSectionControlsProps) {
  const dialogRef = useRef<DialogModalRef>(null);

  const handleCarDeleteModalCancel = () => dialogRef.current?.closeModal();

  const handleCarDeleteModalConfirm = () => dialogRef.current?.closeModal();

  const handleCarDeleteButtonClick = () => dialogRef.current?.showModal();

  return (
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
  );
}
