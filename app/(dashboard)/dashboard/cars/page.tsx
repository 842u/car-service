'use client';

import { useRef } from 'react';

import { CarPlusIcon } from '@/components/decorative/icons/CarPlusIcon';
import { AddCarForm } from '@/components/ui/CarForm/AddCarForm';
import { CarsSection } from '@/components/ui/CarsSection/CarsSection';
import { DashboardMain } from '@/components/ui/DashboardMain/DashboardMain';
import {
  DialogModal,
  DialogModalRef,
} from '@/components/ui/DialogModal/DialogModal';
import { IconButton } from '@/components/ui/IconButton/IconButton';

export default function CarsPage() {
  const dialogModalRef = useRef<DialogModalRef>(null);

  return (
    <DashboardMain>
      <CarsSection />
      <DialogModal ref={dialogModalRef} headingText="Add a car">
        <AddCarForm onSubmit={() => dialogModalRef.current?.closeModal()} />
      </DialogModal>
      <IconButton
        className="fixed right-0 bottom-40 m-4 h-16 w-16 p-2 md:m-8 lg:m-12"
        title="add car"
        variant="accent"
        onClick={() => dialogModalRef.current?.showModal()}
      >
        <CarPlusIcon className="fill-light-500 stroke-[0.5]" />
      </IconButton>
    </DashboardMain>
  );
}
