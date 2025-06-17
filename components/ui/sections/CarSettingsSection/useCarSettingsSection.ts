import { useQueries, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useToasts } from '@/hooks/useToasts';
import { getCar } from '@/utils/supabase/tables/cars';
import { getCarOwnerships } from '@/utils/supabase/tables/cars_ownerships';
import {
  getCurrentSessionProfile,
  getProfileByUserId,
} from '@/utils/supabase/tables/profiles';
import { queryKeys } from '@/utils/tanstack/keys';

import { CarSettingsSectionProps } from './CarSettingsSection';

export function useCarSettingsSection({ carId }: CarSettingsSectionProps) {
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

  const { data: ownersProfilesData } = useQueries({
    queries: allowDependentQueries
      ? carOwnershipData.map((ownership) => {
          return {
            throwOnError: false,
            queryKey: queryKeys.profilesByUserId(ownership.owner_id),
            queryFn: () => getProfileByUserId(ownership.owner_id),
          };
        })
      : [],
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
        pending: results.some((result) => result.isPending),
      };
    },
  });

  useEffect(() => {
    carOwnershipDataError && addToast(carOwnershipDataError.message, 'error');
  }, [addToast, carOwnershipDataError]);

  useEffect(() => {
    sessionProfileDataError &&
      addToast(sessionProfileDataError.message, 'error');
  }, [addToast, sessionProfileDataError]);

  const isCurrentUserPrimaryOwner = !!carOwnershipData?.find(
    (ownership) =>
      ownership.owner_id === sessionProfileData?.id &&
      ownership.is_primary_owner,
  );

  return {
    carData,
    carOwnershipData,
    sessionProfileData,
    ownersProfilesData,
    isPending,
    isCurrentUserPrimaryOwner,
  };
}
