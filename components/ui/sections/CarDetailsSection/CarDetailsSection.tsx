import { useRef } from 'react';

import { CarEditIcon } from '@/components/decorative/icons/CarEditIcon';
import { Car } from '@/types';

import { CarEditForm } from '../../forms/CarEditForm/CarEditForm';
import {
  DialogModal,
  DialogModalRef,
} from '../../shared/base/DialogModal/DialogModal';
import { DashboardSection } from '../../shared/DashboardSection/DashboardSection';
import { IconButton } from '../../shared/IconButton/IconButton';
import { CarDetailsTable } from '../../tables/CarDetailsTable/CarDetailsTable';

export type CarDetailsSectionProps = {
  carId: string;
  isCurrentUserPrimaryOwner: boolean;
  carData?: Car;
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
          <CarEditForm
            carData={carData}
            carId={carId}
            onSubmit={() => dialogModalRef.current?.closeModal()}
          />
        </DialogModal>
      </DashboardSection.Controls>
    </DashboardSection>
  );
}
