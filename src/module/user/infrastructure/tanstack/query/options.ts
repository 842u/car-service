import { queryOptions } from '@tanstack/react-query';

import { userDataSource } from '@/user/dependency/data-source';
import { queryKeys } from '@/user/infrastructure/tanstack/query/keys';

export const getSessionUserQueryOptions = queryOptions({
  throwOnError: false,
  queryKey: queryKeys.sessionUser,
  queryFn: async () => {
    const userResult = await userDataSource.getSessionUser();

    if (!userResult.success) {
      const { message } = userResult.error;
      throw new Error(message);
    }

    return userResult.data;
  },
});

export const getCarOwnersQueryOptions = (context: {
  carId: string;
  ownerIds: string[];
}) =>
  queryOptions({
    throwOnError: false,
    queryKey: queryKeys.usersByContext(context),
    queryFn: async () => {
      const usersResult = await userDataSource.getUsersByIds(context.ownerIds);

      if (!usersResult.success) {
        const { message } = usersResult.error;
        throw new Error(message);
      }

      return usersResult.data;
    },
  });
