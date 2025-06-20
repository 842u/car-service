import { QueryClient } from '@tanstack/react-query';

import { CarOwnership } from '@/types';

import { queryKeys } from './keys';

export async function carsOwnershipsAddOnMutate(
  queryClient: QueryClient,
  carId: string,
  newOwnerId: string | null,
) {
  await queryClient.cancelQueries({
    queryKey: queryKeys.carsOwnershipsByCarId(carId),
  });

  queryClient.setQueryData(
    queryKeys.carsOwnershipsByCarId(carId),
    (currentQueryData: CarOwnership[]) => {
      if (!newOwnerId) return currentQueryData;

      const updatedQuery: CarOwnership[] = [
        ...currentQueryData.map((ownership) => ({ ...ownership })),
        {
          created_at: new Date().toISOString(),
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

export function carsOwnershipsAddOnError(
  queryClient: QueryClient,
  context: { newOwnerId: string | null } | undefined,
  carId: string,
) {
  const currentQueryData: CarOwnership[] | undefined = queryClient.getQueryData(
    queryKeys.carsOwnershipsByCarId(carId),
  );

  if (currentQueryData) {
    const updatedQueryData: CarOwnership[] = [
      ...currentQueryData.map((ownership) => ({ ...ownership })),
    ];

    updatedQueryData.filter(
      (ownership) => ownership.owner_id !== context?.newOwnerId,
    );

    queryClient.setQueryData(
      queryKeys.carsOwnershipsByCarId(carId),
      updatedQueryData,
    );
  }
}

export async function carsOwnershipsUpdateOnMutate(
  queryClient: QueryClient,
  carId: string,
  newPrimaryOwnerId: string | null,
) {
  await queryClient.cancelQueries({
    queryKey: queryKeys.carsOwnershipsByCarId(carId),
  });

  queryClient.setQueryData(
    queryKeys.carsOwnershipsByCarId(carId),
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
          created_at: new Date().toISOString(),
          car_id: carId,
          is_primary_owner: true,
          owner_id: newPrimaryOwnerId,
        });

      return updatedQuery;
    },
  );

  return { newPrimaryOwnerId };
}

export function carsOwnershipsUpdateOnError(
  queryClient: QueryClient,
  context: { newPrimaryOwnerId: string | null } | undefined,
  carId: string,
) {
  const currentQueryData: CarOwnership[] | undefined = queryClient.getQueryData(
    queryKeys.carsOwnershipsByCarId(carId),
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

    queryClient.setQueryData(
      queryKeys.carsOwnershipsByCarId(carId),
      updatedQueryData,
    );
  }
}

export async function carsOwnershipsDeleteOnMutate(
  ownersIds: string[],
  queryClient: QueryClient,
  carId: string,
) {
  await queryClient.cancelQueries({
    queryKey: queryKeys.carsOwnershipsByCarId(carId),
  });
  const previousQueryData = queryClient.getQueryData([
    'cars_ownerships',
    carId,
  ]);

  queryClient.setQueryData(
    queryKeys.carsOwnershipsByCarId(carId),
    (currentQueryData: CarOwnership[]) => {
      const filteredQuery = currentQueryData.filter(
        (ownership) => !ownersIds.includes(ownership.owner_id),
      );

      const updatedQuery = filteredQuery.map((ownership) => ({
        ...ownership,
      }));

      return updatedQuery;
    },
  );

  return { previousQueryData };
}
