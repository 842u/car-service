'use client';

import { useQuery } from '@tanstack/react-query';

import { getCarById } from '@/utils/supabase/general';

import { CarBadge } from '../CarBadge/CarBadge';
import { CarOwnershipForm } from '../CarOwnershipForm/CarOwnershipForm';

type CarOverviewProps = {
  carId: string;
};

export function CarOverview({ carId }: CarOverviewProps) {
  const { data: carData, isPending } = useQuery({
    queryKey: ['car', carId],
    queryFn: () => getCarById(carId),
  });

  return (
    <section className="w-full self-start p-5">
      <CarBadge
        imageUrl={carData?.image_url}
        isPending={isPending}
        name={carData?.custom_name}
      />
      <section className="my-5 overflow-x-auto">
        <h2>Car Ownership</h2>
        <CarOwnershipForm carId={carId} />
      </section>
    </section>
  );
}
