import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { DashboardSection } from '@/dashboard/ui/section/section';
import { getCarsOwnershipsByOwnerId } from '@/lib/supabase/tables/cars_ownerships';
import { queryKeys } from '@/lib/tanstack/keys';
import { Spinner } from '@/ui/decorative/spinner/spinner';

interface TotalOwnershipsSectionProps {
  ownerId: string;
}

export function TotalOwnershipsSection({
  ownerId,
}: TotalOwnershipsSectionProps) {
  const { addToast } = useToasts();

  const {
    data: ownershipsData,
    error: ownershipsError,
    isError: ownershipsIsError,
  } = useQuery({
    throwOnError: false,
    queryKey: queryKeys.carsOwnershipsByOwnerId(ownerId),
    queryFn: async () => await getCarsOwnershipsByOwnerId(ownerId),
    enabled: !!ownerId,
  });

  useEffect(() => {
    ownershipsIsError && addToast(ownershipsError?.message || '', 'error');
  }, [ownershipsIsError, addToast, ownershipsError]);

  return (
    <DashboardSection>
      <DashboardSection.Heading>Cars owned</DashboardSection.Heading>
      <DashboardSection.Text className="text-9xl">
        {ownershipsData?.length || (
          <Spinner className="stroke-accent-400 fill-accent-400 my-10 h-16 w-full" />
        )}
      </DashboardSection.Text>
    </DashboardSection>
  );
}
