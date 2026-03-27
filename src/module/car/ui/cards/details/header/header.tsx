import { CarImage } from '@/car/ui/image/image';
import { LabelIcon } from '@/icons/label';
import { SwatchIcon } from '@/icons/swatch';
import type { Car } from '@/types';

interface DetailsCardHeaderProps {
  data?: Car;
}

export function DetailsCardHeader({ data }: DetailsCardHeaderProps) {
  return (
    <div className="flex items-center gap-5 md:gap-10">
      <CarImage
        className="w-4/12 overflow-hidden rounded-sm md:w-full md:max-w-64"
        src={data?.image_url}
      />

      <div className="flex max-w-8/12 flex-col justify-evenly gap-1 self-stretch">
        <h2 className="overflow-x-auto text-2xl text-nowrap md:overflow-y-clip md:text-5xl">
          {data?.custom_name}
        </h2>

        {data?.license_plates && (
          <p className="border-alpha-grey-200 bg-alpha-grey-50 max-w-fit overflow-x-auto rounded-sm border px-6 py-1 text-sm md:text-2xl">
            {data.license_plates}
          </p>
        )}

        {(data?.brand || data?.model) && (
          <div className="text-nowrap md:flex md:flex-col md:gap-3">
            <div className="flex items-center gap-3">
              <LabelIcon className="md:dark:stroke-accent-400/40 md:stroke-accent-500/50 hidden md:block md:h-7 md:w-7 md:stroke-2" />
              <div>
                <p className="text-alpha-grey-900 hidden text-sm md:block">
                  BRAND
                </p>
                {data?.brand && (
                  <p className="overflow-x-auto md:text-2xl">{data.brand}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <SwatchIcon className="md:dark:stroke-accent-400/40 md:stroke-accent-500/50 hidden md:block md:h-7 md:w-7 md:stroke-2" />
              <div>
                <p className="text-alpha-grey-900 hidden text-sm md:block">
                  MODEL
                </p>
                {data?.model && (
                  <p className="text-alpha-grey-900 overflow-x-auto text-sm md:text-xl md:text-inherit">
                    {data.model}
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
