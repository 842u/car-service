import { QueryClient } from '@tanstack/react-query';

import { RemoveCarOwnershipFormValues } from '@/components/ui/RemoveCarOwnershipForm/RemoveCarOwnershipForm';
import { CarOwnership, Profile, ToastType } from '@/types';

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

export async function onMutateCarOwnershipDelete(
  carOwnershipFormData: RemoveCarOwnershipFormValues,
  queryClient: QueryClient,
  carId: string,
) {
  await queryClient.cancelQueries({ queryKey: ['cars_ownerships', carId] });
  const previousQueryData = queryClient.getQueryData([
    'cars_ownerships',
    carId,
  ]);

  queryClient.setQueryData(
    ['cars_ownerships', carId],
    (currentQueryData: CarOwnership[]) => {
      const filteredQuery = currentQueryData.filter(
        (ownership) =>
          !carOwnershipFormData.ownersIds.includes(ownership.owner_id),
      );

      const updatedQuery = filteredQuery.map((ownership) => ({
        ...ownership,
      }));

      return updatedQuery;
    },
  );

  return { previousQueryData };
}

export async function onMutateCarOwnershipPost(
  queryClient: QueryClient,
  carId: string,
  newOwnerId: string | null,
) {
  await queryClient.cancelQueries({ queryKey: ['cars_ownerships', carId] });

  queryClient.setQueryData(
    ['cars_ownerships', carId],
    (currentQueryData: CarOwnership[]) => {
      if (!newOwnerId) return currentQueryData;

      const updatedQuery: CarOwnership[] = [
        ...currentQueryData.map((ownership) => ({ ...ownership })),
        {
          car_id: carId,
          is_primary_owner: false,
          owner_id: newOwnerId,
        },
      ];

      return updatedQuery;
    },
  );

  return { newOwnerId };
}

export function onErrorCarOwnershipPost(
  queryClient: QueryClient,
  error: Error,
  context: { newOwnerId: string | null } | undefined,
  carId: string,
  addToast: (message: string, type: ToastType) => void,
) {
  addToast(error.message, 'error');

  const currentQueryData: CarOwnership[] | undefined = queryClient.getQueryData(
    ['cars_ownerships', carId],
  );

  if (currentQueryData) {
    const updatedQueryData: CarOwnership[] = [
      ...currentQueryData.map((ownership) => ({ ...ownership })),
    ];

    updatedQueryData.filter(
      (ownership) => ownership.owner_id !== context?.newOwnerId,
    );

    queryClient.setQueryData(['cars_ownerships', carId], updatedQueryData);
  }
}

export async function onMutateCarOwnershipPatch(
  queryClient: QueryClient,
  carId: string,
  newPrimaryOwnerId: string | null,
) {
  await queryClient.cancelQueries({ queryKey: ['cars_ownerships', carId] });

  queryClient.setQueryData(
    ['cars_ownerships', carId],
    (currentQueryData: CarOwnership[]) => {
      if (!newPrimaryOwnerId) return currentQueryData;

      const updatedQuery: CarOwnership[] = [
        ...currentQueryData.map((ownership) => {
          if (ownership.is_primary_owner)
            return { ...ownership, is_primary_owner: false };

          if (ownership.owner_id === newPrimaryOwnerId)
            return { ...ownership, is_primary_owner: true };

          return { ...ownership };
        }),
      ];

      const isNewPrimaryOwnerInOwners = updatedQuery.find(
        (ownership) => ownership.owner_id === newPrimaryOwnerId,
      );

      if (!isNewPrimaryOwnerInOwners)
        updatedQuery.push({
          car_id: carId,
          is_primary_owner: true,
          owner_id: newPrimaryOwnerId,
        });

      return updatedQuery;
    },
  );

  return { newPrimaryOwnerId };
}

export function onErrorCarOwnershipPatch(
  queryClient: QueryClient,
  error: Error,
  context: { newPrimaryOwnerId: string | null } | undefined,
  carId: string,
  addToast: (message: string, type: ToastType) => void,
) {
  addToast(error.message, 'error');

  const currentQueryData: CarOwnership[] | undefined = queryClient.getQueryData(
    ['cars_ownerships', carId],
  );

  if (currentQueryData) {
    const updatedQueryData: CarOwnership[] = [
      ...currentQueryData.map((ownership) => {
        if (ownership.owner_id === context?.newPrimaryOwnerId) {
          return { ...ownership, is_primary_owner: false };
        }
        return { ...ownership };
      }),
    ];

    queryClient.setQueryData(['cars_ownerships', carId], updatedQueryData);
  }
}
