import { Spinner } from '@/features/common/ui/decorative/Spinner/Spinner';

import { DashboardSection } from '../../../../features/dashboard/ui/DashboardSection/DashboardSection';
import { CarImage } from '../../images/CarImage/CarImage';

type CarIdentitySectionProps = {
  name?: string;
  imageUrl?: string | null;
  isPending?: boolean;
};

export function CarIdentitySection({
  imageUrl,
  name,
  isPending,
}: CarIdentitySectionProps) {
  return (
    <DashboardSection className="flex flex-col-reverse items-center gap-5 md:flex-row">
      <div className="w-full max-w-md overflow-hidden rounded-lg md:max-w-xs md:basis-1/4">
        {isPending && (
          <Spinner className="stroke-accent-400 fill-accent-400 h-full w-full p-20 md:p-10" />
        )}
        {!isPending && <CarImage src={imageUrl} />}
      </div>
      <h1 className="grow text-center text-3xl break-all whitespace-pre-wrap lg:break-normal">
        {name || ' '}
      </h1>
    </DashboardSection>
  );
}
