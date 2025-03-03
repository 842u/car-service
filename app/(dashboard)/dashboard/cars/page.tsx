'use client';

import { useQuery } from '@tanstack/react-query';
import { useRef } from 'react';

import { AddCarButton } from '@/components/ui/AddCarButton/AddCarButton';
import { AddCarForm } from '@/components/ui/AddCarForm/AddCarForm';
import { CarCard } from '@/components/ui/CarCard/CarCard';
import {
  DialogModal,
  DialogModalRef,
} from '@/components/ui/DialogModal/DialogModal';
import { createClient } from '@/utils/supabase/client';

const fetchCars = async () => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('cars')
    .select()
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return data;
};

export default function CarsPage() {
  const addCarModalRef = useRef<DialogModalRef>(null);

  const { data } = useQuery({ queryKey: ['cars'], queryFn: fetchCars });

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <div className="relative top-16 flex h-full max-w-[1920px] flex-col items-center justify-around gap-5 py-5 md:flex-row md:flex-wrap md:justify-center md:gap-10 md:pl-16">
        {data?.map((car) => <CarCard key={car.id} car={car} />)}
      </div>
      <DialogModal ref={addCarModalRef}>
        <AddCarForm onSubmit={() => addCarModalRef.current?.closeModal()} />
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
