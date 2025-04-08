'use client';

import { useQueries, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useToasts } from '@/hooks/useToasts';
import {
  getCarOwnerships,
  getCurrentSessionProfile,
  getProfile,
} from '@/utils/supabase/general';
import { getCar } from '@/utils/supabase/tables/cars';
import { queryKeys } from '@/utils/tanstack/keys';

import { CarBadge } from '../CarBadge/CarBadge';
import { CarDetailsSection } from '../CarDetailsSection/CarDetailsSection';
import { CarOwnershipSection } from '../CarOwnershipSection/CarOwnershipSection';

type CarOverviewProps = {
  carId: string;
};

export function CarOverview({ carId }: CarOverviewProps) {
  const { addToast } = useToasts();

  const { data: carData, isPending } = useQuery({
    throwOnError: false,
    queryKey: queryKeys.carsByCarId(carId),
    queryFn: () => getCar(carId),
  });

  const { data: carOwnershipData, error: carOwnershipDataError } = useQuery({
    throwOnError: false,
    queryKey: queryKeys.carsOwnershipsByCarId(carId),
    queryFn: () => getCarOwnerships(carId),
  });

  const { data: sessionProfileData, error: sessionProfileDataError } = useQuery(
    {
      throwOnError: false,
      queryKey: queryKeys.profilesCurrentSession,
      queryFn: getCurrentSessionProfile,
    },
  );

  const allowDependentQueries =
    sessionProfileData && carOwnershipData && carOwnershipData.length;

  const ownersProfilesData = useQueries({
    queries: allowDependentQueries
      ? carOwnershipData
          .filter((ownership) => ownership.owner_id !== sessionProfileData.id)
          .map((ownership) => {
            return {
              throwOnError: false,
              queryKey: queryKeys.profilesByUserId(ownership.owner_id),
              queryFn: () => getProfile(ownership.owner_id),
            };
          })
      : [],
  });

  const isCurrentUserPrimaryOwner = !!carOwnershipData?.find(
    (ownership) =>
      ownership.owner_id === sessionProfileData?.id &&
      ownership.is_primary_owner,
  );

  useEffect(() => {
    carOwnershipDataError && addToast(carOwnershipDataError.message, 'error');
    sessionProfileDataError &&
      addToast(sessionProfileDataError.message, 'error');
  }, [addToast, carOwnershipDataError, sessionProfileDataError]);

  return (
    <section className="w-full self-start p-5">
      <CarBadge
        imageUrl={carData?.image_url}
        isPending={isPending}
        name={carData?.custom_name}
      />
      <CarDetailsSection
        carData={carData}
        carId={carId}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
      />
      <CarOwnershipSection
        carId={carId}
        carOwnershipData={carOwnershipData}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
        ownersProfilesData={ownersProfilesData}
        sessionProfileData={sessionProfileData}
      />
    </section>
  );
}
