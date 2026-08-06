import type { CarDto } from '@/car/application/dto/car';
import { CarImage } from '@/car/presentation/ui/image/image';
import { DashboardSection } from '@/dashboard/ui/section/section';
import { LabelIcon } from '@/icons/label';
import { SwatchIcon } from '@/icons/swatch';

type DetailsCardHeaderProps = {
  car?: CarDto;
};

export function DetailsCardHeader({ car }: DetailsCardHeaderProps) {
  return (
    <div className="flex items-center gap-5 md:gap-10">
      <CarImage
        className="w-4/12 overflow-hidden rounded-sm"
        src={car?.imageUrl}
      />

      <div className="flex w-full flex-col justify-evenly gap-1 self-stretch overflow-hidden">
        <DashboardSection.Heading
          className="truncate text-2xl leading-tight md:text-5xl"
          headingLevel="h1"
          title={car?.customName}
          withUnderline={false}
        >
          {car?.customName}
        </DashboardSection.Heading>

        {car?.licensePlates && (
          <p
            className="border-alpha-grey-200 bg-alpha-grey-50 w-fit max-w-full truncate rounded-sm border px-6 py-1 text-sm md:text-2xl"
            title={car.licensePlates}
          >
            {car.licensePlates}
          </p>
        )}

        {(car?.brand || car?.model) && (
          <div className="text-nowrap md:flex md:flex-col md:gap-3">
            <div className="flex items-center gap-3">
              <LabelIcon className="md:dark:stroke-accent-400/40 md:stroke-accent-500/50 hidden md:block md:h-7 md:w-7 md:stroke-2" />
              <div className="min-w-0">
                <p className="text-alpha-grey-900 hidden text-sm md:block">
                  BRAND
                </p>
                {car?.brand && (
                  <p className="truncate md:text-2xl" title={car.brand}>
                    {car.brand}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <SwatchIcon className="md:dark:stroke-accent-400/40 md:stroke-accent-500/50 hidden md:block md:h-7 md:w-7 md:stroke-2" />
              <div className="min-w-0">
                <p className="text-alpha-grey-900 hidden text-sm md:block">
                  MODEL
                </p>
                {car?.model && (
                  <p
                    className="text-alpha-grey-900 truncate text-sm md:text-xl md:text-inherit"
                    title={car.model}
                  >
                    {car.model}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
