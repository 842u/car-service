'use client';

import { useRef } from 'react';

import { AddCarButton } from '@/components/ui/AddCarButton/AddCarButton';
import { AddCarForm } from '@/components/ui/AddCarForm/AddCarForm';
import {
  DialogModal,
  DialogModalRef,
} from '@/components/ui/DialogModal/DialogModal';

export default function CarsPage() {
  const addCarModalRef = useRef<DialogModalRef>(null);

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <DialogModal ref={addCarModalRef}>
        <AddCarForm />
      </DialogModal>
      <AddCarButton
        className="fixed right-0 bottom-0 m-4 md:m-8 lg:m-12"
        onClick={() => {
          addCarModalRef.current?.showModal();
        }}
      />
    </main>
  );
}
