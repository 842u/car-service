import { queryOptions, skipToken } from '@tanstack/react-query';

import { ownershipDataSource } from '@/car/ownership/dependency/data-source';
import { queryKeys } from '@/car/ownership/infrastructure/tanstack/query/keys';
import { userDataSource } from '@/user/dependency/data-source';

export const getOwnershipsByCarIdQueryOptions = (carId: string) =>
  queryOptions({
    throwOnError: false,
    queryKey: queryKeys.ownershipsByCarId(carId),
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
    queryKey: queryKeys.ownershipsByOwnerId(ownerId),
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

/**
 * Reads owner display profiles from the User context (`userDataSource`), not
 * from Ownership's own data source.
 *
 * Living beside Ownership's own query options instead of a separate
 * presentation-layer directory is a pragmatic choice: it keeps every ownership
 * read colocated for a module this size, at the cost of this one export
 * crossing a bounded-context boundary that the rest of the file does not.
 */
export const getOwnerProfilesQueryOptions = ({
  carId,
  ownerIds,
}: {
  carId: string;
  ownerIds: string[];
}) =>
  queryOptions({
    throwOnError: false,
    queryKey: queryKeys.ownerProfilesByCarId(carId, ownerIds),
    queryFn: async () => {
      const usersResult = await userDataSource.getUsersByIds(ownerIds);

      if (!usersResult.success) {
        const { message } = usersResult.error;
        throw new Error(message);
      }

      return usersResult.data;
    },
  });
