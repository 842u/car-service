import type { User as AuthIdentity } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { useToasts } from '@/common/presentation/hooks/use-toasts';
import { dependencyContainer, dependencyTokens } from '@/di';
import { queryKeys as userQueryKeys } from '@/user/infrastructure/tanstack/query/keys';
import { getCar } from '@/utils/supabase/tables/cars';
import { getCarOwnerships } from '@/utils/supabase/tables/cars_ownerships';
import { queryKeys } from '@/utils/tanstack/keys';

import type { SettingsSectionProps } from './settings';

export function useSettingsSection({ carId }: SettingsSectionProps) {
  const [user, setUser] = useState<AuthIdentity | null>(null);

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
        const userStore = await dependencyContainer.resolve(
          dependencyTokens.USER_STORE,
        );

        const usersResult = await userStore.getUsersByIds(ownersId || []);

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

  useEffect(() => {
    const getUser = async () => {
      const authClient = await dependencyContainer.resolve(
        dependencyTokens.AUTH_CLIENT_BROWSER,
      );

      const sessionResult = await authClient.getSession();

      if (!sessionResult.success) {
        setUser(null);
        return;
      }

      const authIdentity = sessionResult.data;

      setUser(authIdentity);
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
