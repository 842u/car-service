import { CarImage } from '@/car/ui/image/image';
import type { Car } from '@/types';

interface DetailsCardHeaderProps {
  data?: Car;
}

export function DetailsCardHeader({ data }: DetailsCardHeaderProps) {
  return (
    <div className="flex items-center gap-5">
      <CarImage
        className="w-4/12 overflow-hidden rounded-sm"
        src={data?.image_url}
      />

      <div className="flex max-w-8/12 flex-col justify-evenly gap-1 self-stretch">
        <h2 className="overflow-x-auto text-2xl text-nowrap">
          {data?.custom_name}
        </h2>

        {data?.license_plates && (
          <p className="border-alpha-grey-200 bg-alpha-grey-50 max-w-fit overflow-x-auto rounded-sm border px-6 py-1 text-sm">
            {data.license_plates}
          </p>
        )}

        {(data?.brand || data?.model) && (
          <div className="text-nowrap">
            {data?.brand && <p className="overflow-x-auto">{data.brand}</p>}
            {data?.model && (
              <p className="text-alpha-grey-900 overflow-x-auto text-sm">
                {data.model}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
