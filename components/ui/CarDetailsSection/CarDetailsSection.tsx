'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { getCarById } from '@/utils/supabase/general';

import CarDetails from '../CarDetails/CarDetails';
import { CarDetailsButton } from '../CarDetailsButton/CarDetailsButton';
import { CarEditButton } from '../CarEditButton/CarEditButton';
import { CarImage } from '../CarImage/CarImage';
import { Spinner } from '../Spinner/Spinner';

type CarDetailsSectionProps = {
  id: string;
};

export default function CarDetailsSection({ id }: CarDetailsSectionProps) {
  const [showDetails, setShowDetails] = useState(false);

  const { data, isPending } = useQuery({
    queryKey: ['car', id],
    queryFn: () => getCarById(id),
  });

  return (
    <section
      aria-label="car details"
      className="border-alpha-grey-200 bg-alpha-grey-100 relative flex w-full flex-col gap-5 self-start rounded-md border p-4"
    >
      <h1 className="text-center text-4xl break-words whitespace-pre-wrap">
        {data?.custom_name || ' '}
      </h1>
      <div className="border-alpha-grey-300 relative overflow-hidden rounded-lg border">
        {isPending && (
          <Spinner className="stroke-accent-400 fill-accent-400 h-full w-full p-20" />
        )}
        {!isPending && (
          <>
            <CarImage className="aspect-square w-full" src={data?.image_url} />
          </>
        )}
        <CarDetailsButton
          aria-label="Show car details."
          className="absolute right-0 bottom-0 m-2 w-16"
          title="Show car details."
          onClick={() => setShowDetails((currentState) => !currentState)}
        />
      </div>
      <CarDetails carData={data} showDetails={showDetails} />
      {showDetails && (
        <div className="flex justify-end">
          <CarEditButton
            aria-label="Edit car details."
            className="w-16"
            title="Edit car details."
          />
        </div>
      )}
    </section>
  );
}
