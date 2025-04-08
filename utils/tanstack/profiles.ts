import { QueryClient } from '@tanstack/react-query';

import { Profile, ToastType } from '@/types';

export async function onMutateProfileQueryMutation(
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

export function onErrorProfileQueryMutation(
  queryClient: QueryClient,
  queryKeyId: string,
  error: Error,
  context:
    | {
        previousQueryData: unknown;
      }
    | undefined,
  addToast: (message: string, type: ToastType) => void,
) {
  addToast(error.message, 'error');

  queryClient.setQueryData(
    ['profiles', queryKeyId],
    context?.previousQueryData,
  );
}
