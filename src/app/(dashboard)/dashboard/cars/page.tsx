'use client';

import { useRef } from 'react';

import { CarAddButton } from '@/components/ui/buttons/CarAddButton/CarAddButton';
import { CarsGallery } from '@/components/ui/CarsGallery/CarsGallery';
import { CarAddModal } from '@/components/ui/modals/CarAddModal/CarAddModal';
import { DialogModalRef } from '@/components/ui/shared/base/DialogModal/DialogModal';
import { DashboardMain } from '@/components/ui/shared/DashboardMain/DashboardMain';

export default function CarsPage() {
  const dialogRef = useRef<DialogModalRef>(null);

  const handleCarAddButtonClick = () => dialogRef.current?.showModal();

  const handleCarAddModalSubmit = () => dialogRef.current?.closeModal();

  return (
    <DashboardMain>
      <CarsGallery />
      <CarAddModal ref={dialogRef} onSubmit={handleCarAddModalSubmit} />
      <CarAddButton
        className="fixed right-0 bottom-0 mx-4 my-12 md:m-12 lg:m-16"
        onClick={handleCarAddButtonClick}
      />
    </DashboardMain>
  );
}
