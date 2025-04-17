import { useRef } from 'react';

import { CarEditIcon } from '@/components/decorative/icons/CarEditIcon';
import { Car } from '@/types';

import { CarDetailsTable } from '../CarDetailsTable/CarDetailsTable';
import { EditCarForm } from '../CarForm/EditCarForm';
import { DashboardSection } from '../DashboardSection/DashboardSection';
import { DialogModal, DialogModalRef } from '../DialogModal/DialogModal';
import { IconButton } from '../IconButton/IconButton';

export type CarDetailsSectionProps = {
  carId: string;
  carData: Car | undefined;
  isCurrentUserPrimaryOwner: boolean;
};

export function CarDetailsSection({
  carId,
  carData,
  isCurrentUserPrimaryOwner,
}: CarDetailsSectionProps) {
  const dialogModalRef = useRef<DialogModalRef>(null);

  return (
    <DashboardSection>
      <DashboardSection.Heading headingLevel="h2">
        Details
      </DashboardSection.Heading>
      <CarDetailsTable carData={carData} />
      <DashboardSection.Controls>
        <IconButton
          className="group"
          disabled={!isCurrentUserPrimaryOwner}
          title="edit car"
          variant="accent"
          onClick={() => dialogModalRef.current?.showModal()}
        >
          <CarEditIcon className="group-disabled:stroke-light-800 stroke-light-500 fill-light-500 h-full w-full stroke-[0.5]" />
        </IconButton>
        <DialogModal ref={dialogModalRef} headingText="Edit a car">
          <EditCarForm
            carData={carData}
            carId={carId}
            onSubmit={() => dialogModalRef.current?.closeModal()}
          />
        </DialogModal>
      </DashboardSection.Controls>
    </DashboardSection>
  );
}
