'use client';

import { useQuery } from '@tanstack/react-query';
import { ReactNode, useEffect } from 'react';

import { CarContext } from '@/context/CarContext';
import { useToasts } from '@/hooks/useToasts';
import { getCar } from '@/utils/supabase/tables/cars';
import { queryKeys } from '@/utils/tanstack/keys';

import { Spinner } from '../decorative/Spinner/Spinner';

type CarContextProviderProps = {
  carId: string;
  children: ReactNode;
};

export function CarContextProvider({
  carId,
  children,
}: CarContextProviderProps) {
  const { addToast } = useToasts();

  const { data, error, isLoading } = useQuery({
    throwOnError: false,
    queryKey: queryKeys.carsByCarId(carId),
    queryFn: () => getCar(carId),
  });

  useEffect(() => {
    error && addToast(error.message, 'error');
  }, [error, addToast]);

  return isLoading ? (
    <Spinner className="stroke-accent-400 fill-accent-400 h-16 md:h-20 lg:h-24" />
  ) : (
    <CarContext value={data}>{children}</CarContext>
  );
}
