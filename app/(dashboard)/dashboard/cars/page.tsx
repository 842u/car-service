'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { AddCarButton } from '@/components/ui/AddCarButton/AddCarButton';
import { AddCarForm } from '@/components/ui/AddCarForm/AddCarForm';
import { CarCard } from '@/components/ui/CarCard/CarCard';
import {
  DialogModal,
  DialogModalRef,
} from '@/components/ui/DialogModal/DialogModal';
import { createClient } from '@/utils/supabase/client';

const fetchCars = async ({ pageParam }: { pageParam: number }) => {
  const pageItemLimit = 15;
  const rangeIndexFrom = pageParam * pageItemLimit;
  const rangeIndexTo = (pageParam + 1) * pageItemLimit - 1;

  const supabase = createClient();
  const { data, error } = await supabase
    .from('cars')
    .select()
    .order('created_at', { ascending: false })
    .limit(pageItemLimit)
    .range(rangeIndexFrom, rangeIndexTo);

  if (error) throw new Error(error.message);

  return { data, nextPageParam: pageParam + 1 };
};

export default function CarsPage() {
  const addCarModalRef = useRef<DialogModalRef>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const {
    data,
    error,
    status,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['cars'],
    queryFn: fetchCars,
    initialPageParam: 0,
    getNextPageParam: (lastPage, _page) => lastPage.nextPageParam,
  });

  useEffect(() => {
    if (!bottomRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          !isFetchingNextPage && fetchNextPage();
        }
      },
      { threshold: 1.0, rootMargin: '200px' },
    );

    observer.observe(bottomRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return status === 'pending' ? (
    <p>Loading...</p>
  ) : status === 'error' ? (
    <p>Error: {error.message}</p>
  ) : (
    <main className="flex h-screen flex-col items-center justify-center">
      <div className="relative top-16 flex h-full w-full max-w-[1920px] flex-col items-center justify-around gap-5 py-5 md:flex-row md:flex-wrap md:justify-center md:gap-10 md:pl-16">
        {data.pages.map((page) => {
          return page.data.map((car) => <CarCard key={car.id} car={car} />);
        })}
        <div ref={bottomRef} className="w-full" />
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
