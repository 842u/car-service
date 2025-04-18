'use client';

import { useRef } from 'react';

import { CarPlusIcon } from '@/components/decorative/icons/CarPlusIcon';
import { CarsGallery } from '@/components/ui/CarsGallery/CarsGallery';
import { CarAddForm } from '@/components/ui/forms/CarAddForm/CarAddForm';
import {
  DialogModal,
  DialogModalRef,
} from '@/components/ui/shared/base/DialogModal/DialogModal';
import { DashboardMain } from '@/components/ui/shared/DashboardMain/DashboardMain';
import { IconButton } from '@/components/ui/shared/IconButton/IconButton';

export default function CarsPage() {
  const dialogModalRef = useRef<DialogModalRef>(null);

  return (
    <DashboardMain>
      <CarsGallery />
      <DialogModal ref={dialogModalRef} headingText="Add a car">
        <CarAddForm onSubmit={() => dialogModalRef.current?.closeModal()} />
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
