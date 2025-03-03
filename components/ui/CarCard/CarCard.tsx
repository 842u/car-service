import { Car } from '@/types';

import { Card } from '../Card/Card';
import { CarImagePreview } from '../CarImagePreview/CarImagePreview';

type CarCardProps = {
  car: Car;
};

export function CarCard({ car }: CarCardProps) {
  return (
    <Card className="flex max-h-[520px] w-80 flex-col justify-between self-stretch">
      <CarImagePreview
        className="relative aspect-square w-full"
        src={car.image_url}
      />
      <div className="">
        <p className="my-4 text-3xl font-semibold text-wrap">
          {car.custom_name}
        </p>
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
  );
}
