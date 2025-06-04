'use client';

import { useCarContext } from '@/hooks/useCarContext';

import { CarImage } from '../../images/CarImage/CarImage';
import { DashboardSection } from '../../shared/DashboardSection/DashboardSection';

export function CarIdentitySection() {
  const car = useCarContext();

  return (
    <DashboardSection className="flex flex-col-reverse items-center gap-5 md:flex-row">
      <div className="w-full max-w-md overflow-hidden rounded-lg md:max-w-xs md:basis-1/4">
        <CarImage src={car.image_url} />
      </div>
      <h1 className="grow text-center text-3xl break-all whitespace-pre-wrap lg:break-normal">
        {car.custom_name}
      </h1>
    </DashboardSection>
  );
}
