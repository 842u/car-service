import { useQuery } from '@tanstack/react-query';

import { Car } from '@/types';
import { getCarById } from '@/utils/supabase/general';

import { Card } from '../Card/Card';
import { CarImage } from '../CarImage/CarImage';

type CarCardProps = {
  car: Car;
};

export function CarCard({ car }: CarCardProps) {
  const { data } = useQuery({
    queryKey: ['car', car.id],
    queryFn: () => getCarById(car.id),
    initialData: car,
  });

  return (
    <Card className="flex w-80 flex-col justify-between self-stretch">
      <CarImage
        className="relative aspect-square w-full"
        src={data.image_url}
      />
      <div>
        <p className="my-4 text-3xl font-semibold break-words">
          {data.custom_name}
        </p>
        <p className="my-2 whitespace-pre-wrap">
          <span>Brand: </span>
          <span className="text-accent-400">{data.brand || ''}</span>
        </p>
        <p className="my-2 whitespace-pre-wrap">
          <span>Model: </span>
          <span className="text-accent-400">{data.model || ''}</span>
        </p>
        <p className="my-2 whitespace-pre-wrap">
          <span>License Plates: </span>
          <span className="text-accent-400">{data.license_plates || ''}</span>
        </p>
      </div>
    </Card>
  );
}
