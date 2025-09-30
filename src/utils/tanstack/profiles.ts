import type { QueryClient } from '@tanstack/react-query';

import type { Profile } from '@/types';
import { queryKeys } from '@/user/infrastructure/tanstack/query/keys';

export async function profilesUpdateOnMutate(
  queryClient: QueryClient,
  userId: string,
  property: Exclude<keyof Profile, 'id'>,
  value: string | null,
) {
  await queryClient.cancelQueries({
    queryKey: queryKeys.userById(userId),
  });
  const previousQueryData = queryClient.getQueryData(
    queryKeys.userById(userId),
  );

  queryClient.setQueryData(
    queryKeys.userById(userId),
    (currentQueryData: Profile) => {
      const updatedQueryData = { ...currentQueryData, [property]: value };

      return updatedQueryData;
    },
  );

  return { previousQueryData };
}
