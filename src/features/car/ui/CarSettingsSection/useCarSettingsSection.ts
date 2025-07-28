import { User } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { useToasts } from '@/features/common/hooks/use-toasts';
import { createClient } from '@/utils/supabase/client';
import { getCar } from '@/utils/supabase/tables/cars';
import { getCarOwnerships } from '@/utils/supabase/tables/cars_ownerships';
import { getProfilesByUsersId } from '@/utils/supabase/tables/profiles';
import { queryKeys } from '@/utils/tanstack/keys';

import { CarSettingsSectionProps } from './CarSettingsSection';

export function useCarSettingsSection({ carId }: CarSettingsSectionProps) {
  const [user, setUser] = useState<User | null>(null);

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

  const allowDependentQueries = !!(carOwnershipData && carOwnershipData.length);

  const ownersId = carOwnershipData?.map((ownership) => ownership.owner_id);

  const { data: ownersProfilesData, error: ownersProfilesDataError } = useQuery(
    {
      throwOnError: false,
      // eslint-disable-next-line
      queryKey: queryKeys.profilesOwners,
      queryFn: () => getProfilesByUsersId(ownersId || []),
      enabled: allowDependentQueries,
    },
  );

  useEffect(() => {
    carOwnershipDataError && addToast(carOwnershipDataError.message, 'error');
  }, [addToast, carOwnershipDataError]);

  useEffect(() => {
    ownersProfilesDataError &&
      addToast(ownersProfilesDataError.message, 'error');
  }, [addToast, ownersProfilesDataError]);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    };

    getUser();
  }, []);

  const isCurrentUserPrimaryOwner = !!carOwnershipData?.find(
    (ownership) =>
      ownership.owner_id === user?.id && ownership.is_primary_owner,
  );

  return {
    carData,
    carOwnershipData,
    ownersProfilesData,
    isPending,
    isCurrentUserPrimaryOwner,
  };
}
