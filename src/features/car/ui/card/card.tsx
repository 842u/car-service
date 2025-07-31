import { Route } from 'next';
import Link from 'next/link';

import { Car } from '@/types';
import { Card } from '@/ui/card/card';

import { CarImage } from '../image/image';

type CarCardProps = {
  car: Car;
};

export function CarCard({ car }: CarCardProps) {
  const staticSegment = '/dashboard/cars' satisfies Route;

  return (
    <Link className="w-80" href={`${staticSegment}/${car.id}`} prefetch={true}>
      <Card className="flex h-full flex-col gap-4">
        <CarImage className="overflow-hidden rounded-lg" src={car.image_url} />
        <div className="overflow-hidden">
          <p className="mb-1 text-3xl font-bold">{car.custom_name}</p>
          <p className="text-lg">{car.license_plates}</p>
        </div>
        <p className="overflow-hidden text-right">
          <span>{car.brand}</span>
          {car.model && (
            <span>
              <span className="mx-2">|</span>
              {car.model}
            </span>
          )}
        </p>
      </Card>
    </Link>
  );
}
