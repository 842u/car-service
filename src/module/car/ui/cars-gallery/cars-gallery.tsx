'use client';

import { useRef } from 'react';

import { AddCard } from '@/car/ui/cards/add/add';
import { AddModal } from '@/car/ui/modals/add/add';
import { Spinner } from '@/ui/decorative/spinner/spinner';
import type { DialogModalRef } from '@/ui/dialog-modal/dialog-modal';

import { CarCard } from '../cards/car';
import { useCarsGallery } from './use-cars-gallery';

export function CarsGallery() {
  const dialogRef = useRef<DialogModalRef>(null);

  const { data, isPending, intersectionTargetRef, isFetchingNextPage } =
    useCarsGallery();

  const handleAddCardClick = () => dialogRef.current?.showModal();

  const handleCarAddModalSubmit = () => dialogRef.current?.closeModal();

  if (isPending)
    return (
      <Spinner className="stroke-accent-400 fill-accent-400 h-16 md:h-20 lg:h-24" />
    );

  return (
    <section aria-label="user's cars">
      <div className="relative flex flex-col gap-5 py-5 md:flex-row md:flex-wrap md:justify-center lg:max-w-480">
        <AddCard onClick={handleAddCardClick} />

        {data.map((car) => car && <CarCard key={car.id} car={car} />)}

        <div
          ref={intersectionTargetRef}
          className="absolute bottom-0 left-0 -z-10 h-[30vh] w-full"
        />

        {isFetchingNextPage && (
          <Spinner className="stroke-accent-400 fill-accent-400 my-10 h-16 w-full" />
        )}
      </div>

      <AddModal ref={dialogRef} onSubmit={handleCarAddModalSubmit} />
    </section>
  );
}
