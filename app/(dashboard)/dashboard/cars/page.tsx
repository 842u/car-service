'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useContext, useEffect, useRef } from 'react';

import { AddCarButton } from '@/components/ui/AddCarButton/AddCarButton';
import { AddCarForm } from '@/components/ui/AddCarForm/AddCarForm';
import { CarCard } from '@/components/ui/CarCard/CarCard';
import {
  DialogModal,
  DialogModalRef,
} from '@/components/ui/DialogModal/DialogModal';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { ToastsContext } from '@/context/ToastsContext';
import { fetchCars } from '@/utils/supabase/general';

export default function CarsPage() {
  const { addToast } = useContext(ToastsContext);
  const addCarModalRef = useRef<DialogModalRef>(null);
  const intersectionTargetRef = useRef<HTMLDivElement>(null);

  const {
    data,
    error,
    hasNextPage,
    isPending,
    isError,
    isSuccess,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['cars'],
    queryFn: fetchCars,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPageParam,
  });

  useEffect(() => {
    if (!intersectionTargetRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          isSuccess && !isFetching && !isFetchingNextPage && fetchNextPage();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(intersectionTargetRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, isSuccess]);

  useEffect(() => {
    isError && addToast(error.message, 'error');
  }, [isError, addToast, error]);

  const hasNoCars = isSuccess && data.pages[0].data.length === 0;

  return (
    <main className="flex min-h-screen max-w-screen items-center justify-center pt-16 md:pl-16">
      {isError && <p>{error.message}</p>}
      {isPending && (
        <Spinner className="stroke-accent-400 fill-accent-400 h-16 md:h-20 lg:h-24" />
      )}
      <div className="relative flex flex-col gap-5 py-5 md:flex-row md:flex-wrap md:justify-center lg:max-w-[1920px]">
        {hasNoCars && (
          <p>
            <span className="block text-center">
              Currently, you don&apos;t have cars.{' '}
            </span>
            <span className="block text-center">Feel free to add one.</span>
          </p>
        )}
        {isSuccess &&
          data.pages.map((page) => {
            return page.data.map((car) => <CarCard key={car.id} car={car} />);
          })}
        <div
          ref={intersectionTargetRef}
          className="absolute bottom-0 left-0 h-96 w-full"
        />
        {isFetchingNextPage && (
          <Spinner className="stroke-accent-400 fill-accent-400 my-10 h-16 w-full" />
        )}
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
