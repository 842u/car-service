import { useRef } from 'react';

import { ServiceLogAddModal } from '@/features/car/service-log/ui/ServiceLogAddModal/ServiceLogAddModal';
import { DialogModalRef } from '@/features/common/ui/DialogModal/DialogModal';
import { DashboardSection } from '@/features/dashboard/ui/DashboardSection/DashboardSection';

import { ServiceLogAddButton } from '../../ServiceLogAddButton/ServiceLogAddButton';

export type CarServiceLogsSectionControlsProps = { carId: string };

export function CarServiceLogsSectionControls({
  carId,
}: CarServiceLogsSectionControlsProps) {
  const dialogRef = useRef<DialogModalRef>(null);

  const handleServiceLogAddModalSubmit = () => dialogRef.current?.closeModal();

  const handleServiceLogAddButtonClick = () => dialogRef.current?.showModal();

  return (
    <DashboardSection.Controls>
      <ServiceLogAddButton onClick={handleServiceLogAddButtonClick} />
      <ServiceLogAddModal
        ref={dialogRef}
        carId={carId}
        onSubmit={handleServiceLogAddModalSubmit}
      />
    </DashboardSection.Controls>
  );
}
