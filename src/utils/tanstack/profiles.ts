import type { QueryClient } from '@tanstack/react-query';

import type { Profile } from '@/types';

import { queryKeys } from './keys';

export async function profilesUpdateOnMutate(
  queryClient: QueryClient,
  userId: string,
  property: Exclude<keyof Profile, 'id'>,
  value: string | null,
) {
  await queryClient.cancelQueries({
    queryKey: queryKeys.profilesByUserId(userId),
  });
  const previousQueryData = queryClient.getQueryData(
    queryKeys.profilesByUserId(userId),
  );

  queryClient.setQueryData(
    queryKeys.profilesByUserId(userId),
    (currentQueryData: Profile) => {
      const updatedQueryData = { ...currentQueryData, [property]: value };

      return updatedQueryData;
    },
  );

  return { previousQueryData };
}
