import { queryOptions, skipToken } from '@tanstack/react-query';

import { ownershipDataSource } from '@/car/ownership/dependency/data-source';
import { queryKeys } from '@/car/ownership/presentation/tanstack/query/keys';

export const getOwnershipsByCarIdQueryOptions = (carId: string) =>
  queryOptions({
    throwOnError: false,
    queryKey: queryKeys.byCarId(carId),
    queryFn: async () => {
      const ownershipsResult = await ownershipDataSource.getByCarId(carId);

      if (!ownershipsResult.success) {
        const { message } = ownershipsResult.error;
        throw new Error(message);
      }

      return ownershipsResult.data;
    },
  });

export const getOwnershipsByOwnerIdQueryOptions = (ownerId?: string) =>
  queryOptions({
    throwOnError: false,
    queryKey: queryKeys.byOwnerId(ownerId),
    queryFn: ownerId
      ? async () => {
          const ownershipsResult =
            await ownershipDataSource.getByOwnerId(ownerId);

          if (!ownershipsResult.success) {
            const { message } = ownershipsResult.error;
            throw new Error(message);
          }

          return ownershipsResult.data;
        }
      : skipToken,
  });
