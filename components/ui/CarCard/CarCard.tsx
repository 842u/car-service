import { Route } from 'next';
import Link from 'next/link';

import { Car } from '@/types';

import { Card } from '../Card/Card';
import { CarImage } from '../images/CarImage/CarImage';

type CarCardProps = {
  car: Car;
};

export function CarCard({ car }: CarCardProps) {
  const staticSegment = '/dashboard/cars' satisfies Route;

  return (
    <Link className="w-80" href={`${staticSegment}/${car.id}`}>
      <Card className="flex h-full flex-col justify-between p-5">
        <CarImage className="overflow-hidden rounded-lg" src={car.image_url} />
        <p className="my-4 text-3xl font-semibold break-words">
          {car.custom_name}
        </p>
        <div>
          <p className="my-2 whitespace-pre-wrap">
            <span>Brand: </span>
            <span className="text-accent-400">{car.brand || ''}</span>
          </p>
          <p className="my-2 whitespace-pre-wrap">
            <span>Model: </span>
            <span className="text-accent-400">{car.model || ''}</span>
          </p>
          <p className="my-2 whitespace-pre-wrap">
            <span>License Plates: </span>
            <span className="text-accent-400">{car.license_plates || ''}</span>
          </p>
        </div>
      </Card>
    </Link>
  );
}
