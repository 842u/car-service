'use client';

import { useQuery } from '@tanstack/react-query';

import { getCarById } from '@/utils/supabase/general';

import { CarBadge } from '../CarBadge/CarBadge';
import { CarOwnershipSection } from '../CarOwnershipSection/CarOwnershipSection';

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
      <CarOwnershipSection carId={carId} />
    </section>
  );
}
