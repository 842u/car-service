import { useRef } from 'react';

import { ServiceLogAddButton } from '@/components/ui/buttons/ServiceLogAddButton/ServiceLogAddButton';
import { ServiceLogAddModal } from '@/components/ui/modals/ServiceLogAddModal/ServiceLogAddModal';
import { DialogModalRef } from '@/components/ui/shared/base/DialogModal/DialogModal';
import { DashboardSection } from '@/components/ui/shared/DashboardSection/DashboardSection';

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
