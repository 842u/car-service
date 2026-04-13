import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { getCar } from '@/lib/supabase/tables/cars';
import { getCarOwnerships } from '@/lib/supabase/tables/cars_ownerships';
import { queryKeys } from '@/lib/tanstack/keys';
import { userDataSource } from '@/user/dependency/data-source';
import { queryKeys as userQueryKeys } from '@/user/infrastructure/tanstack/query/keys';
import { useSessionUser } from '@/user/presentation/hooks/use-session-user';

import type { SettingsSectionProps } from './settings';

export function useSettingsSection({ carId }: SettingsSectionProps) {
  const user = useSessionUser();

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
      //eslint-disable-next-line
      queryKey: userQueryKeys.usersByContext({ carId }),
      queryFn: async () => {
        const usersResult = await userDataSource.getUsersByIds(ownersId || []);

        if (!usersResult.success) {
          const { message } = usersResult.error;
          throw new Error(message);
        }

        return usersResult.data;
      },
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
