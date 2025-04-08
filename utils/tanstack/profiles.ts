import { QueryClient } from '@tanstack/react-query';

import { Profile } from '@/types';

export async function profilesUpdateOnMutate(
  queryClient: QueryClient,
  queryKeyId: string,
  property: Exclude<keyof Profile, 'id'>,
  value: string | null,
) {
  await queryClient.cancelQueries({ queryKey: ['profiles', queryKeyId] });
  const previousQueryData = queryClient.getQueryData(['profiles', queryKeyId]);

  queryClient.setQueryData(
    ['profiles', queryKeyId],
    (currentQueryData: Profile) => {
      const updatedQueryData = { ...currentQueryData, [property]: value };

      return updatedQueryData;
    },
  );

  return { previousQueryData };
}
