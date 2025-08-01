'use client';

import { useRef } from 'react';

import { AddButton } from '@/car/ui/buttons/add/add';
import { CarsGallery } from '@/car/ui/cars-gallery/cars-gallery';
import { AddModal } from '@/car/ui/modals/add/add';
import { DashboardMain } from '@/dashboard/ui/main/main';
import type { DialogModalRef } from '@/ui/dialog-modal/dialog-modal';

export default function CarsPage() {
  const dialogRef = useRef<DialogModalRef>(null);

  const handleCarAddButtonClick = () => dialogRef.current?.showModal();

  const handleCarAddModalSubmit = () => dialogRef.current?.closeModal();

  return (
    <DashboardMain>
      <CarsGallery />
      <AddModal ref={dialogRef} onSubmit={handleCarAddModalSubmit} />
      <AddButton
        className="fixed right-0 bottom-0 mx-4 my-12 md:m-12 lg:m-16"
        onClick={handleCarAddButtonClick}
      />
    </DashboardMain>
  );
}
